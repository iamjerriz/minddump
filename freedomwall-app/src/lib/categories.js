export const CATEGORIES = [
  {
    id: 'love',
    label: 'Love',
    icon: '♥',
    description: 'Spill your heart out',
    gradient: 'from-pink-500 to-rose-500',
    accentColor: '#f43f5e',
    noteColors: ['#2d1f2f', '#2a1a2e', '#321e30', '#2e1a28', '#351f33'],
  },
  {
    id: 'thoughts',
    label: 'Thoughts',
    icon: '◉',
    description: 'Unload what\'s in your head',
    gradient: 'from-blue-500 to-cyan-500',
    accentColor: '#3b82f6',
    noteColors: ['#1a2332', '#1c2535', '#1e2738', '#192130', '#1f2a3a'],
  },
  {
    id: 'confessions',
    label: 'Confessions',
    icon: '▤',
    description: 'Say it here. No judgment.',
    gradient: 'from-purple-500 to-violet-500',
    accentColor: '#a855f7',
    noteColors: ['#251a35', '#271c37', '#2a1e3a', '#231832', '#2c203d'],
  },
  {
    id: 'dreams',
    label: 'Dreams',
    icon: '◇',
    description: 'Where your mind wanders at night',
    gradient: 'from-amber-500 to-yellow-500',
    accentColor: '#f59e0b',
    noteColors: ['#2d2a1a', '#302c1c', '#332e1e', '#2a2718', '#353120'],
  },
  {
    id: 'rants',
    label: 'Rants',
    icon: '⚡',
    description: 'Let it rip. Full volume.',
    gradient: 'from-red-500 to-orange-500',
    accentColor: '#ef4444',
    noteColors: ['#2d1a1a', '#301c1c', '#331e1e', '#2a1818', '#352020'],
  },
  {
    id: 'gratitude',
    label: 'Gratitude',
    icon: '△',
    description: 'The good stuff. Acknowledged.',
    gradient: 'from-emerald-500 to-green-500',
    accentColor: '#10b981',
    noteColors: ['#1a2d1f', '#1c301e', '#1e3320', '#182a1a', '#203522'],
  },
]

export const POSTS_PER_WALL = 100

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id)
}
