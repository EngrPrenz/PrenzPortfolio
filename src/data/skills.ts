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
    title: 'Frontend',
    description: 'Component architecture, accessible interfaces, and responsive layout systems.',
    skills: [
      { name: 'React', icons: ['react'], description: 'Component architecture, hooks, single-page apps' },
      { name: 'TypeScript', icons: ['typescript'], description: 'Strict typing across UI and shared libraries' },
      { name: 'JavaScript (ES6+)', icons: ['javascript'], description: 'Async flows, DOM APIs, browser tooling' },
      { name: 'Tailwind CSS', icons: ['tailwind'], description: 'Design tokens, utility layouts, responsive grids' },
      { name: 'HTML5 & CSS3', icons: ['html5', 'css3'], description: 'Semantic markup, native dialogs, Grid & Flexbox' },
    ],
  },
  {
    title: 'Backend',
    description: 'Server APIs, authentication, business logic, and desktop tooling.',
    skills: [
      { name: 'Laravel & PHP', icons: ['laravel', 'php'], description: 'MVC architecture, Eloquent ORM, RBAC routing' },
      { name: 'Node.js', icons: ['nodejs'], description: 'REST APIs, Express services, serverless functions' },
      { name: 'C# & .NET', icons: ['csharp', 'dotnet'], description: 'Windows utilities, Unity scripting, systems logic' },
      { name: 'Python', icons: ['python'], description: 'Scripting, data automation, backend helpers' },
      { name: 'Java', icons: ['java'], description: 'Object-oriented programming and core data structures' },
    ],
  },
  {
    title: 'Data & Cloud',
    description: 'Relational schemas, real-time document sync, and serverless hosting.',
    skills: [
      { name: 'PostgreSQL', icons: ['postgresql'], description: 'Relational modeling, Neon serverless, Drizzle ORM' },
      { name: 'MySQL', icons: ['mysql'], description: 'Schema design, indexing, relational queries' },
      { name: 'Firebase', icons: ['firebase'], description: 'Realtime Firestore sync, Auth, Storage, Hosting' },
      { name: 'Vercel', icons: ['vercel'], description: 'CI/CD previews, edge routing, serverless deploys' },
    ],
  },
  {
    title: 'QA & Tooling',
    description: 'Verification practices, interactive 3D engines, and daily workflow tools.',
    skills: [
      { name: 'Software QA & Testing', icons: ['qa'], description: 'Boundary-value, RBAC, concurrency, and regression checks' },
      { name: 'Unity 3D', icons: ['unity'], description: 'AR Foundation, spatial anchor tracking, C# scripts' },
      { name: 'Git & GitHub', icons: ['git', 'github'], description: 'Branching workflows, pull requests, release checks' },
      { name: 'VS Code', icons: ['vscode'], description: 'Debugging, workspace tooling, extension workflows' },
    ],
  },
]
