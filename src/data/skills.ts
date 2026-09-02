export interface SkillItem {
  name: string
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
      { name: 'React', description: 'Component Architecture, Hooks, Single Page Apps' },
      { name: 'JavaScript (ES6+)', description: 'Modern JS, DOM Manipulation, Async/Await' },
      { name: 'TypeScript', description: 'Type-Safe Web Applications' },
      { name: 'Tailwind CSS', description: 'Utility-First Styling, Responsive Breakpoints' },
      { name: 'HTML5 & CSS3', description: 'Semantic Markup, Flexbox, CSS Grid, Transitions' },
    ],
  },
  {
    title: 'Backend Engineering',
    description: 'Architecting robust server-side APIs, business logic, authentication, and secure data workflows.',
    skills: [
      { name: 'Laravel / PHP', description: 'MVC Architecture, Eloquent ORM, Blade, Routing' },
      { name: 'Node.js', description: 'REST APIs, Event-Driven Backend Services' },
      { name: 'Python', description: 'Data Scripts, Automation, Backend Logic' },
      { name: 'Java', description: 'Object-Oriented Programming, Enterprise Foundations' },
      { name: 'C# / .NET', description: 'Game Logic, Systems Programming, Robust Backend' },
    ],
  },
  {
    title: 'Database & Cloud Services',
    description: 'Managing structured data models, real-time databases, and reliable cloud deployments.',
    skills: [
      { name: 'MySQL', description: 'Relational Schemas, Indexing, Complex Queries' },
      { name: 'PostgreSQL', description: 'Data Integrity, Relations, ACID Transactions' },
      { name: 'Firebase', description: 'Realtime Firestore, Auth, Storage, Hosting' },
      { name: 'Vercel', description: 'CI/CD Pipelines, Edge Deployments, Production Builds' },
    ],
  },
  {
    title: 'Testing, QA & Developer Tools',
    description: 'Ensuring bug-free user experiences through meticulous test execution and modern toolchains.',
    skills: [
      { name: 'Manual Testing & QA', description: 'Boundary Value Testing, Smoke Tests, Regression' },
      { name: 'Unity 3D', description: 'Interactive AR/VR, Physics, Spatial Anchor Tracking' },
      { name: 'Git & GitHub', description: 'Version Control, Branching, PRs, Guardrails' },
      { name: 'VS Code', description: 'Primary IDE, Extensions, Debugging Workflows' },
    ],
  },
]
