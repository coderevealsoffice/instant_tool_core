const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let count = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace drag container border colors
  content = content.replace(
    /border-white bg-white\/20/g,
    'border-emerald-500 bg-emerald-50'
  );
  content = content.replace(
    /border-white\/30 hover:border-white\/50/g,
    'border-emerald-200 hover:border-emerald-400'
  );

  // Replace generic border-white/30 if it's there
  content = content.replace(
    /border-white\/30/g,
    'border-emerald-200'
  );

  // Replace UploadCloud icon color
  content = content.replace(
    /text-white mb-6 mx-auto/g,
    'text-emerald-500 mb-6 mx-auto'
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + file);
    count++;
  }
}

console.log('Finished fixing ' + count + ' files.');
