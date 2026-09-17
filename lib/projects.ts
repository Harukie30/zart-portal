export type Project = {
  title: string;
  description: string;
  href: string;
  /** Short genre-style label for poster cards */
  tag?: string;
  /** Optional poster accent hex; falls back to brand/signal */
  accent?: string;
};

export const projects: Project[] = [
  {
    title: "Ellens bakery",
    description: "A bakery website with a portfolio of cakes and pastries.",
    href: "https://ellens-cakes.vercel.app/",
    tag: "Bakery",
    accent: "#c45c26",
  },
  {
    title: "Barber Salon",
    description: "A barber salon website with a booking system and a blog.",
    href: "https://barber-salon-five.vercel.app/",
    tag: "Booking",
    accent: "#0c3b38",
  },
  {
    title: "CueSing",
    description: "A karaoke website with a song library",
    href: "https://cue-sing.netlify.app/",
    tag: "Karaoke",
    accent: "#1a4f4a",
  },
  {
    title: "Studio Zero",
    description: "A karaoke website with a song library",
    href: "https://stuido-zero.vercel.app/",
    tag: "Studio",
    accent: "#062422",
  },
  {
    title: "Mangrove Apartelle",
    description: "A apartelle website with a booking system.",
    href: "https://mangrove-apartelle.vercel.app/",
    tag: "Hospitality",
    accent: "#2a6b5f",
  },
  {
    title: "Pickleball App",
    description:
      "Live court timers, rentals, built for pickleball facilities running a busy front desk.",
    href: "https://pickle-monitor-net.vercel.app/",
    tag: "Ops",
    accent: "#a84b1d",
  },
  {
    title: "AEON",
    description: "Advanced Environmental Observational Network",
    href: "https://aeon-murex.vercel.app/",
    tag: "Research",
    accent: "#0c3b38",
  },
];

export function projectInitials(title: string) {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "VE";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
