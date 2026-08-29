import { KnownLocation } from "@/types";
import { TranslationSchema } from "@/locales/types";

/**
 * Maps known location IDs (from Windows/macOS/Linux platform detector)
 * to dynamic localized labels.
 */
export function getKnownLocationLabel(loc: KnownLocation, t: TranslationSchema): string {
  if (loc.id === "loc-desktop" || loc.id === "desktop") return t.quickLocations.desktop;
  if (loc.id === "loc-documents" || loc.id === "documents") return t.quickLocations.documents;
  if (loc.id === "loc-Projects" || loc.id === "projects") return t.quickLocations.projects;
  if (loc.id === "loc-Code" || loc.id === "code") return t.quickLocations.code;
  if (loc.id === "loc-Dev" || loc.id === "loc-Development" || loc.id === "dev") return t.quickLocations.dev;
  if (loc.id === "loc-source-repos" || loc.id === "repos") return t.quickLocations.repos;
  return loc.label;
}
