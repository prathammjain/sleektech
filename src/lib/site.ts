/**
 * Single source of truth for site-wide metadata, SEO and structured data.
 * Update brand details, canonical URL and social profiles here.
 */
export const SITE = {
  name: "SleekTech",
  legalName: "SleekTech",
  /**
   * Canonical origin. Matches the Vercel primary domain (www).
   * If you switch the primary to the apex in Vercel, change this to
   * "https://sleektech.in".
   */
  url: "https://www.sleektech.in",
  domain: "sleektech.in",

  title: "SleekTech | Web & Mobile Apps, Automation & AI",
  description:
    "SleekTech designs and ships production software: websites, web and mobile apps, automations and AI agents. Built by a senior engineering collective in India.",
  tagline: "We build software that just works.",

  email: "sleektechventures@gmail.com",
  locale: "en_IN",
  twitterHandle: "@sleektech", // update when the account exists

  // Public social / profile URLs (used in Organization JSON-LD sameAs).
  // Add real profiles as they go live.
  socials: [] as string[],

  keywords: [
    "software development company",
    "web app development",
    "mobile app development",
    "n8n automation",
    "workflow automation",
    "AI agents",
    "AI chatbots",
    "RAG chatbot development",
    "Next.js development",
    "SaaS development",
    "custom software development",
    "engineering collective",
    "software studio India",
  ],

  // Services advertised in structured data (kept in sync with the landing page).
  services: [
    "Websites & Landing Pages",
    "Web Apps & SaaS",
    "Mobile Apps",
    "Automations",
    "AI Agents & Chatbots",
    "Data & Internal Tools",
  ],
} as const;

export const OG = {
  width: 1200,
  height: 630,
} as const;
