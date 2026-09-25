import coupleHero from "@/assets/couple-hero.jpg";
import bridePortrait from "@/assets/bride-portrait.jpg";
import coupleCandid from "@/assets/couple-candid.jpg";
import weddingDetail from "@/assets/wedding-detail.jpg";
import venue from "@/assets/venue.jpg";

/**
 * WEDDING INVITATION CONTENT
 * Edit this single file to update the invitation details.
 * Couple photos can be replaced later in src/assets.
 */
export const weddingConfig = {
  couple: {
    bride: "Sobana Devi",
    groom: "Sundaresan",
    brideShort: "Sobi",
    groomShort: "Sundar",
    monogram: "S · S",
    invitationLine:
      "Together with the love of our families and friends, we invite you to celebrate our wedding.",
    introduction:
      "After a journey that began with one unexpected message, two strangers became friends, then partners, and finally chose each other for life.",
  },

  weddingDate: "2026-10-25T08:00:00+05:30",
  dateLabel: "25 October 2026",
  timeLabel: "8:00 AM",
  placeLabel: "Bodinayakanur, Theni",
  blessing:
    "With the blessings of our elders and the love of the people who stood beside us, we begin our next chapter together.",
  tamilBlessing:
    "அன்பும் அறனும் உடைத்தாயின் இல்வாழ்க்கை பண்பும் பயனும் அது",

  story: [
    {
      year: "2019",
      title: "One unexpected message",
      text:
        "October 2019. A message meant for someone else accidentally reached Sundar. Sobi was trying to talk about her breakup, while Sundar had absolutely no idea who she was or why she was scolding him. One wrong number became the beginning of everything.",
    },
    {
      year: "2019",
      title: "From strangers to friends",
      text:
        "After clearing up the misunderstanding, they became strangers again for a while. Then Diwali came. A simple wish from Sobi, a reply from Sundar, and conversations slowly became longer. Somewhere inside those conversations, two strangers became close friends.",
    },
    {
      year: "2020",
      title: "The first yes took time",
      text:
        "About six months later, Sobi proposed. Sundar initially said no because they had never met in person. But Sobi never gave up. Her dedication stayed with him, and eventually Sundar said yes.",
    },
    {
      year: "2020–2022",
      title: "Two years of choosing each other",
      text:
        "For the next two years, they built a relationship without being able to meet in person. Distance became part of their story, but it never became a reason to walk away.",
    },
    {
      year: "2022",
      title: "The first meeting",
      text:
        "On October 1, 2022, Sobi's birthday, Sundar travelled to meet her for the first time. After years of knowing each other through a screen, they finally stood together in the same place. From that day, they became even closer.",
    },
    {
      year: "2025",
      title: "When life tested them",
      text:
        "On November 4, 2025, Sobi lost her father. While she was going through one of the hardest moments of her life, her family also decided that she should marry soon. Their relationship was strongly opposed, and the two of them were separated from each other.",
    },
    {
      year: "2026",
      title: "We chose each other",
      text:
        "There was a time when everything around them seemed to say they should separate. They chose not to. With support from Sundar's family and close friends, they decided to begin their life together and celebrate their marriage on October 25, 2026.",
    },
  ],

  // One wedding event only — no separate reception or other functions.
  events: [
    {
      type: "Muhurtham",
      label: "Wedding",
      date: "25 October 2026",
      time: "8:00 AM",
      venue: "Arulmigu Shri Subramaniya Swamy Temple",
      note: "Bodinayakanur, Theni",
    },
  ],

  venue: {
    name: "Arulmigu Shri Subramaniya Swamy Temple",
    address: "Subramaniya Swamy Temple, Bodinayakanur, Theni 625513",
    mapUrl: "https://maps.app.goo.gl/qf9RBUdXwzoEArsz5",
  },

  families: {
    bride: "Daughter of Manikandan & Ponlakshimi",
    groom: "Son of Thiruvarulselvam & Jayalakshmi",
    message:
      "With the blessings of our families and the love of our friends, we invite you to share this day with us.",
  },

  rsvp: {
    deadline: "We would be happy to celebrate this day with you.",
    phone: "6369952951",
    whatsappUrl:
      "https://wa.me/916369952951?text=I%20would%20love%20to%20join%20Sundaresan%20and%20Sobana%20Devi%27s%20wedding",
  },

  social: {
    shareTitle: "Sundaresan & Sobana Devi — Wedding Invitation",
    shareText:
      "Join us as we celebrate Sundaresan and Sobana Devi's wedding on 25 October 2026.",
  },

  images: {
    hero: coupleHero,
    bridePortrait,
    couple: coupleCandid,
    detail: weddingDetail,
    venue,
    gallery: [bridePortrait, coupleHero, coupleCandid, weddingDetail, venue],
  },

  colors: {
    background: "oklch(0.965 0.023 84)",
    foreground: "oklch(0.235 0.028 55)",
    primary: "oklch(0.34 0.105 22)",
    accent: "oklch(0.59 0.092 78)",
    leaf: "oklch(0.35 0.071 142)",
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
