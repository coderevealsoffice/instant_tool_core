import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const adminDir = path.join(process.cwd(), 'src/app/admin');

if (fs.existsSync(adminDir)) {
  walkDir(adminDir, (filePath) => {
    if (filePath.endsWith('page.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Look for the main container which usually is `<div className="p-8 w-full..."`
      // or similar, and add max-w-6xl mx-auto
      content = content.replace(/className="p-8 w-full/g, 'className="p-8 max-w-6xl mx-auto w-full');
      content = content.replace(/className="p-8 max-w-5xl mx-auto w-full/g, 'className="p-8 max-w-6xl mx-auto w-full'); // fixing previous versions if any
      content = content.replace(/className="max-w-[0-9]xl mx-auto/g, 'className="max-w-6xl mx-auto'); // replace existing
      
      // If it doesn't match the specific p-8 w-full, try finding the first div after return (
      // A bit risky but let's try a safer regex for top level div
      content = content.replace(/<div className="w-full space-y-8">/g, '<div className="max-w-6xl mx-auto w-full space-y-8">');
      content = content.replace(/<div className="w-full bg-white/g, '<div className="max-w-6xl mx-auto w-full bg-white');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  });
}
