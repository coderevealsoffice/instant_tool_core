import * as fs from 'fs';
import * as path from 'path';

const srcDir = path.join(process.cwd(), 'src/app/super-admin');
const destDir = path.join(process.cwd(), 'src/app/admin');

const foldersToMove = ['faqs', 'admins', 'settings', 'tool-matrix', 'queue', 'logs', 'users', 'billing', 'generations', 'blog', 'roles', 'features', 'legal', 'templates'];

foldersToMove.forEach(folder => {
  const sourcePath = path.join(srcDir, folder);
  const destPath = path.join(destDir, folder);
  
  if (fs.existsSync(sourcePath)) {
    // move folder
    if (!fs.existsSync(destPath)) {
      fs.renameSync(sourcePath, destPath);
      console.log(`Moved ${folder} to admin/`);
    } else {
      console.log(`Destination ${destPath} already exists, skipping move.`);
    }
  }
});

// Now recursively update all files in src/app/admin to replace '/super-admin' with '/admin'
function walkDir(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(destDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('/super-admin')) {
      content = content.replace(/\/super-admin/g, '/admin');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated paths in ${filePath}`);
    }
  }
});

console.log("Migration complete.");
