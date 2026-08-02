const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      if (content.includes('alert(')) {
        // Replace alert("...") with toast.success or toast.error based on the content
        let modified = false;
        
        content = content.replace(/alert\((.*?)\)/g, (match, p1) => {
          modified = true;
          // check if it's a success message (contains 'success' case-insensitive)
          if (p1.toLowerCase().includes('success')) {
            return `toast.success(${p1})`;
          } else {
            return `toast.error(${p1})`;
          }
        });
        
        // Add import { toast } from "sonner" if it was modified and not already present
        if (modified && !content.includes('import { toast } from "sonner"')) {
          // find the last import line
          const lines = content.split('\n');
          let lastImportIndex = -1;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
              lastImportIndex = i;
            }
          }
          
          if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, 'import { toast } from "sonner"');
            content = lines.join('\n');
          } else {
            content = 'import { toast } from "sonner"\n' + content;
          }
        }
        
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf-8');
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  }
}

processDirectory(path.join(__dirname, '../src'));
