export type ProjectStatus = 'live' | 'development' | 'upcoming'
export type ProjectCategory = 'Full Stack' | 'QA & Testing' | 'AR & Systems' | 'All'

export interface Project {
  id: string
  title: string
  subtitle: string
  role: string
  categoryTag: string
  description: string
  longDescription: string
  keyFeatures: string[]
  techStack: string[]
  status: ProjectStatus
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category: ProjectCategory
  metrics?: { label: string; value: string }[]
  screenshots: string[]
}

export const projectsData: Project[] = [
  {
    id: 'ursac-hub',
    title: 'URSAC HUB MARKETPLACE',
    subtitle: 'Campus Organization & Marketplace Platform',
    role: 'Full-Stack Developer & QA (Team)',
    categoryTag: 'SOFTWARE DEVELOPMENT',
    description: 'Co-built a Laravel + MySQL campus platform across 4 modules (Wall, News, Shop, Orgs) serving 5+ student councils; verified RBAC and session isolation against privilege escalation.',
    longDescription: 'Built a Laravel-based platform where student organizations could publish announcements, promote events, and sell merchandise through an integrated marketplace. The system centralized campus information while providing secure authentication, role-based access, and product management features.',
    keyFeatures: [
      'Organization announcements & events',
      'Campus marketplace & store catalog',
      'Product & inventory management',
      'Role-based authentication & permissions',
      'Laravel full-stack application architecture',
    ],
    techStack: ['Laravel', 'MySQL', 'Tailwind', 'PHP', 'JavaScript'],
    status: 'live',
    liveUrl: 'https://ursachub.onrender.com',
    githubUrl: 'https://github.com/EngrPrenz',
    featured: true,
    category: 'Full Stack',
    metrics: [
      { label: 'Core Modules', value: '4 (Wall/News/Shop/Orgs)' },
      { label: 'Campus Reach', value: '5+ Student Councils' },
      { label: 'Security QA', value: 'RBAC & Session Verified' },
    ],
    screenshots: [
      '/projects/ursachub/1.png',
      '/projects/ursachub/2.png',
      '/projects/ursachub/3.png',
      '/projects/ursachub/4.png',
      '/projects/ursachub/5.png',
    ],
  },
  {
    id: 'salo-sa-antipolo',
    title: 'SALO SA ANTIPOLO',
    subtitle: 'Restaurant Operations & Multi-Role POS',
    role: 'Full-Stack Developer & QA (Team)',
    categoryTag: 'FULL STACK & POS SYSTEM',
    description: 'Co-built a real-time Firebase POS unifying 3 role portals across a 13-table live grid with automated 12% VAT, 7% SC, and 20% Senior/PWD billing; resolved concurrent order-state race conditions.',
    longDescription: 'A comprehensive restaurant operations ecosystem featuring customer self-ordering kiosks, dynamic real-time kitchen displays, and cashier POS interfaces. Stress-tested for simultaneous multi-table order placement and concurrent inventory deduction.',
    keyFeatures: [
      'Multi-role touchscreen kiosk & cashier POS',
      'Real-time Firebase Firestore order status views',
      'Automated billing, receipt generation & tax computing',
      'Concurrency edge-case testing for simultaneous orders',
      'Responsive touch-first staff dashboard',
    ],
    techStack: ['Firebase', 'React', 'JavaScript', 'HTML5', 'CSS3'],
    status: 'live',
    liveUrl: 'https://salo-sa-antipolo.web.app',
    githubUrl: 'https://github.com/EngrPrenz',
    featured: true,
    category: 'Full Stack',
    metrics: [
      { label: 'Role Portals', value: '3 (Kiosk / Cashier / Admin)' },
      { label: 'Live Operations', value: '13-Table Real-Time Grid' },
      { label: 'Billing Engine', value: '12% VAT + 7% SC + 20% Disc.' },
      { label: 'QA Scope', value: 'Concurrency Race-Free' },
    ],
    screenshots: [
      '/projects/salo/1.png',
      '/projects/salo/2.png',
      '/projects/salo/3.png',
      '/projects/salo/4.png',
      '/projects/salo/5.png',
      '/projects/salo/6.png',
    ],
  },
  {
    id: 'ar-duino',
    title: 'AR-DUINO',
    subtitle: 'Augmented Reality Interface for Microcontrollers',
    role: 'Lead Systems & AR Developer (Team)',
    categoryTag: 'AUGMENTED REALITY & IOT',
    description: 'Led Unity 3D/C# AR architecture for 4 tiered Arduino Uno R3 lab modules (incl. interactive AR RC-Car), maintaining < 25ms spatial anchor latency across varied lighting conditions.',
    longDescription: 'An interactive spatial computing developer tool that identifies physical Arduino microcontrollers via computer vision, projecting holographic 3D pinouts, signal schematics, and live pin telemetry directly onto physical hardware.',
    keyFeatures: [
      'Real-time physical hardware recognition & tracking',
      'Interactive 3D spatial pinout & voltage diagram overlays',
      'Camera tracking latency & ambient lighting stability tests',
      'Spatial anchor persistence in varying physical environments',
      'Integrated microcontroller documentation in 3D AR space',
    ],
    techStack: ['Unity 3D', 'C#', 'AR Foundation', 'IoT / Arduino', 'Vercel'],
    status: 'live',
    liveUrl: 'https://ar-duino-website.vercel.app',
    githubUrl: 'https://github.com/EngrPrenz',
    featured: false,
    category: 'AR & Systems',
    metrics: [
      { label: 'Lab Modules', value: '4 Tiered Arduino Labs' },
      { label: 'Anchor Latency', value: '< 25ms Tracking' },
      { label: 'Engine', value: 'Unity 3D + AR Foundation' },
    ],
    screenshots: [
      '/projects/arduino/1.jpg',
      '/projects/arduino/2.jpg',
      '/projects/arduino/3.jpg',
      '/projects/arduino/4.jpg',
      '/projects/arduino/5.jpg',
      '/projects/arduino/6.jpg',
      '/projects/arduino/7.jpg',
      '/projects/arduino/8.jpg',
    ],
  },
  {
    id: 'grind-on',
    title: 'GRIND ON SPORTSWEAR',
    subtitle: 'Sportswear E-Commerce & Point of Sale',
    role: 'Web Developer & QA Tester',
    categoryTag: 'E-COMMERCE & QA TESTING',
    description: 'Developed responsive apparel store; ran cross-browser usability and boundary-value tests to ensure seamless checkout workflows.',
    longDescription: 'High-performance digital storefront engineered for fitness apparel. Features dynamic catalog filtering, persistent shopping cart sessions, integrated checkout, and rigorous automated & manual QA testing protocols across devices.',
    keyFeatures: [
      'Modern responsive apparel catalog & collection filter',
      'Persistent cart state & seamless checkout flow',
      'Point of Sale inventory synchronization',
      'Comprehensive boundary-value & cross-browser testing',
      'Mobile-first responsive optimization',
    ],
    techStack: ['Firebase', 'JavaScript', 'Tailwind CSS', 'HTML5', 'QA Testing'],
    status: 'live',
    liveUrl: 'https://grindon-da126.web.app',
    githubUrl: 'https://github.com/EngrPrenz',
    featured: false,
    category: 'QA & Testing',
    metrics: [
      { label: 'Testing', value: 'Boundary & Usability' },
      { label: 'Platform', value: 'Web & POS' },
      { label: 'Deploy', value: 'Firebase Hosting' },
    ],
    screenshots: [
      '/projects/grindon/1.png',
      '/projects/grindon/3.png',
      '/projects/grindon/8.png',
      '/projects/grindon/9.png',
      '/projects/grindon/10.png',
      '/projects/grindon/11.png',
      '/projects/grindon/12.png',
      '/projects/grindon/14.png',
    ],
  },
  {
    id: 'vexlo',
    title: 'Vexlo',
    subtitle: 'Developer-first feature flag and remote configuration platform',
    role: 'Sole Full-Stack Engineer',
    categoryTag: 'SOFTWARE DEVELOPMENT',
    description:
      'High-performance, self-hosted feature flag platform with sub-millisecond local evaluation (< 0.05ms), dual-runtime architecture (Vercel Serverless + Neon Postgres or offline Windows .exe), and deterministic MurmurHash3 rollout bucketing.',
    longDescription:
      'Vexlo is a lightweight, developer-first feature flag and remote configuration platform engineered to eliminate external SaaS dependency and recurring subscription costs. Built with a dual-runtime architecture, Vexlo operates either as a cloud-native serverless deployment (Vercel Functions + Neon Serverless PostgreSQL + Drizzle ORM) or as an isolated offline Windows desktop tray application (Vexlo.exe with C# and an embedded local JSON store).\n\nKey Architecture & Engineering Highlights:\n\n• Zero-Latency Evaluation Engine (@vexlo/evaluator): Evaluates percentage rollouts, user targeting rules, and instant kill-switches locally in memory in < 0.05ms, eliminating round-trip network hops per evaluation. • Deterministic MurmurHash3 Bucketing: Allocates users into 0–99 hash buckets deterministically, guaranteeing monotonic consistency so raising a rollout percentage never evicts already-targeted users. • Bandwidth-Optimized Edge Polling: Implements SHA-1 content-hashed HTTP ETags with 304 Not Modified status responses, minimizing database load and cloud bandwidth during real-time SDK polling. • Production Safety Guard: Features an explicit confirmation lock and modal safety checks before any live production flag mutations take effect. • Live Dogfooding: Integrated directly into prenz-portfolio.dev to dynamically govern technology badges and showcase section visibility in real time.',
    keyFeatures: [
      'Sub-millisecond local in-memory flag evaluation (< 0.05ms)',
      'Deterministic 0–99% rollout bucketing via MurmurHash3',
      'Dual-runtime architecture (Cloud Serverless & Offline Desktop .exe)',
      'SHA-1 content-based ETag polling with HTTP 304 caching',
      'Multi-environment isolation (Development, Staging, Production)',
      'Production Safety Guard with explicit modal confirmation',
      'Rule-based VIP user targeting (attributes, plans, domains)',
      'Environment-scoped SDK API key management',
      'Interactive evaluation simulator with MurmurHash3 gauge',
      'Portable JSON project backup, export, and restore',
    ],
    techStack: [
      'TypeScript',
      'React 18',
      'Vite',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'Neon PostgreSQL',
      'Drizzle ORM',
      'Vercel Serverless',
      'TurboRepo',
      'C# / .NET',
      'MurmurHash3',
    ],
    status: 'live',
    liveUrl: 'https://vexlo-zeta.vercel.app/',
    githubUrl: 'https://github.com/EngrPrenz/Vexlo',
    featured: false,
    category: 'Full Stack',
    metrics: [
      { label: 'Evaluation Latency', value: '< 0.05ms' },
      { label: 'Architecture', value: 'Dual-Runtime Monorepo' },
      { label: 'Database', value: 'Neon Serverless Postgres' },
      { label: 'Sync Protocol', value: 'SHA-1 Content ETag (HTTP 304)' },
      { label: 'Rollout Engine', value: 'MurmurHash3 (0–99 Buckets)' },
      { label: 'Type Safety', value: '100% Strict TypeScript' },
    ],
    screenshots: [
      '/projects/vexlo/1.png',
      '/projects/vexlo/1.5.png',
      '/projects/vexlo/2.png',
      '/projects/vexlo/3.png',
      '/projects/vexlo/4.png',
      '/projects/vexlo/5.png',
    ],
  },
]
