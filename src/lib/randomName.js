const ADJECTIVES = [
  'Silent', 'Cosmic', 'Neon', 'Drifting', 'Restless', 'Feral', 'Hollow',
  'Burning', 'Frozen', 'Wandering', 'Velvet', 'Cryptic', 'Wired', 'Broken',
  'Glowing', 'Phantom', 'Rogue', 'Hazy', 'Savage', 'Gentle', 'Dizzy',
  'Midnight', 'Electric', 'Sleepy', 'Wild', 'Lost', 'Brave', 'Chaotic',
  'Pixel', 'Stray', 'Rusty', 'Cloudy', 'Vivid', 'Quiet', 'Rapid',
  'Dusty', 'Moody', 'Shady', 'Lucid', 'Bitter', 'Golden', 'Twisted',
]

const NOUNS = [
  'Fox', 'Ghost', 'Owl', 'Wolf', 'Raven', 'Moth', 'Cat', 'Crow',
  'Bear', 'Lynx', 'Hawk', 'Viper', 'Spark', 'Echo', 'Glitch', 'Pulse',
  'Shade', 'Ember', 'Storm', 'Drift', 'Blade', 'Thorn', 'Comet', 'Byte',
  'Node', 'Cloud', 'Flame', 'Frost', 'Stone', 'Wave', 'Void', 'Star',
  'Orbit', 'Pixel', 'Fang', 'Haze', 'Reef', 'Tide', 'Dusk', 'Mist',
]

export function generateRandomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adj} ${noun}`
}
