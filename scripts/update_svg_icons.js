import fs from 'fs';

const pureSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="512" height="512">
  <circle cx="100" cy="100" r="92" fill="#071217" stroke="#16313B" stroke-width="2.5" />
  <circle cx="124" cy="74" r="14" fill="#10B981" />
  <path d="M 100 47 A 53 53 0 1 0 148 122 A 11 11 0 0 0 128 113 A 31 31 0 1 1 100 69 Z" fill="#10B981" />
  <path d="M 60 120 A 53 53 0 0 0 120 151 A 53 53 0 0 0 148 122 A 11 11 0 0 0 128 113 A 31 31 0 0 1 78 110 Z" fill="#059669" opacity="0.8" />
</svg>`;

fs.writeFileSync('public/icon-192.svg', pureSvgContent);
fs.writeFileSync('public/icon-512.svg', pureSvgContent);
fs.writeFileSync('public/icon-maskable.svg', pureSvgContent);

console.log('SVG icon files updated with exact 1:1 official logo in public/');
