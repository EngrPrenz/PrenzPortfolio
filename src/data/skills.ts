export type TechIconId =
  | 'react'
  | 'javascript'
  | 'typescript'
  | 'tailwind'
  | 'html5'
  | 'css3'
  | 'laravel'
  | 'php'
  | 'nodejs'
  | 'python'
  | 'java'
  | 'csharp'
  | 'dotnet'
  | 'mysql'
  | 'postgresql'
  | 'firebase'
  | 'vercel'
  | 'qa'
  | 'unity'
  | 'git'
  | 'github'
  | 'vscode'

export interface SkillItem {
  name: string
  icons: TechIconId[]
  level?: string
  description?: string
  iconName?: string
}

export interface SkillCategory {
  title: string
  description: string
  skills: SkillItem[]
}

export const skillsCategories: SkillCategory[] = [
  {
    title: 'Frontend Development',
    description: 'Crafting responsive, high-performance, and visually sharp interfaces with clean state architecture.',
    skills: [
      { name: 'React', icons: ['react'], description: 'Component Architecture, Hooks, Single Page Apps' },
      { name: 'JavaScript (ES6+)', icons: ['javascript'], description: 'Modern JS, DOM Manipulation, Async/Await' },
      { name: 'TypeScript', icons: ['typescript'], description: 'Type-Safe Web Applications' },
      { name: 'Tailwind CSS', icons: ['tailwind'], description: 'Utility-First Styling, Responsive Breakpoints' },
      { name: 'HTML5 & CSS3', icons: ['html5', 'css3'], description: 'Semantic Markup, Flexbox, CSS Grid, Transitions' },
    ],
  },
  {
    title: 'Backend Engineering',
    description: 'Architecting robust server-side APIs, business logic, authentication, and secure data workflows.',
    skills: [
      { name: 'Laravel / PHP', icons: ['laravel', 'php'], description: 'MVC Architecture, Eloquent ORM, Blade, Routing' },
      { name: 'Node.js', icons: ['nodejs'], description: 'REST APIs, Event-Driven Backend Services' },
      { name: 'Python', icons: ['python'], description: 'Data Scripts, Automation, Backend Logic' },
      { name: 'Java', icons: ['java'], description: 'Object-Oriented Programming, Enterprise Foundations' },
      { name: 'C# / .NET', icons: ['csharp', 'dotnet'], description: 'Game Logic, Systems Programming, Robust Backend' },
    ],
  },
  {
    title: 'Database & Cloud Services',
    description: 'Managing structured data models, real-time databases, and reliable cloud deployments.',
    skills: [
      { name: 'MySQL', icons: ['mysql'], description: 'Relational Schemas, Indexing, Complex Queries' },
      { name: 'PostgreSQL', icons: ['postgresql'], description: 'Data Integrity, Relations, ACID Transactions' },
      { name: 'Firebase', icons: ['firebase'], description: 'Realtime Firestore, Auth, Storage, Hosting' },
      { name: 'Vercel', icons: ['vercel'], description: 'CI/CD Pipelines, Edge Deployments, Production Builds' },
    ],
  },
  {
    title: 'Testing, QA & Developer Tools',
    description: 'Ensuring bug-free user experiences through meticulous test execution and modern toolchains.',
    skills: [
      { name: 'Manual Testing & QA', icons: ['qa'], description: 'Boundary Value Testing, Smoke Tests, Regression' },
      { name: 'Unity 3D', icons: ['unity'], description: 'Interactive AR/VR, Physics, Spatial Anchor Tracking' },
      { name: 'Git & GitHub', icons: ['git', 'github'], description: 'Version Control, Branching, PRs, Guardrails' },
      { name: 'VS Code', icons: ['vscode'], description: 'Primary IDE, Extensions, Debugging Workflows' },
    ],
  },
]
