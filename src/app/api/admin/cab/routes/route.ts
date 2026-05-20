import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try { return NextResponse.json(await prisma.cabRoute.findMany({ orderBy: { createdAt: "desc" } })); }
  catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
export async function POST(req: Request) {
  try {
    const data = await req.json();
    return NextResponse.json(await prisma.cabRoute.create({ data }));
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
