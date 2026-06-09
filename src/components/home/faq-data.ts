export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Home-page FAQ content. Shared between the visible <FAQ> accordion and the
 * FAQPage JSON-LD on the home page so the markup always matches what users
 * see on screen (a Google requirement for FAQ structured data).
 */
export const HOME_FAQS: FAQItem[] = [
  {
    question: "What is the best time to visit Himachal Pradesh?",
    answer:
      "The best time depends on your preference. For lush greenery and pleasant weather, March to June is ideal. For snow lovers, December to February is best. If you're visiting Spiti Valley, June to September is the most accessible window.",
  },
  {
    question: "Do I need any special permits for Spiti Valley or Rohtang Pass?",
    answer:
      "Yes, Rohtang Pass requires a daily permit which we can help arrange. For Spiti Valley, foreign nationals need an Inner Line Permit (ILP), while Indian nationals do not. We handle all permit documentation for our guests.",
  },
  {
    question: "Are your tour packages customizable?",
    answer:
      "Absolutely! Every itinerary on our website is a starting point. We specialize in 100% customized trips tailored to your budget, interests, and duration. Just talk to our travel experts.",
  },
  {
    question: "What kind of vehicles do you use for mountain travel?",
    answer:
      "We maintain a fleet of modern, well-serviced vehicles including Toyota Innova, Tempo Travellers (9-26 seats), and 4x4 SUVs for rugged terrains like Spiti. All our drivers are experienced in high-altitude mountain driving.",
  },
  {
    question: "Is it safe to travel to Himachal during the monsoon season?",
    answer:
      "While Himachal is beautiful in the rain, heavy monsoons (July-August) can sometimes lead to road closures. We monitor weather patterns daily and always prioritize guest safety, suggesting alternative routes or dates if necessary.",
  },
];
