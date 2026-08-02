import { TOOL_CATEGORIES } from "./src/config/menu";
import { toolsRegistry } from "./src/lib/tools-registry";

const missing: string[] = [];
TOOL_CATEGORIES.forEach(category => {
  category.tools.forEach(tool => {
    // extract category and slug from href
    // href format: /category/slug
    const parts = tool.href.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const cat = parts[0];
      const slug = parts[1];
      if (!toolsRegistry[cat] || !toolsRegistry[cat][slug]) {
        missing.push(tool.href);
      }
    }
  });
});

console.log("Missing Tools:");
missing.forEach(m => console.log(m));
