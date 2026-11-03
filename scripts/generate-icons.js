import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG source with cute rabbit mascot with Arabic letter 'أ' on a magic book/cloud
const svgContent = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="50%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="bubbleGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background rounded squircle / circle -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>

  <!-- Fun stars floating -->
  <path d="M90 100 L95 115 L110 120 L95 125 L90 140 L85 125 L70 120 L85 115 Z" fill="#FDE047"/>
  <path d="M420 90 L424 102 L436 106 L424 110 L420 122 L416 110 L404 106 L416 102 Z" fill="#FDE047"/>
  <path d="M410 400 L414 412 L426 416 L414 420 L410 432 L406 420 L394 416 L406 412 Z" fill="#FDE047"/>
  <path d="M100 390 L104 402 L116 406 L104 410 L100 422 L96 410 L84 406 L96 402 Z" fill="#FDE047"/>

  <!-- Cute Rabbit Ears -->
  <ellipse cx="206" cy="140" rx="28" ry="70" fill="#FFFFFF" transform="rotate(-15 206 140)"/>
  <ellipse cx="206" cy="140" rx="14" ry="48" fill="#F472B6" transform="rotate(-15 206 140)"/>

  <ellipse cx="306" cy="140" rx="28" ry="70" fill="#FFFFFF" transform="rotate(15 306 140)"/>
  <ellipse cx="306" cy="140" rx="14" ry="48" fill="#F472B6" transform="rotate(15 306 140)"/>

  <!-- Rabbit Head -->
  <circle cx="256" cy="240" r="105" fill="#FFFFFF" filter="url(#glow)"/>

  <!-- Cheeks -->
  <circle cx="195" cy="265" r="16" fill="#FBCFE8"/>
  <circle cx="317" cy="265" r="16" fill="#FBCFE8"/>

  <!-- Eyes -->
  <circle cx="215" cy="225" r="12" fill="#1E1B4B"/>
  <circle cx="218" cy="222" r="4" fill="#FFFFFF"/>
  <circle cx="297" cy="225" r="12" fill="#1E1B4B"/>
  <circle cx="300" cy="222" r="4" fill="#FFFFFF"/>

  <!-- Nose -->
  <polygon points="256,242 248,234 264,234" fill="#F43F5E"/>

  <!-- Smile -->
  <path d="M245 252 Q256 262 267 252" stroke="#1E1B4B" stroke-width="4" stroke-linecap="round" fill="none"/>

  <!-- Letter Badge with Arabic 'أ' -->
  <g transform="translate(196, 290)">
    <circle cx="60" cy="60" r="54" fill="url(#starGrad)" filter="url(#glow)"/>
    <circle cx="60" cy="60" r="46" fill="#FBBF24"/>
    <text x="60" y="78" font-family="Arial, Tahoma, sans-serif" font-weight="900" font-size="54" fill="#78350F" text-anchor="middle">أ</text>
  </g>

  <!-- Golden Crown for mascot -->
  <path d="M226 150 L241 168 L256 146 L271 168 L286 150 L280 180 L232 180 Z" fill="#F59E0B" stroke="#D97706" stroke-width="3"/>
  <circle cx="226" cy="150" r="4" fill="#EF4444"/>
  <circle cx="256" cy="146" r="4" fill="#3B82F6"/>
  <circle cx="286" cy="150" r="4" fill="#10B981"/>
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

// Generate maskable SVG with 15% safe padding
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#6366F1"/>
  <g transform="translate(51, 51) scale(0.8)">
    ${svgContent.replace('<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">', '').replace('</svg>', '')}
  </g>
</svg>
`;

async function buildIcons() {
  const svgBuffer = Buffer.from(svgContent);
  const maskableBuffer = Buffer.from(maskableSvg);

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.ico'));
  console.log('All icons generated successfully!');
}

buildIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
