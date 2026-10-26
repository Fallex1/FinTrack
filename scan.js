const fs = require('fs');
const h = fs.readFileSync('vercel.html', 'utf8');
const keys = ['Building', 'npm install', 'npm run', 'next build', 'exit status', 'Module not found', 'Cannot find module', 'Command failed', 'Error:', 'Step ', 'build error', 'output.log'];
for (const k of keys) {
  const i = h.indexOf(k);
  if (i >= 0) {
    const ctx = h.slice(i - 60, i + 300).replace(/\s+/g, ' ');
    console.log(k + ' => ...' + ctx + '...');
  }
}
