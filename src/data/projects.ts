export type ProjectStatus = 'live' | 'development' | 'upcoming'
export type ProjectCategory = 'Full Stack' | 'QA & Testing' | 'AR & Systems' | 'All'

export interface Project {
  id: string
  title: string
  subtitle: string
  role: string
  description: string
  longDescription: string
  techStack: string[]
  status: ProjectStatus
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category: ProjectCategory
  metrics?: { label: string; value: string }[]
}

export const projectsData: Project[] = [
  {
    id: 'ursac-hub',
    title: 'URSAC HUB',
    subtitle: 'Campus Organization & Marketplace Platform',
    role: 'Full-Stack Developer & QA',
    description: 'Built a Laravel platform for event publishing and relational inventory tracking. Verified RBAC and session management against privilege escalation.',
    longDescription: 'Comprehensive campus organization ecosystem supporting multi-tenant clubs, event scheduling, and student marketplace transactions. Engineered secure authentication and validated role-based authorization to prevent unauthorized access across administrative and member tiers.',
    techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'Render'],
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
  },
  {
    id: 'salo-sa-antipolo',
    title: 'Salo sa Antipolo',
    subtitle: 'Restaurant Operations & Multi-Role POS',
    role: 'Full-Stack Developer & Tester',
    description: 'Developed multi-role kiosk app with real-time Firebase views for staff and billing. Validated order-state synchronization and edge cases for simultaneous ordering.',
    longDescription: 'A synchronized restaurant management system with dynamic customer kiosks, kitchen display order routing, and cashier interfaces. Executed stress testing on real-time database listeners to guarantee zero drop-off during peak traffic and simultaneous table orders.',
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
  },
  {
    id: 'ar-duino',
    title: 'AR-DUINO',
    subtitle: 'Augmented Reality Interface for Microcontrollers',
    role: 'Lead Systems & AR Developer',
    description: 'Designed a Unity 3D AR app to overlay interactive pinouts on physical hardware. Tested camera tracking latency and spatial anchor stability across varied lighting.',
    longDescription: 'An interactive augmented reality developer tool that recognizes physical Arduino microcontrollers through computer vision and renders real-time schematics, pin maps, and sensor data directly in 3D spatial space.',
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
  },
  {
    id: 'grind-on',
    title: 'Grind On',
    subtitle: 'Sportswear E-Commerce & Point of Sale',
    role: 'Web Developer & QA Tester',
    description: 'Developed responsive apparel store; ran cross-browser usability and boundary-value tests to ensure seamless checkout workflows.',
    longDescription: 'Modern digital storefront tailored for athletic apparel with high-performance product catalog browsing, cart persistence, and POS integration. Authored structured test cases covering boundary values, mobile responsiveness, and payment edge cases.',
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
  },
]
