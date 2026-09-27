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
    id: 'embedded-iot',
    title: 'Embedded Systems & IoT Prototyping',
    category: 'Engineering & Maker',
    icon: 'Circuitry',
    description:
      'Tinkering with microcontrollers like ESP32 and Arduino, integrating sensor telemetry, designing smart controllers, and bridging hardware with real-time web interfaces.',
    tags: ['ESP32', 'Arduino', 'Sensor Telemetry', 'MQTT / C++'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    featured: true,
    displayOrder: 2,
  },
  {
    id: 'gaming-interactive',
    title: 'Gaming & Simulation Engines',
    category: 'Interactive Media',
    icon: 'GameController',
    description:
      'Deep interest in game mechanics, physics engines, and graphics pipelines. Exploring real-time 3D shaders, immersion setups, and system performance optimizations.',
    tags: ['Tactical Games', 'Simulation', 'Unity Engine', 'Graphics Pipelines'],
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    featured: true,
    displayOrder: 3,
  },
  {
    id: 'cad-3d-printing',
    title: '3D CAD & Rapid Prototyping',
    category: 'Physical Computing',
    icon: 'Cube',
    description:
      'Modeling functional mechanical enclosures and brackets in Fusion 360, translating digital concepts into tangible engineering components using 3D printing.',
    tags: ['Fusion 360', 'FDM 3D Printing', 'Functional Enclosures', 'Rapid Prototyping'],
    imageUrl: 'https://images.unsplash.com/photo-1615992174118-9b8e9be025e7?auto=format&fit=crop&w=800&q=80',
    featured: true,
    displayOrder: 4,
  },
]
