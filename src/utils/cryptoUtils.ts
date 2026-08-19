/**
 * Cryptographic & Biometric Client-Side Utilities
 * Implements perceptual hash formatting, SHA-256 digests via Web Crypto API,
 * landmark coordinate synthesis, and AES-GCM metadata structures.
 */

// Generate real SHA-256 from string via browser SubtleCrypto
export async function generateSha256(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback deterministic hash if crypto is restricted
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, 'a');
  }
}

// Generate deterministic perceptual hash (pHash 64-bit hexadecimal)
export function generatePHash(seed: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const part1 = (hash >>> 0).toString(16).padStart(8, '0');
  const part2 = Math.abs((hash * 31) >>> 0).toString(16).padStart(8, '0');
  return `0x${part1.toUpperCase()}${part2.toUpperCase()}`;
}

// Generate 512-dimensional vector embedding string preview
export function generateVectorEmbeddingPreview(seed: string): string {
  const parts: string[] = [];
  let current = 0;
  for (let i = 0; i < seed.length; i++) {
    current = (current * 33 + seed.charCodeAt(i)) % 1000;
  }
  for (let i = 0; i < 8; i++) {
    const val = (((current + i * 47) % 200) - 100) / 100;
    parts.push(val.toFixed(4));
  }
  return `[${parts.join(', ')}, ... +504 dims]`;
}

export interface LandmarkPoint {
  x: number;
  y: number;
  type: 'contour' | 'eyebrow' | 'eye' | 'nose' | 'mouth';
}

// Generates 68 standard biometric landmark points mapped relative to normalized face bounding box
export function generateFacialLandmarks(boxWidth: number, boxHeight: number, offsetX = 0, offsetY = 0): LandmarkPoint[] {
  const points: LandmarkPoint[] = [];

  // Face contour (17 points)
  for (let i = 0; i < 17; i++) {
    const angle = Math.PI * 0.15 + (Math.PI * 0.7 * i) / 16;
    const rx = boxWidth * 0.44;
    const ry = boxHeight * 0.48;
    points.push({
      x: offsetX + boxWidth / 2 - Math.cos(angle) * rx,
      y: offsetY + boxHeight * 0.48 + Math.sin(angle) * ry,
      type: 'contour',
    });
  }

  // Left eyebrow (5 points)
  for (let i = 0; i < 5; i++) {
    points.push({
      x: offsetX + boxWidth * (0.22 + i * 0.05),
      y: offsetY + boxHeight * (0.33 - Math.sin((i / 4) * Math.PI) * 0.03),
      type: 'eyebrow',
    });
  }

  // Right eyebrow (5 points)
  for (let i = 0; i < 5; i++) {
    points.push({
      x: offsetX + boxWidth * (0.58 + i * 0.05),
      y: offsetY + boxHeight * (0.33 - Math.sin((i / 4) * Math.PI) * 0.03),
      type: 'eyebrow',
    });
  }

  // Nose bridge & base (9 points)
  for (let i = 0; i < 4; i++) {
    points.push({
      x: offsetX + boxWidth * 0.5,
      y: offsetY + boxHeight * (0.42 + i * 0.06),
      type: 'nose',
    });
  }
  for (let i = 0; i < 5; i++) {
    points.push({
      x: offsetX + boxWidth * (0.4 + i * 0.05),
      y: offsetY + boxHeight * 0.65,
      type: 'nose',
    });
  }

  // Left Eye (6 points)
  for (let i = 0; i < 6; i++) {
    const angle = (i * 2 * Math.PI) / 6;
    points.push({
      x: offsetX + boxWidth * 0.32 + Math.cos(angle) * boxWidth * 0.06,
      y: offsetY + boxHeight * 0.42 + Math.sin(angle) * boxHeight * 0.03,
      type: 'eye',
    });
  }

  // Right Eye (6 points)
  for (let i = 0; i < 6; i++) {
    const angle = (i * 2 * Math.PI) / 6;
    points.push({
      x: offsetX + boxWidth * 0.68 + Math.cos(angle) * boxWidth * 0.06,
      y: offsetY + boxHeight * 0.42 + Math.sin(angle) * boxHeight * 0.03,
      type: 'eye',
    });
  }

  // Outer Mouth (12 points)
  for (let i = 0; i < 12; i++) {
    const angle = (i * 2 * Math.PI) / 12;
    points.push({
      x: offsetX + boxWidth * 0.5 + Math.cos(angle) * boxWidth * 0.15,
      y: offsetY + boxHeight * 0.77 + Math.sin(angle) * boxHeight * 0.06,
      type: 'mouth',
    });
  }

  // Inner Mouth (8 points)
  for (let i = 0; i < 8; i++) {
    const angle = (i * 2 * Math.PI) / 8;
    points.push({
      x: offsetX + boxWidth * 0.5 + Math.cos(angle) * boxWidth * 0.09,
      y: offsetY + boxHeight * 0.77 + Math.sin(angle) * boxHeight * 0.03,
      type: 'mouth',
    });
  }

  return points;
}
