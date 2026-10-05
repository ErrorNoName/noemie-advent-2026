import { publicUrl } from "../lib/publicUrl.ts";

export function GiftPhoto({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={publicUrl(src)} alt={alt} className={className ?? "gift-hero"} draggable={false} />;
}
