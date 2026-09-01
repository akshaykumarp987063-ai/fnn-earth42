export interface ExistingIncident {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  createdAt: number;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateIncidentId: string | null;
  distanceMeters: number | null;
  reason: string;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadius = 6371000;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");
}

function similarity(a: string, b: string): number {
  const wordsA = new Set(normalize(a).split(" "));
  const wordsB = new Set(normalize(b).split(" "));

  const intersection = [...wordsA].filter((word) =>
    wordsB.has(word)
  ).length;

  const union = new Set([...wordsA, ...wordsB]).size;

  if (union === 0) {
    return 0;
  }

  return intersection / union;
}

export function checkDuplicate(
  newDescription: string,
  latitude: number,
  longitude: number,
  existingIncidents: ExistingIncident[],
  radiusMeters = 100
): DuplicateCheckResult {

  for (const incident of existingIncidents) {

    const distance = distanceMeters(
      latitude,
      longitude,
      incident.latitude,
      incident.longitude
    );

    if (distance > radiusMeters) {
      continue;
    }

    const textSimilarity = similarity(
      newDescription,
      incident.description
    );

    if (textSimilarity >= 0.35) {
      return {
        isDuplicate: true,
        duplicateIncidentId: incident.id,
        distanceMeters: Math.round(distance),
        reason:
          "A nearby incident has a sufficiently similar description.",
      };
    }
  }

  return {
    isDuplicate: false,
    duplicateIncidentId: null,
    distanceMeters: null,
    reason: "No nearby matching incident found.",
  };
}
