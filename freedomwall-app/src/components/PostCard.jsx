// eslint-disable-next-line no-unused-vars
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

export default function PostCard({ post, index = 0 }) {
  const category = getCategoryById(post.category)
  const noteColors = category?.noteColors || ['#1a1a2e']
  const bgColor = useMemo(
    () => noteColors[Math.floor(Math.random() * noteColors.length)],
    [post.id]
  )

  return (
    <motion.div
      className="rounded-xl p-5 flex flex-col justify-between break-words cursor-default"
      style={{
        background: bgColor,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
        minHeight: '160px',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{
        y: -6,
        boxShadow: `0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${category?.accentColor || '#6366f1'}10`,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap flex-1">
        {post.content}
      </p>
      <div className="flex items-center justify-between mt-4 pt-3"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <div className="flex items-center gap-2">
          {post.avatar_url ? (
            <img src={post.avatar_url} alt="" className="w-5 h-5 rounded-full" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-300">
              {post.username?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-400">{post.username}</span>
        </div>
        <span className="text-xs text-gray-600">{formatDate(post.created_at)}</span>
      </div>
    </motion.div>
  )
}
