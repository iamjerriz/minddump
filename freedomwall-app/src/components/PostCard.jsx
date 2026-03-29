import { motion } from 'framer-motion'
import { getCategoryById } from '../lib/categories'
import { useMemo } from 'react'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function seededRandom(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b)
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b)
    h = (h ^ (h >>> 16)) >>> 0
    return h / 4294967296
  }
}

const FONTS = [
  "'Courier New', monospace",
  "'Georgia', serif",
  "system-ui, sans-serif",
  "'Times New Roman', serif",
  "'Segoe UI', sans-serif",
]

export default function PostCard({ post, index = 0, shuffleKey = 0 }) {
  const category = getCategoryById(post.category)

  const cardStyle = useMemo(() => {
    const colors = category?.noteColors || ['#1a1a2e']
    const rand = seededRandom(post.id + String(shuffleKey))
    const rotation = (rand() - 0.5) * 6
    const offsetX = (rand() - 0.5) * 12
    const offsetY = (rand() - 0.5) * 8
    const bgColor = colors[Math.floor(rand() * colors.length)]
    const font = FONTS[Math.floor(rand() * FONTS.length)]
    const size = rand() > 0.7 ? 'text-base' : rand() > 0.3 ? 'text-sm' : 'text-xs'
    const initialSpin = (rand() - 0.5) * 10

    return { rotation, offsetX, offsetY, bgColor, font, size, initialSpin }
  }, [post.id, shuffleKey, category])

  return (
    <motion.div
      className="rounded-lg p-4 flex flex-col justify-between break-words cursor-default"
      style={{
        background: cardStyle.bgColor,
        border: `1px solid ${category?.accentColor || '#00d4ff'}08`,
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.3)',
        fontFamily: cardStyle.font,
        transform: `rotate(${cardStyle.rotation}deg) translate(${cardStyle.offsetX}px, ${cardStyle.offsetY}px)`,
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: cardStyle.rotation + cardStyle.initialSpin }}
      animate={{ opacity: 1, scale: 1, rotate: cardStyle.rotation }}
      transition={{ duration: 0.4, delay: index * 0.02, ease: 'easeOut' }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        zIndex: 50,
        boxShadow: `0 15px 40px rgba(0, 0, 0, 0.5), 0 0 20px ${category?.accentColor || '#00d4ff'}20`,
        borderColor: `${category?.accentColor || '#00d4ff'}25`,
      }}
    >
      <p className={`text-gray-200 leading-relaxed whitespace-pre-wrap flex-1 ${cardStyle.size}`}>
        {post.content}
      </p>
      <div
        className="flex items-center justify-between mt-3 pt-2"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        <div className="flex items-center gap-1.5">
          {post.avatar_url ? (
            <img src={post.avatar_url} alt="" className="w-4 h-4 rounded-full" />
          ) : (
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
              style={{ background: `${category?.accentColor || '#6366f1'}25`, color: category?.accentColor }}
            >
              {post.username?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-[11px] text-gray-500">{post.username}</span>
        </div>
        <span className="text-[10px] text-gray-700">{formatDate(post.created_at)}</span>
      </div>
    </motion.div>
  )
}
