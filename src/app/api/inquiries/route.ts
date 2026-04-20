import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Determine which form submitted (Booking vs Contact)
    // Booking form has adults, children, pickupDate, dropDate
    // Contact form has departure, destination, travelDate, passengers, duration
    
    const data: any = {
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      message: body.message || null,
      status: "new",
    };

    if (body.pickupDate) {
      // Booking Form
      data.pickupDate = new Date(body.pickupDate);
      data.dropDate = new Date(body.dropDate);
      data.pickupLocation = body.pickupLocation;
      data.dropLocation = body.dropLocation;
      data.adults = body.adults;
      data.children = body.children;
    } else {
      // Contact Form
      data.fromCity = body.departure;
      data.toCity = body.destination;
      data.travelDate = body.travelDate;
      data.passengers = body.passengers;
      data.duration = body.duration;
    }

    const inquiry = await prisma.inquiry.create({
      data
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
