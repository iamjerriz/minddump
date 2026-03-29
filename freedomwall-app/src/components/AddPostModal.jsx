import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase'
import { getCategoryById } from '../lib/categories'

export default function AddPostModal({ category, onClose, onPostCreated }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user, signInWithGoogle } = useAuth()
  const cat = getCategoryById(category)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setSubmitting(true)
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      username: user.user_metadata?.full_name || 'Anonymous',
      avatar_url: user.user_metadata?.avatar_url || '',
      category,
      content: content.trim(),
    })

    setSubmitting(false)

    if (error) {
      console.error('Error creating post:', error.message)
      return
    }

    setContent('')
    onPostCreated()
  }

  return (
    <motion.div
      className="fixed inset-0 z-2000 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      initial={{ background: 'rgba(0, 0, 0, 0)' }}
      animate={{ background: 'rgba(0, 0, 0, 0.7)' }}
      exit={{ background: 'rgba(0, 0, 0, 0)', transition: { delay: 0.1 } }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <motion.span
              className="text-2xl"
              style={{ color: cat?.accentColor }}
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', delay: 0.15 }}
            >
              {cat?.icon}
            </motion.span>
            <h2 className="text-lg font-bold text-white">{cat?.label}</h2>
          </div>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-xl leading-none"
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            &times;
          </motion.button>
        </div>

        {user ? (
          <form onSubmit={handleSubmit}>
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={user.user_metadata?.avatar_url}
                alt=""
                className="w-7 h-7 rounded-full ring-2 ring-indigo-500/30"
              />
              <span className="text-sm text-indigo-200">
                {user.user_metadata?.full_name}
              </span>
            </motion.div>
            <motion.textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Dump your ${cat?.label?.toLowerCase()} here...`}
              className="w-full p-4 rounded-xl text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
              }}
              rows={5}
              maxLength={500}
              autoFocus
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            />
            <motion.div
              className="flex justify-between items-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs text-gray-500">{content.length}/500</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={!content.trim() || submitting}
                  className="px-6 py-2 text-white text-sm rounded-md font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {submitting ? 'Dumping...' : 'Dump it'}
                </motion.button>
              </div>
            </motion.div>
          </form>
        ) : (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-400 mb-5">Sign in to write on this wall</p>
            <motion.button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm rounded-full cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
