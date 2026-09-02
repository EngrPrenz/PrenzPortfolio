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
    role: 'Full Stack Developer',
    categoryTag: 'SOFTWARE DEVELOPMENT',
    description: 'Built a Laravel platform for event publishing and relational inventory tracking. Verified RBAC and session management against privilege escalation.',
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
      { label: 'Role', value: 'Full-Stack & QA' },
      { label: 'Security', value: 'RBAC Validated' },
      { label: 'Architecture', value: 'Relational DB' },
    ],
    screenshots: [
      '/projects/ursac-hub-full.png',
      '/projects/ursac-hub-2.svg',
      '/projects/ursac-hub-3.svg',
      '/projects/ursac-hub-4.svg',
      '/projects/ursac-hub-5.svg',
      '/projects/ursac-hub-6.svg',
    ],
  },
  {
    id: 'salo-sa-antipolo',
    title: 'SALO SA ANTIPOLO',
    subtitle: 'Restaurant Operations & Multi-Role POS',
    role: 'Full-Stack Developer & Tester',
    categoryTag: 'FULL STACK & POS SYSTEM',
    description: 'Developed multi-role kiosk app with real-time Firebase views for staff and billing. Validated order-state synchronization and edge cases for simultaneous ordering.',
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
      { label: 'Sync', value: 'Real-time Firebase' },
      { label: 'Interface', value: 'Multi-Role Kiosk' },
      { label: 'QA Scope', value: 'Concurrency Tested' },
    ],
    screenshots: [
      '/projects/salo-1.svg',
      '/projects/salo-2.svg',
      '/projects/salo-3.svg',
      '/projects/salo-4.svg',
    ],
  },
  {
    id: 'ar-duino',
    title: 'AR-DUINO',
    subtitle: 'Augmented Reality Interface for Microcontrollers',
    role: 'Lead Systems & AR Developer',
    categoryTag: 'AUGMENTED REALITY & IOT',
    description: 'Designed a Unity 3D AR app to overlay interactive pinouts on physical hardware. Tested camera tracking latency and spatial anchor stability across varied lighting.',
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
      { label: 'Engine', value: 'Unity 3D' },
      { label: 'Tracking', value: 'AR Foundation' },
      { label: 'Latency', value: '< 25ms Anchor' },
    ],
    screenshots: [
      '/projects/arduino-1.svg',
      '/projects/arduino-2.svg',
      '/projects/arduino-3.svg',
      '/projects/arduino-4.svg',
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
      '/projects/grindon-1.svg',
      '/projects/grindon-2.svg',
      '/projects/grindon-3.svg',
      '/projects/grindon-4.svg',
    ],
  },
]
