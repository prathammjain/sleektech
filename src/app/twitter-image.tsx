import { renderOgImage } from "@/lib/og-image";
import { SITE, OG } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: OG.width, height: OG.height };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
