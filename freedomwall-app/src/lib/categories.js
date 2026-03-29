export const CATEGORIES = [
  {
    id: 'love',
    label: 'Love',
    icon: '♥',
    description: 'Spill your heart out',
    slogan: 'The heart remembers what the mind forgets.',
    accentColor: '#ff2d95',
    noteColors: ['#1a0a14', '#1f0c18', '#24101c', '#180915', '#2a1220'],
  },
  {
    id: 'thoughts',
    label: 'Thoughts',
    icon: '◉',
    description: 'Unload what\'s in your head',
    slogan: 'Think it. Dump it. Breathe.',
    accentColor: '#00d4ff',
    noteColors: ['#0a1418', '#0c181e', '#0e1c22', '#091216', '#101e24'],
  },
  {
    id: 'confessions',
    label: 'Confessions',
    icon: '▤',
    description: 'Say it here. No judgment.',
    slogan: 'The truth is lighter when you let it go.',
    accentColor: '#bf5af2',
    noteColors: ['#140a1e', '#180c24', '#1c1028', '#12091a', '#20122c'],
  },
  {
    id: 'dreams',
    label: 'Dreams',
    icon: '◇',
    description: 'Where your mind wanders at night',
    slogan: 'Close your eyes. Open your mind.',
    accentColor: '#ffd60a',
    noteColors: ['#18160a', '#1c1a0c', '#201e0e', '#141209', '#242010'],
  },
  {
    id: 'rants',
    label: 'Rants',
    icon: '⚡',
    description: 'Let it rip. Full volume.',
    slogan: 'Scream into the void. It listens here.',
    accentColor: '#ff453a',
    noteColors: ['#1a0a0a', '#1f0c0c', '#24100e', '#180908', '#2a1210'],
  },
  {
    id: 'gratitude',
    label: 'Gratitude',
    icon: '△',
    description: 'The good stuff. Acknowledged.',
    slogan: 'What you appreciate, appreciates.',
    accentColor: '#30d158',
    noteColors: ['#0a1a0e', '#0c1f10', '#0e2414', '#09180c', '#102a16'],
  },
]

export const POSTS_PER_WALL = 100

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id)
}
