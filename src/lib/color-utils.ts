export type HSL = { h: number; s: number; l: number };

export function hexToHsl(hex: string): HSL {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex({ h, s, l }: HSL): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Adjust Hue keeping it in 0-360 range
const shiftHue = (h: number, amount: number) => (h + amount + 360) % 360;
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export function generatePalettes(hex: string) {
  const baseHsl = hexToHsl(hex);
  
  // Helpers
  const genHex = (hOffset: number, sOffset = 0, lOffset = 0) => {
    return hslToHex({
      h: shiftHue(baseHsl.h, hOffset),
      s: clamp(baseHsl.s + sOffset, 0, 100),
      l: clamp(baseHsl.l + lOffset, 0, 100)
    });
  };

  const base = hex.toUpperCase();

  return {
    monochromatic: [
      genHex(0, 0, -30),
      genHex(0, 0, -15),
      base,
      genHex(0, 0, 15),
      genHex(0, 0, 30),
    ],
    analogous: [
      genHex(-60),
      genHex(-30),
      base,
      genHex(30),
      genHex(60),
    ],
    complementary: [
      base,
      genHex(0, -20, 10), // A softer version of base
      genHex(180, -20, 10), // A softer version of complement
      genHex(180), // True complement
      genHex(180, 0, -15), // Darker complement
    ],
    splitComplementary: [
      genHex(150),
      genHex(150, -20, 10),
      base,
      genHex(210, -20, 10),
      genHex(210),
    ],
    triadic: [
      genHex(120),
      genHex(120, -20, 10),
      base,
      genHex(240, -20, 10),
      genHex(240),
    ],
    tetradic: [
      base,
      genHex(90),
      genHex(180),
      genHex(270),
      genHex(180, -30, 20), // Neutral filler
    ],
    shades: [
      genHex(0, 0, -40),
      genHex(0, 0, -30),
      genHex(0, 0, -20),
      genHex(0, 0, -10),
      base,
    ],
    tints: [
      base,
      genHex(0, 0, 15),
      genHex(0, 0, 30),
      genHex(0, 0, 45),
      genHex(0, 0, 60),
    ]
  };
}
