// EDIT THIS FILE TO PUBLISH POSTS. Newest posts go first.
// Put photos into assets/ and reference them as "assets/my-photo.jpg".
// Blocks can have type "paragraph", "heading", or "image".
window.BLOG_POSTS = [
  {
    slug: "the-art-of-noticing",
    title: "The art of noticing",
    date: "2026-10-25",
    excerpt: "A note about slowing down, paying attention, and the small things that stick with us.",
    cover: "assets/morning-light.svg",
    blocks: [
      { type: "paragraph", text: "Lately I've been trying to pay closer attention to the small things. The light that lands on a windowsill. A sentence overheard on the way home. How a familiar street changes after rain." },
      { type: "image", src: "assets/morning-light.svg", alt: "Stylized hills beneath a warm morning sky", caption: "A little morning light." },
      { type: "paragraph", text: "This is a space for whatever feels worth keeping: notes, photographs, observations, and questions without tidy answers." },
      { type: "paragraph", text: "Make yourself at home. Leave a thought below if something resonates. Your comment will be signed by a random animal instead of your name." }
    ]
  },
  {
    slug: "a-place-to-begin",
    title: "A place to begin",
    date: "2026-10-18",
    excerpt: "Every corner of the internet starts somewhere. This one starts here.",
    cover: "assets/window.svg",
    blocks: [
      { type: "paragraph", text: "A new space, intentionally simple. No feeds to chase, no usernames to remember. Just words and images." },
      { type: "image", src: "assets/window.svg", alt: "Minimal illustration of a window and plant", caption: "Room to start something new." },
      { type: "paragraph", text: "More soon." }
    ]
  }
];
