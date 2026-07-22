export type Project = {
  title: string;
  description: string;
  href: string;
};

/**
 * Add your projects here. Each item needs a title, short description, and live URL.
 *
 * Example:
 * {
 *   title: "Checkout redesign",
 *   description: "A faster purchase flow for a retail client.",
 *   href: "https://example.com",
 * },
 */
export const projects: Project[] = [
  {
    title: "Ellens bakery",
    description: "A bakery website with a portfolio of cakes and pastries.",
    href: "https://ellens-cakes.vercel.app/",
  },
  
  {
  title: "Barber Salon",
  description: "A barber salon website with a booking system and a blog.",
  href: "https://barber-salon-five.vercel.app/",
},
{
  title: "CueSing",
  description: "A karaoke website with a song library",
  href: "https://cue-sing.netlify.app/",
},
{
  title: "Studio Zero",
  description: "A karaoke website with a song library",
  href: "https://stuido-zero.vercel.app/",
},
];
