import fs from 'fs';

function createSvgIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#071217" rx="128"/>
    <circle cx="256" cy="256" r="180" fill="none" stroke="#10B981" stroke-width="36"/>
    <path d="M160 260 L230 330 L350 190" fill="none" stroke="#10B981" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

fs.writeFileSync('public/icon-192.svg', createSvgIcon(192));
fs.writeFileSync('public/icon-512.svg', createSvgIcon(512));
fs.writeFileSync('public/icon-maskable.svg', createSvgIcon(512));

console.log('SVG Icons created successfully in public/');
