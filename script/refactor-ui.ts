import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const targetDirs = [
  path.join(process.cwd(), 'src/app/super-admin'),
  path.join(process.cwd(), 'src/app/admin')
];

const regexes = [
  // Remove max-width and mx-auto
  { pattern: /\bmax-w-[1-9]xl\b/g, replacement: 'w-full' },
  { pattern: /\bmax-w-xs\b/g, replacement: 'max-w-xs' }, // keep this one (used in logs)
  { pattern: /\bmx-auto\b/g, replacement: '' },
  
  // Theme colors (only apply if dark: is not already present)
  { pattern: /\bbg-white\b(?! dark:)/g, replacement: 'bg-white dark:bg-slate-950' },
  { pattern: /\bbg-slate-50\b(?! dark:)/g, replacement: 'bg-slate-50 dark:bg-slate-900' },
  { pattern: /\bbg-slate-100\b(?! dark:)/g, replacement: 'bg-slate-100 dark:bg-slate-800' },
  
  { pattern: /\btext-slate-900\b(?! dark:)/g, replacement: 'text-slate-900 dark:text-white' },
  { pattern: /\btext-slate-800\b(?! dark:)/g, replacement: 'text-slate-800 dark:text-slate-100' },
  { pattern: /\btext-slate-700\b(?! dark:)/g, replacement: 'text-slate-700 dark:text-slate-200' },
  { pattern: /\btext-slate-600\b(?! dark:)/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { pattern: /\btext-slate-500\b(?! dark:)/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { pattern: /\btext-slate-400\b(?! dark:)/g, replacement: 'text-slate-400 dark:text-slate-500' },
  
  { pattern: /\bborder-slate-100\b(?! dark:)/g, replacement: 'border-slate-100 dark:border-slate-800' },
  { pattern: /\bborder-slate-200\b(?! dark:)/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { pattern: /\bborder-slate-300\b(?! dark:)/g, replacement: 'border-slate-300 dark:border-slate-700' },
  
  { pattern: /\bbg-blue-50\b(?! dark:)/g, replacement: 'bg-blue-50 dark:bg-blue-900/20' },
  { pattern: /\btext-blue-600\b(?! dark:)/g, replacement: 'text-blue-600 dark:text-blue-400' },
  { pattern: /\btext-blue-500\b(?! dark:)/g, replacement: 'text-blue-500 dark:text-blue-400' },
  
  { pattern: /\bbg-emerald-50\b(?! dark:)/g, replacement: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { pattern: /\btext-emerald-600\b(?! dark:)/g, replacement: 'text-emerald-600 dark:text-emerald-400' },

  { pattern: /\bbg-red-50\b(?! dark:)/g, replacement: 'bg-red-50 dark:bg-red-900/20' },
  { pattern: /\btext-red-600\b(?! dark:)/g, replacement: 'text-red-600 dark:text-red-400' },

  { pattern: /\bbg-amber-50\b(?! dark:)/g, replacement: 'bg-amber-50 dark:bg-amber-900/20' },
  { pattern: /\bbg-amber-100\b(?! dark:)/g, replacement: 'bg-amber-100 dark:bg-amber-900/30' },
  { pattern: /\btext-amber-700\b(?! dark:)/g, replacement: 'text-amber-700 dark:text-amber-400' },

  { pattern: /\bbg-green-100\b(?! dark:)/g, replacement: 'bg-green-100 dark:bg-green-900/30' },
  { pattern: /\btext-green-700\b(?! dark:)/g, replacement: 'text-green-700 dark:text-green-400' },
  { pattern: /\btext-green-500\b(?! dark:)/g, replacement: 'text-green-500 dark:text-green-400' },
  { pattern: /\bbg-red-100\b(?! dark:)/g, replacement: 'bg-red-100 dark:bg-red-900/30' },
  { pattern: /\btext-red-700\b(?! dark:)/g, replacement: 'text-red-700 dark:text-red-400' },
];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, (filePath) => {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        regexes.forEach(({ pattern, replacement }) => {
          content = content.replace(pattern, replacement);
        });

        // specific cleanup for double w-full or double spaces
        content = content.replace(/w-full w-full/g, 'w-full');
        content = content.replace(/  +/g, ' '); // remove extra spaces
        content = content.replace(/className=" /g, 'className="');
        content = content.replace(/ \/></g, ' />');

        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated: ${filePath}`);
        }
      }
    });
  }
});
