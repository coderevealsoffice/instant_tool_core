import ColorPaletteCanvas from "@/components/workspace/tools/color-palette-canvas"
import { Metadata } from "next"

export const metadata = {
  title: "Free Color Palette Generator - Extract Colors from Images | InstantTool",
  description: "Generate beautiful color palettes instantly. Extract colors from images or create your own custom palettes for free.",
  alternates: {
    canonical: "https://devigo.cloud/color-tools/color-palette"
  }
};

export default function ColorPalettePage() {
  return <ColorPaletteCanvas />
}
