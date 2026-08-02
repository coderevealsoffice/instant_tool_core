import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/app/super-admin/page.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/bg-\[\#09090b\]/g, 'bg-white dark:bg-slate-950');
  
  // replace top level text-white inside that div:
  content = content.replace(/w-full bg-white dark:bg-slate-950 text-white/g, 'w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white');
  
  content = content.replace(/bg-\[\#18181b\]/g, 'bg-slate-50 dark:bg-slate-900');
  content = content.replace(/border-\[\#27272a\]\/50/g, 'border-slate-200 dark:border-slate-800/50');
  content = content.replace(/border-\[\#27272a\]/g, 'border-slate-200 dark:border-slate-800');
  content = content.replace(/text-\[\#a1a1aa\]/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/text-\[\#71717a\]/g, 'text-slate-400 dark:text-slate-500');
  content = content.replace(/hover:bg-\[\#27272a\]\/20/g, 'hover:bg-slate-100 dark:hover:bg-slate-800/50');
  
  // For other text-white in cards (except icons maybe)
  content = content.replace(/<span className="text-white">/g, '<span className="text-slate-900 dark:text-white">');
  content = content.replace(/<h2 className="text-lg font-semibold text-white">/g, '<h2 className="text-lg font-semibold text-slate-900 dark:text-white">');
  content = content.replace(/text-white flex items-center/g, 'text-slate-900 dark:text-white flex items-center');
  content = content.replace(/text-white truncate/g, 'text-slate-900 dark:text-white truncate');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed super-admin/page.tsx colors!');
}
