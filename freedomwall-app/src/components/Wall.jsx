import { useState, useEffect, useCallback, useReducer } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { getCategoryById, POSTS_PER_WALL } from '../lib/categories'
import { generateSamplePosts } from '../lib/sampleData'
import PostCard from './PostCard'
import AddPostModal from './AddPostModal'

const USE_SAMPLE_DATA = true

function postsReducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'loaded':
      return { loading: false, posts: action.posts, totalCount: action.totalCount }
    default:
      return state
  }
}

export default function Wall() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [{ posts, loading, totalCount }, dispatch] = useReducer(postsReducer, {
    posts: [],
    loading: true,
    totalCount: 0,
  })
  const [displayPosts, setDisplayPosts] = useState([])
  const [page, setPage] = useState(1)
  const [showAddPost, setShowAddPost] = useState(false)
  const [shuffleKey, setShuffleKey] = useState(0)

  const cat = getCategoryById(category)
  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_WALL))

  const fetchPosts = useCallback(async () => {
    if (USE_SAMPLE_DATA) {
      const sample = generateSamplePosts(category, 100)
      const from = (page - 1) * POSTS_PER_WALL
      return { posts: sample.slice(from, from + POSTS_PER_WALL), count: sample.length }
    }

    const from = (page - 1) * POSTS_PER_WALL
    const to = from + POSTS_PER_WALL - 1

    const [countResult, dataResult] = await Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('category', category),
      supabase.from('posts').select('*').eq('category', category)
        .order('created_at', { ascending: false }).range(from, to),
    ])

    if (dataResult.error) {
      console.error('Error fetching posts:', dataResult.error.message)
    }

    return { posts: dataResult.data || [], count: countResult.count || 0 }
  }, [category, page])

  useEffect(() => {
    if (!cat) {
      navigate('/')
      return
    }

    let cancelled = false
    dispatch({ type: 'loading' })

    fetchPosts().then((result) => {
      if (cancelled) return
      dispatch({ type: 'loaded', posts: result.posts, totalCount: result.count })
    })

    return () => { cancelled = true }
  }, [cat, fetchPosts, navigate])

  useEffect(() => {
    setDisplayPosts(posts)
  }, [posts])

  if (!cat) return null

  const scramble = () => {
    setDisplayPosts((prev) => {
      const shuffled = [...prev]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    })
    setShuffleKey((k) => k + 1)
  }

  const handlePostCreated = () => {
    setShowAddPost(false)
    setPage(1)
  }

  return (
    <div
      className="min-h-screen pt-20 pb-12 px-4 relative"
      style={{ background: 'linear-gradient(160deg, #050510 0%, #0a0a20 30%, #0d0818 60%, #080515 100%)' }}
    >
      {/* Header */}
      <motion.div
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-indigo-400 transition-colors cursor-pointer"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.span
              className="text-3xl"
              style={{ color: cat.accentColor }}
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {cat.icon}
            </motion.span>
            <div>
              <h1 className="text-2xl font-bold text-white">{cat.label} Wall</h1>
              <p className="text-sm text-gray-500">
                {totalCount} {totalCount === 1 ? 'post' : 'posts'}
                {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={scramble}
              className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-md font-semibold cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#9ca3af',
              }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(124, 58, 237, 0.3)', color: '#e5e7eb' }}
              whileTap={{ y: -6 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Scramble
            </motion.button>
            <motion.button
              onClick={() => setShowAddPost(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-white text-sm rounded-md font-semibold cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dump it
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Posts */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="w-10 h-10 rounded-full"
              style={{ border: `3px solid ${cat.accentColor}20`, borderTopColor: cat.accentColor }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : displayPosts.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              className="text-5xl mb-4 block"
              style={{ color: cat.accentColor }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {cat.icon}
            </motion.span>
            <p className="text-gray-400 text-lg mb-2">Nothing here yet.</p>
            <p className="text-gray-600 text-sm">Be the first to dump something.</p>
          </motion.div>
        ) : (
          <div
            style={{ columnGap: '12px' }}
            className="[column-count:2] md:[column-count:3] lg:[column-count:4] xl:[column-count:5]"
          >
            {displayPosts.map((post, i) => (
              <div key={post.id} className="mb-3 break-inside-avoid">
                <PostCard post={post} index={i} shuffleKey={shuffleKey} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer hover:bg-white/5"
            style={{ border: '1px solid rgba(99, 102, 241, 0.15)' }}
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <motion.button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="w-9 h-9 rounded-lg text-sm cursor-pointer"
                  style={{
                    background: page === pageNum ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'transparent',
                    color: page === pageNum ? 'white' : '#9ca3af',
                    border: page === pageNum ? 'none' : '1px solid rgba(99, 102, 241, 0.1)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {pageNum}
                </motion.button>
              )
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg text-sm text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer hover:bg-white/5"
            style={{ border: '1px solid rgba(99, 102, 241, 0.15)' }}
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Add Post Modal */}
      <AnimatePresence>
        {showAddPost && (
          <AddPostModal
            category={category}
            onClose={() => setShowAddPost(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
