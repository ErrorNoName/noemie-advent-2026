/** Native transparent gift packages. The white-halo pin is not included. */
export const PACK = {
  pouch: "stickers/packages/polka-pouch-button.webp",
  peach: "stickers/packages/peach-blue-bow.webp",
  tissue: "stickers/packages/hot-pink-tissue.webp",
  journal: "stickers/packages/yellow-junk-journal-box.webp",
  fruit: "stickers/packages/fruit-love-you.webp",
  star: "stickers/packages/pastel-star-bag.webp",
} as const;

export const DOOR: Record<number, string> = {
  1: PACK.pouch,
  2: PACK.peach,
  3: "stickers/jour-3/teddy-1.webp",
  4: PACK.star,
  5: PACK.journal,
  6: "stickers/jour-6/gift-basket.webp",
  7: PACK.tissue,
  8: "stickers/jour-8/bouquet-1.webp",
};

export const SCENE_CUTS: Record<number, readonly string[]> = {
  1: [PACK.pouch, "stickers/jour-1/labubu-bunny.webp", "stickers/jour-1/blindbox-figure.webp"],
  2: [PACK.peach, "stickers/jour-2/squishy-cakepop.webp", "stickers/jour-2/stress-ball.webp"],
  3: ["stickers/jour-3/teddy-heart.webp", "stickers/jour-3/teddy-blue.webp", "stickers/jour-3/teddy-2.webp"],
  4: [PACK.fruit, PACK.star, "stickers/jour-4/gashapon-capsule.webp"],
  5: [PACK.journal, "stickers/jour-5/butterfly-clip.webp", "stickers/jour-5/hairpin-flower.webp"],
  6: ["stickers/jour-6/candy-basket.webp", "stickers/jour-6/bubble-tea-2.webp", "stickers/jour-6/keychain-unicorn.webp"],
  7: [PACK.tissue, "stickers/jour-7/lighter-orange.webp"],
  8: ["stickers/jour-8/giant-teddy-2.webp", "stickers/jour-8/bouquet-2.webp", "stickers/jour-8/eclair-2.webp"],
};
