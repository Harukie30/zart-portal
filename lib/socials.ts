export type SocialLink = {
  id: "github" | "linkedin" | "x" | "email";
  label: string;
  href: string;
};

/**
 * Swap these hrefs with your real profiles.
 * Remove an item from the array if you do not want it shown.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Harukie30",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/amadeus-mozart-labao-5829a241b",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/",
  },
  {
    id: "email",
    label: "Email",
    href: "amadeusmozartlabao@gmail.com",
  },
];
