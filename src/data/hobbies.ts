import { Hobby } from '@/types/hobby'

export const hobbiesData: Hobby[] = [
  {
    id: 'pc-building',
    title: 'PC Building & Hardware',
    category: 'Hardware & Systems',
    icon: 'Cpu',
    description:
      'Building custom rigs, tuning airflow and thermals, routing cables cleanly, and benchmarking silicon efficiency.',
    tags: ['Custom Rig', 'Thermal Tuning', 'Benchmarking', 'Hardware'],
    imageUrl: '/hobbies/setupgreen.jpg',
    images: ['/hobbies/setupgreen.jpg', '/hobbies/setupred.jpg'],
    featured: true,
    displayOrder: 1,
  },
  {
    id: 'guitar-playing',
    title: 'Guitar Playing',
    category: 'Music',
    icon: 'Guitar',
    description:
      'Unwinding away from the keyboard by picking up the guitar, learning tracks by ear, and practicing riffs and chord progressions.',
    tags: ['Guitar', 'Riffs & Chords', 'Music'],
    imageUrl: '/hobbies/gitafakist.jpg',
    images: ['/hobbies/gitafakist.jpg', '/hobbies/gitafakist2.jpg'],
    featured: true,
    displayOrder: 2,
  },
  {
    id: 'competitive-gaming',
    title: 'Competitive Gaming',
    category: 'Valorant & League',
    icon: 'GameController',
    description:
      'Queuing ranked Valorant and League of Legends with friends for team strategy, mechanical precision, and high-pressure decision making.',
    tags: ['Valorant', 'League of Legends', 'Ranked Queue'],
    imageUrl: '/hobbies/immo3.jpeg',
    images: ['/hobbies/immo3.jpeg', '/hobbies/immortal.png', '/hobbies/lol.png', '/hobbies/rdr2.jpg'],
    featured: true,
    displayOrder: 3,
  },
  {
    id: 'motorcycle-travel',
    title: 'Motorcycle Road Trips',
    category: 'Travel & Riding',
    icon: 'Motorcycle',
    description:
      'Taking weekend rides along scenic routes to explore new roads and reset away from screens.',
    tags: ['Motorcycle', 'Road Trips', 'Weekend Rides'],
    imageUrl: '/hobbies/kamote1.jpeg',
    images: [
      '/hobbies/kamote1.jpeg',
      '/hobbies/kamote2.jpg',
      '/hobbies/kamote3.jpg',
      '/hobbies/kamote4.jpg',
    ],
    featured: true,
    displayOrder: 4,
  },
]
