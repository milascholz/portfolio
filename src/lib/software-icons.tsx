import { SiAutodeskmaya, SiEtsy, SiFigma, SiFramer, SiInstagram, SiYoutube } from "react-icons/si";
import type { IconType } from "react-icons";

type SoftwareIconDef =
  | { key: string; kind: "component"; Icon: IconType; color: string }
  | { key: string; kind: "image"; src: string };

// Figma, Framer, Maya, and YouTube have real brand icons in react-icons'
// simple-icons set — those render as a single currentColor path, so each
// gets its canonical brand hex (from simple-icons' own metadata) instead of
// inheriting the surrounding grey text color. Photoshop, After Effects, and
// Premiere Pro are official SVGs pulled from Adobe's own public CDN
// (adobe.com/cc-shared/assets/img/product-icons/svg/, served with open CORS
// for exactly this kind of embedding) and already carry their own color.
// Canva's is the icon mark from the official logo pack Canva publishes for
// third-party integrations (canva.dev/docs/apps/rest-apis/brand-guidelines)
// — all saved locally under public/icons/software/.
const SOFTWARE_ICONS: Record<string, SoftwareIconDef> = {
  figma: { key: "figma", kind: "component", Icon: SiFigma, color: "#F24E1E" },
  framer: { key: "framer", kind: "component", Icon: SiFramer, color: "#0055FF" },
  maya: { key: "maya", kind: "component", Icon: SiAutodeskmaya, color: "#37A5CC" },
  youtube: { key: "youtube", kind: "component", Icon: SiYoutube, color: "#FF0000" },
  photoshop: { key: "photoshop", kind: "image", src: "/icons/software/photoshop.svg" },
  "after effects": { key: "after-effects", kind: "image", src: "/icons/software/after-effects.svg" },
  "premiere pro": { key: "premiere-pro", kind: "image", src: "/icons/software/premiere-pro.svg" },
  canva: { key: "canva", kind: "image", src: "/icons/software/canva.svg" },
  instagram: { key: "instagram", kind: "component", Icon: SiInstagram, color: "#E4405F" },
  etsy: { key: "etsy", kind: "component", Icon: SiEtsy, color: "#F16521" },
};

export function getSoftwareIcon(name: string): SoftwareIconDef | null {
  return SOFTWARE_ICONS[name.trim().toLowerCase()] ?? null;
}

export function formatSoftwareList(software: string[]): string {
  if (software.length <= 2) return software.join(" and ");
  return `${software.slice(0, -1).join(", ")}, and ${software[software.length - 1]}`;
}

/** Resolves each name to its icon, deduped by icon identity (so e.g. two
 * names that happen to share an icon only render one badge). */
export function getUniqueSoftwareIcons(software: string[]): { icon: SoftwareIconDef; label: string }[] {
  const byKey = new Map<string, { icon: SoftwareIconDef; labels: string[] }>();
  for (const name of software) {
    const icon = getSoftwareIcon(name);
    if (!icon) continue;
    const entry = byKey.get(icon.key) ?? { icon, labels: [] };
    entry.labels.push(name);
    byKey.set(icon.key, entry);
  }
  return Array.from(byKey.values()).map(({ icon, labels }) => ({ icon, label: labels.join(", ") }));
}
