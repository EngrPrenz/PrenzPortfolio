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
  displayOrder?: number
  category: ProjectCategory
  metrics?: { label: string; value: string }[]
  screenshots: string[]
}

export const projectsData: Project[] = [
  {
    id: 'vexlo',
    title: 'Vexlo',
    subtitle: 'Self-hosted feature flag and remote configuration platform',
    role: 'Sole Full-Stack Engineer',
    categoryTag: 'Feature Flags & Tooling',
    description:
      'Self-hosted feature flag platform with sub-millisecond local evaluation (< 0.05ms), dual-runtime architecture (Vercel Serverless + Neon Postgres or offline Windows .exe), and deterministic MurmurHash3 rollout bucketing.',
    longDescription:
      'Vexlo is a lightweight, developer-first feature flag and remote configuration platform built to replace recurring SaaS dependencies. It runs either as a serverless cloud deployment (Vercel Functions, Neon Serverless PostgreSQL, and Drizzle ORM) or as an isolated offline Windows desktop tray utility (Vexlo.exe in C# with an embedded JSON store).\n\nKey Architecture & Engineering Highlights:\n\n- Local Evaluation Engine (@vexlo/evaluator): Evaluates percentage rollouts, user targeting rules, and kill switches in memory in under 0.05ms with no per-check network round trips.\n- Deterministic MurmurHash3 Bucketing: Maps users into 0-99 buckets deterministically so increasing a rollout never evicts already-targeted users.\n- ETag Edge Polling: Uses SHA-1 content-hashed HTTP ETags and 304 Not Modified responses to cut database reads and bandwidth.\n- Production Safety Guard: Requires explicit confirmation checks before applying mutations to live production flags.\n- Live Dogfooding: Runs inside this portfolio to control UI capabilities in real time.',
    keyFeatures: [
      'Sub-millisecond local in-memory flag evaluation (< 0.05ms)',
      'Deterministic 0-99% rollout bucketing via MurmurHash3',
      'Dual-runtime architecture (Cloud Serverless & Offline Desktop .exe)',
      'SHA-1 content-based ETag polling with HTTP 304 caching',
      'Multi-environment isolation (Development, Staging, Production)',
      'Production Safety Guard with explicit confirmation checks',
      'Rule-based user targeting (attributes, plans, domains)',
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
    featured: true,
    displayOrder: 1,
    category: 'Full Stack',
    metrics: [
      { label: 'Evaluation', value: '< 0.05ms local' },
      { label: 'Runtime', value: 'Cloud + Windows .exe' },
      { label: 'Rollout Engine', value: 'MurmurHash3 (0-99)' },
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
  {
    id: 'salo-sa-antipolo',
    title: 'Salo sa Antipolo',
    subtitle: 'Restaurant operations and multi-role POS system',
    role: 'Full-Stack Developer & QA (Team)',
    categoryTag: 'Full-Stack POS',
    description:
      'Co-built a real-time Firebase POS unifying 3 role portals across a 13-table live grid with automated 12% VAT, 7% SC, and 20% Senior/PWD billing; resolved concurrent order-state race conditions.',
    longDescription:
      'A restaurant operations platform connecting customer self-ordering kiosks, live kitchen displays, and cashier POS terminals over Firebase Firestore. Stress-tested for simultaneous multi-table ordering and concurrent inventory deduction to prevent double-billing and lost tickets.',
    keyFeatures: [
      'Multi-role touchscreen kiosk, kitchen display, and cashier POS',
      'Real-time Firebase Firestore order status synchronization',
      'Automated 12% VAT, 7% service charge, and 20% Senior/PWD billing',
      'Concurrency edge-case testing for simultaneous multi-table orders',
      'Touch-first staff dashboard sized for countertop tablets',
    ],
    techStack: ['Firebase', 'React', 'JavaScript', 'HTML5', 'CSS3'],
    status: 'live',
    liveUrl: 'https://salo-sa-antipolo.web.app',
    githubUrl: 'https://github.com/EngrPrenz',
    featured: true,
    displayOrder: 2,
    category: 'Full Stack',
    metrics: [
      { label: 'Role Portals', value: '3 (Kiosk / Cashier / Admin)' },
      { label: 'Live Operations', value: '13-Table Real-Time Grid' },
      { label: 'Billing Engine', value: '12% VAT + 7% SC + 20% Disc.' },
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
    id: 'ursac-hub',
    title: 'URSAC Hub Marketplace',
    subtitle: 'Campus organization directory and marketplace platform',
    role: 'Full-Stack Developer & QA (Team)',
    categoryTag: 'Campus Platform',
    description:
      'Co-built a Laravel + MySQL campus platform across 4 modules (Wall, News, Shop, Orgs) serving 5+ student councils; verified RBAC and session isolation against privilege escalation.',
    longDescription:
      'A Laravel and MySQL campus platform enabling student organizations to publish announcements, manage events, and run an integrated merchandise storefront. Centralizes campus updates while enforcing role-based authentication, session boundaries, and inventory tracking.',
    keyFeatures: [
      'Organization announcements and event feeds',
      'Campus marketplace and store catalog',
      'Product and inventory management per organization',
      'Role-based authentication and permission verification',
      'Laravel MVC + MySQL relational schema architecture',
    ],
    techStack: ['Laravel', 'MySQL', 'Tailwind', 'PHP', 'JavaScript'],
    status: 'live',
    liveUrl: 'https://ursachub.onrender.com',
    githubUrl: 'https://github.com/EngrPrenz',
    featured: true,
    displayOrder: 3,
    category: 'Full Stack',
    metrics: [
      { label: 'Core Modules', value: '4 (Wall / News / Shop / Orgs)' },
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
    id: 'ar-duino',
    title: 'AR-Duino',
    subtitle: 'Augmented reality guide for Arduino microcontrollers',
    role: 'Lead Systems & AR Developer (Team)',
    categoryTag: 'Augmented Reality & IoT',
    description:
      'Led Unity 3D/C# AR architecture for 4 tiered Arduino Uno R3 lab modules (including an interactive AR RC-Car), holding under 25ms spatial anchor latency across varied lighting.',
    longDescription:
      'An interactive spatial learning tool built with Unity 3D and AR Foundation that detects physical Arduino Uno R3 boards via computer vision and overlays 3D pinouts, wiring schematics, and guided lab walkthroughs directly on top of the hardware.',
    keyFeatures: [
      'Real-time physical Arduino recognition and tracking',
      'Interactive 3D spatial pinout and circuit diagram overlays',
      'Camera tracking latency and ambient lighting stability tests',
      'Spatial anchor persistence across classroom environments',
      'Integrated microcontroller lab documentation in AR',
    ],
    techStack: ['Unity 3D', 'C#', 'AR Foundation', 'IoT / Arduino', 'Vercel'],
    status: 'live',
    liveUrl: 'https://ar-duino-website.vercel.app',
    githubUrl: 'https://github.com/EngrPrenz',
    featured: false,
    displayOrder: 4,
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
    title: 'Grind On Sportswear',
    subtitle: 'Sportswear e-commerce storefront and point of sale',
    role: 'Web Developer & QA Tester',
    categoryTag: 'E-Commerce & QA',
    description:
      'Built a responsive apparel storefront with synchronized POS stock; executed cross-browser usability and boundary-value test suites to validate checkout edge cases.',
    longDescription:
      'Digital storefront and POS catalog for a fitness apparel brand. Includes dynamic collection filters, persistent cart state, inventory synchronization, and systematic manual QA covering boundary values, input validation, and mobile viewports.',
    keyFeatures: [
      'Responsive apparel catalog and collection filters',
      'Persistent cart state and validated checkout flow',
      'Point-of-sale inventory synchronization',
      'Boundary-value and cross-browser QA test coverage',
      'Mobile-first layout and touch target verification',
    ],
    techStack: ['Firebase', 'JavaScript', 'Tailwind CSS', 'HTML5', 'QA Testing'],
    status: 'live',
    liveUrl: 'https://grindon-da126.web.app',
    githubUrl: 'https://github.com/EngrPrenz',
    featured: false,
    displayOrder: 5,
    category: 'QA & Testing',
    metrics: [
      { label: 'QA Coverage', value: 'Boundary & Usability' },
      { label: 'Platform', value: 'Web & POS' },
      { label: 'Hosting', value: 'Firebase Hosting' },
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
]
