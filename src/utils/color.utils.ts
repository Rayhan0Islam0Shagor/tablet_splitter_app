const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const generateRandomLightColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 40 + Math.floor(Math.random() * 40);
  const lightness = 70 + Math.floor(Math.random() * 20);

  return hslToHex(hue, saturation, lightness);
};

/**
 * Convert hex color to HSL
 */
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
};

/**
 * Calculate color similarity using HSL color space (more perceptually accurate)
 * Returns a value between 0 (completely different) and 1 (identical)
 */
const getColorSimilarity = (color1: string, color2: string): number => {
  const hsl1 = hexToHsl(color1);
  const hsl2 = hexToHsl(color2);

  // Calculate hue difference (circular - 360 wraps to 0)
  let hueDiff = Math.abs(hsl1.h - hsl2.h);
  if (hueDiff > 180) {
    hueDiff = 360 - hueDiff;
  }
  const hueSimilarity = 1 - hueDiff / 180;

  // Calculate saturation difference
  const satDiff = Math.abs(hsl1.s - hsl2.s);
  const satSimilarity = 1 - satDiff / 100;

  // Calculate lightness difference
  const lightDiff = Math.abs(hsl1.l - hsl2.l);
  const lightSimilarity = 1 - lightDiff / 100;

  // Weighted similarity (hue is most important for distinguishing colors)
  const similarity =
    hueSimilarity * 0.6 + satSimilarity * 0.2 + lightSimilarity * 0.2;

  return similarity;
};

/**
 * Generate a unique light color that is perceptually different from used colors
 * Uses stricter similarity threshold to avoid similar colors
 */
export const generateUniqueColor = (
  usedColors: string[],
  maxAttempts: number = 100,
  minSimilarityThreshold: number = 0.25, // Stricter threshold (lower = more different)
): string => {
  if (usedColors.length === 0) {
    return generateRandomLightColor();
  }

  let attempts = 0;
  let bestColor: string = generateRandomLightColor();
  let bestSimilarity = 1; // Track the best (lowest similarity) color found

  // Try to find a color that's sufficiently different from all used colors
  while (attempts < maxAttempts) {
    const newColor = generateRandomLightColor();
    attempts++;

    // Calculate maximum similarity with any used color
    const maxSimilarity = Math.max(
      ...usedColors.map(usedColor => getColorSimilarity(newColor, usedColor)),
    );

    // If this color is sufficiently different from all used colors
    if (maxSimilarity < minSimilarityThreshold) {
      return newColor;
    }

    // Keep track of the best color found (lowest similarity)
    if (maxSimilarity < bestSimilarity) {
      bestSimilarity = maxSimilarity;
      bestColor = newColor;
    }
  }

  // If we couldn't find a perfectly different color, return the best one found
  return bestColor;
};

export const generateRandomColor = (): string => {
  return generateRandomLightColor();
};
