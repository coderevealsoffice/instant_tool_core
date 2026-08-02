import fs from 'fs';
import path from 'path';

const pages = [
  { file: 'src/app/auth/login/page.tsx', title: 'Login | Instant Tool', desc: 'Login to your Instant Tool account.' },
  { file: 'src/app/auth/register/page.tsx', title: 'Register | Instant Tool', desc: 'Create a free Instant Tool account.' },
  { file: 'src/app/(public)/tools/page.tsx', title: 'All Tools | Instant Tool', desc: 'Browse all available PDF, Image, and QR Code tools.' },
  { file: 'src/app/(public)/pricing/page.tsx', title: 'Pricing | Instant Tool', desc: 'Affordable pricing plans for premium features.' },
  { file: 'src/app/(public)/pdf-tools/page.tsx', title: 'PDF Tools | Instant Tool', desc: 'Free online tools to compress, merge, split, and rotate PDFs.' },
  { file: 'src/app/dashboard/page.tsx', title: 'Dashboard | Instant Tool', desc: 'Manage your files and account.' },
  { file: 'src/app/dashboard/history/page.tsx', title: 'History | Instant Tool', desc: 'View your tool usage history.' },
  { file: 'src/app/dashboard/billing/page.tsx', title: 'Billing | Instant Tool', desc: 'Manage your billing and subscriptions.' },
];

for (const p of pages) {
  const filePath = path.resolve(p.file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('export const metadata')) continue;
  
  const metadataBlock = `
export const metadata = {
  title: "${p.title}",
  description: "${p.desc}",
};

`;
  
  // Insert before 'export default function' or 'export default function'
  if (content.includes('export default function')) {
    content = content.replace('export default function', metadataBlock + 'export default function');
  } else {
    // maybe it has 'const Page' and 'export default Page'
    // fallback, append to top after imports. Wait, 'use client' might be at the top!
    // Metadata can only be exported from Server Components!
    // If it's a client component ('use client'), metadata CANNOT be exported from the same file.
    console.log(`${p.file} might be a client component or different format.`);
  }
  
  if (content.includes('"use client"') && content.includes('export const metadata')) {
    console.error(`ERROR: Cannot export metadata from client component ${p.file}`);
  } else {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${p.file}`);
  }
}
