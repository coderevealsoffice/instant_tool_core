import ColorPaletteCanvas from "@/components/workspace/tools/color-palette-canvas"
import { Metadata } from "next"

export const metadata = {
  title: "Free Color Palette Generator & Image Picker | InstantTool",
  description: "Generate beautiful color palettes instantly. Extract colors from images, find hex and RGB codes, and create custom palettes with zero software installation.",
  alternates: {
    canonical: "https://devigo.cloud/color-tools/color-palette"
  },
  keywords: [
    "color palette generator", "color picker online", "extract colors from image",
    "hex color finder", "rgb color picker", "palette maker", "InstantTool"
  ],
  openGraph: {
    title: "Free Color Palette Generator & Image Picker | InstantTool",
    description: "Generate beautiful color palettes instantly. Extract colors from images, find hex and RGB codes, and create custom palettes with zero software installation.",
    url: "https://devigo.cloud/color-tools/color-palette",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Color Palette Generator & Image Picker | InstantTool",
    description: "Generate beautiful color palettes instantly. Extract colors from images, find hex and RGB codes, and create custom palettes with zero software installation.",
  }
};

export default function ColorPalettePage() {
  return <ColorPaletteCanvas />
}
