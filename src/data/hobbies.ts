import { Hobby } from '@/types/hobby'

export const hobbiesData: Hobby[] = [
  {
    id: 'pc-building',
    title: 'PC Building & Hardware Tinkering',
    category: 'Hardware & Systems',
    icon: 'Cpu',
    description:
      'Passionate about system architecture, thermals, and silicon performance. Custom cable routing, thermal optimization, hardware benchmarking, and pushing components to their efficiency limits.',
    tags: ['Custom Rig', 'Thermal Tuning', 'Silicon Benchmarking', 'Hardware Modding'],
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    featured: true,
    displayOrder: 1,
  },
  {
    id: 'guitar-playing',
    title: 'Guitar Playing',
    category: 'Music & Creative',
    icon: 'Guitar',
    description:
      'Unwinding away from the keyboard by picking up the guitar—learning favorite tracks, practicing riffs and chord progressions, and jamming whenever I need a creative reset.',
    tags: ['Guitar', 'Riffs & Chords', 'Jamming', 'Music'],
    imageUrl: '/hobbies/guitar-placeholder.svg',
    featured: true,
    displayOrder: 2,
  },
  {
    id: 'competitive-gaming',
    title: 'Gaming — Valorant & League',
    category: 'Gaming & Esports',
    icon: 'GameController',
    description:
      'Competitive tactical FPS and MOBA player queuing Valorant and League of Legends—enjoying team strategy, sharp gunplay, clutch rounds, and ranked matches with friends.',
    tags: ['Valorant', 'League of Legends', 'Ranked Queue', 'FPS & MOBA'],
    imageUrl: '/hobbies/gaming-placeholder.svg',
    featured: true,
    displayOrder: 3,
  },
  {
    id: 'motorcycle-travel',
    title: 'Motorcycle Road Trips',
    category: 'Travel & Riding',
    icon: 'Motorcycle',
    description:
      'Hitting the open road on two wheels to explore scenic routes, take weekend rides, discover new destinations, and clear my head far away from screens.',
    tags: ['Motorcycle', 'Road Trips', 'Weekend Rides', 'Exploration'],
    imageUrl: '/hobbies/motorcycle-placeholder.svg',
    featured: true,
    displayOrder: 4,
  },
]
