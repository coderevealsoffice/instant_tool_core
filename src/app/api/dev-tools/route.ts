import { NextRequest, NextResponse } from "next/server";
import { minify as minifyJs } from "terser";
import CleanCSS from "clean-css";
import prettier from "prettier";

export async function POST(req: NextRequest) {
  try {
    const { action, code } = await req.json();

    if (!code || !action) {
      return NextResponse.json({ error: "Missing code or action" }, { status: 400 });
    }

    let result = "";

    switch (action) {
      case "minify-js":
        const jsOutput = await minifyJs(code);
        result = jsOutput.code || "";
        break;

      case "minify-css":
        const cssOutput = new CleanCSS({}).minify(code);
        if (cssOutput.errors.length > 0) {
          throw new Error(cssOutput.errors[0]);
        }
        result = cssOutput.styles;
        break;

      case "format-html":
        result = await prettier.format(code, {
          parser: "html",
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Dev Tools API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process code" }, { status: 500 });
  }
}
