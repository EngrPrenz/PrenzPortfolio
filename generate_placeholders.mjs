import fs from 'fs'
import path from 'path'

const dir = path.resolve('public/projects')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

function createSvgPlaceholder(title, subtitle, tag, screenNum, accentColor = '#00ff88') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">
  <defs>
    <linearGradient id="bgGrad_${screenNum}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f141c" />
      <stop offset="100%" stop-color="#080a0f" />
    </linearGradient>
    <linearGradient id="cardGrad_${screenNum}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#161e2b" />
      <stop offset="100%" stop-color="#101520" />
    </linearGradient>
    <filter id="glow_${screenNum}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="750" rx="16" fill="url(#bgGrad_${screenNum})" />
  <rect width="1196" height="746" x="2" y="2" rx="15" fill="none" stroke="${accentColor}" stroke-opacity="0.25" stroke-width="2" />

  <!-- Browser/App Header Bar -->
  <rect width="1200" height="52" fill="#131923" rx="16" />
  <rect width="1200" height="2" y="50" fill="${accentColor}" fill-opacity="0.3" />
  <circle cx="36" cy="26" r="6" fill="#ff5f56" />
  <circle cx="56" cy="26" r="6" fill="#ffbd2e" />
  <circle cx="76" cy="26" r="6" fill="#27c93f" />

  <!-- App URL Pill -->
  <rect x="180" y="12" width="840" height="28" rx="8" fill="#0b0e14" stroke="#252f3e" stroke-width="1" />
  <text x="600" y="31" font-family="'JetBrains Mono', monospace" font-size="12" fill="#718096" text-anchor="middle">
    https://${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.app/preview/view-${screenNum}
  </text>

  <!-- Screen Content Mockup -->
  <!-- Top Banner / Navbar inside Mockup -->
  <rect x="60" y="80" width="1080" height="60" rx="10" fill="url(#cardGrad_${screenNum})" stroke="#1f293d" stroke-width="1" />
  <text x="90" y="116" font-family="'Outfit', sans-serif" font-weight="bold" font-size="20" fill="#f0f4f8">
    ${title}
  </text>
  <rect x="960" y="94" width="150" height="32" rx="6" fill="${accentColor}" fill-opacity="0.15" stroke="${accentColor}" stroke-opacity="0.5" stroke-width="1" />
  <text x="1035" y="115" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">
    SCREENSHOT #${screenNum}
  </text>

  <!-- Left Content Card -->
  <rect x="60" y="160" width="700" height="520" rx="12" fill="url(#cardGrad_${screenNum})" stroke="#1f293d" stroke-width="1" />
  
  <!-- Content Header inside card -->
  <text x="100" y="210" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" fill="${accentColor}" letter-spacing="2">
    ${tag.toUpperCase()}
  </text>
  <text x="100" y="250" font-family="'Outfit', sans-serif" font-size="28" font-weight="bold" fill="#ffffff">
    ${subtitle}
  </text>

  <!-- Mockup UI Elements / Charts / Rows -->
  <rect x="100" y="290" width="620" height="70" rx="8" fill="#0d111a" stroke="#222c3d" stroke-width="1" />
  <circle cx="145" cy="325" r="18" fill="${accentColor}" fill-opacity="0.2" />
  <text x="190" y="322" font-family="'Outfit', sans-serif" font-size="16" font-weight="600" fill="#e2e8f0">Primary Interface View ${screenNum}</text>
  <text x="190" y="342" font-family="'Outfit', sans-serif" font-size="12" fill="#718096">Interactive dashboard &amp; system state display</text>

  <rect x="100" y="380" width="620" height="70" rx="8" fill="#0d111a" stroke="#222c3d" stroke-width="1" />
  <circle cx="145" cy="415" r="18" fill="${accentColor}" fill-opacity="0.2" />
  <text x="190" y="412" font-family="'Outfit', sans-serif" font-size="16" font-weight="600" fill="#e2e8f0">Validated Functional Module</text>
  <text x="190" y="432" font-family="'Outfit', sans-serif" font-size="12" fill="#718096">Real-time sync listeners and persistent store</text>

  <rect x="100" y="470" width="620" height="170" rx="8" fill="#0d111a" stroke="#222c3d" stroke-width="1" />
  <!-- Simulated Wireframe / Waveform -->
  <path d="M 130 570 Q 220 500, 310 560 T 490 530 T 670 550" fill="none" stroke="${accentColor}" stroke-width="3" />
  <path d="M 130 590 Q 220 540, 310 580 T 490 560 T 670 580" fill="none" stroke="${accentColor}" stroke-opacity="0.4" stroke-width="1.5" />
  <text x="120" y="505" font-family="'JetBrains Mono', monospace" font-size="12" fill="#8892b0">
    // Analytics &amp; Active Performance Monitor
  </text>

  <!-- Right Sidebar Card -->
  <rect x="780" y="160" width="360" height="520" rx="12" fill="url(#cardGrad_${screenNum})" stroke="#1f293d" stroke-width="1" />
  <text x="815" y="210" font-family="'Outfit', sans-serif" font-size="16" font-weight="bold" fill="#ffffff">
    System Parameters
  </text>

  <rect x="815" y="235" width="290" height="50" rx="8" fill="#0b0e14" />
  <text x="835" y="265" font-family="'JetBrains Mono', monospace" font-size="13" fill="${accentColor}">status: verified</text>

  <rect x="815" y="300" width="290" height="50" rx="8" fill="#0b0e14" />
  <text x="835" y="330" font-family="'JetBrains Mono', monospace" font-size="13" fill="#cbd5e1">concurrency: active</text>

  <rect x="815" y="365" width="290" height="50" rx="8" fill="#0b0e14" />
  <text x="835" y="395" font-family="'JetBrains Mono', monospace" font-size="13" fill="#cbd5e1">latency: optimal</text>

  <!-- Replace Image Notice Banner -->
  <rect x="815" y="440" width="290" height="205" rx="8" fill="#0a0f18" stroke="${accentColor}" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="4 4" />
  <text x="960" y="520" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="bold" fill="${accentColor}" text-anchor="middle">
    [ PLACEHOLDER ]
  </text>
  <text x="960" y="545" font-family="'Outfit', sans-serif" font-size="12" fill="#8892b0" text-anchor="middle">
    Drop your actual screenshot here:
  </text>
  <text x="960" y="570" font-family="'JetBrains Mono', monospace" font-size="10" fill="#64748b" text-anchor="middle">
    public/projects/...
  </text>
</svg>`
}

const items = [
  // URSAC HUB
  { file: 'ursac-hub-2.svg', title: 'URSAC HUB', sub: 'Announcements & Newsfeed', tag: 'Campus System', num: 2, col: '#38bdf8' },
  { file: 'ursac-hub-3.svg', title: 'URSAC HUB', sub: 'Event Calendar & Scheduling', tag: 'Organization Wall', num: 3, col: '#38bdf8' },
  { file: 'ursac-hub-4.svg', title: 'URSAC HUB', sub: 'Student Merch & Marketplace', tag: 'E-Commerce Store', num: 4, col: '#00ff88' },
  { file: 'ursac-hub-5.svg', title: 'URSAC HUB', sub: 'Admin Inventory Tracking', tag: 'Relational DB', num: 5, col: '#00ff88' },
  { file: 'ursac-hub-6.svg', title: 'URSAC HUB', sub: 'Role-Based Authentication', tag: 'RBAC Security', num: 6, col: '#38bdf8' },

  // Salo sa Antipolo
  { file: 'salo-1.svg', title: 'SALO SA ANTIPOLO', sub: 'Touchscreen Ordering Kiosk', tag: 'Customer Kiosk', num: 1, col: '#00ff88' },
  { file: 'salo-2.svg', title: 'SALO SA ANTIPOLO', sub: 'Real-Time Kitchen Display System', tag: 'Order Routing', num: 2, col: '#fbbf24' },
  { file: 'salo-3.svg', title: 'SALO SA ANTIPOLO', sub: 'Cashier & Billing Interface', tag: 'POS Terminal', num: 3, col: '#00ff88' },
  { file: 'salo-4.svg', title: 'SALO SA ANTIPOLO', sub: 'Inventory Deduction & Sync', tag: 'Firebase Firestore', num: 4, col: '#34d399' },

  // AR-DUINO
  { file: 'arduino-1.svg', title: 'AR-DUINO', sub: '3D Spatial Pinout Overlay', tag: 'Unity AR View', num: 1, col: '#00ff88' },
  { file: 'arduino-2.svg', title: 'AR-DUINO', sub: 'Hardware Recognition Camera', tag: 'Computer Vision', num: 2, col: '#60a5fa' },
  { file: 'arduino-3.svg', title: 'AR-DUINO', sub: 'Live Sensor Pinout Telemetry', tag: 'IoT Dashboard', num: 3, col: '#00ff88' },
  { file: 'arduino-4.svg', title: 'AR-DUINO', sub: 'Schematic Projection in 3D', tag: 'AR Foundation', num: 4, col: '#a78bfa' },

  // Grind On
  { file: 'grindon-1.svg', title: 'GRIND ON', sub: 'Sportswear Storefront & Catalog', tag: 'Apparel E-Commerce', num: 1, col: '#00ff88' },
  { file: 'grindon-2.svg', title: 'GRIND ON', sub: 'Cart Session & Size Selector', tag: 'Shopping Flow', num: 2, col: '#38bdf8' },
  { file: 'grindon-3.svg', title: 'GRIND ON', sub: 'Checkout & Payment Processing', tag: 'Boundary Testing', num: 3, col: '#f43f5e' },
  { file: 'grindon-4.svg', title: 'GRIND ON', sub: 'Cross-Device Responsiveness', tag: 'QA Validation', num: 4, col: '#00ff88' },
]

for (const item of items) {
  const filePath = path.join(dir, item.file)
  const svg = createSvgPlaceholder(item.title, item.sub, item.tag, item.num, item.col)
  fs.writeFileSync(filePath, svg, 'utf-8')
}

console.log(`Generated ${items.length} placeholder screenshot graphics in public/projects/`)
