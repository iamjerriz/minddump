import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { getCategoryById, POSTS_PER_WALL } from '../lib/categories'
import PostCard from './PostCard'
import AddPostModal from './AddPostModal'

export default function Wall() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [showAddPost, setShowAddPost] = useState(false)

  const cat = getCategoryById(category)
  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_WALL))

  const fetchPosts = useCallback(async () => {
    setLoading(true)

    const from = (page - 1) * POSTS_PER_WALL
    const to = from + POSTS_PER_WALL - 1

    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('category', category)

    setTotalCount(count || 0)

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching posts:', error.message)
    }

    setPosts(data || [])
    setLoading(false)
  }, [category, page])

  useEffect(() => {
    if (!cat) {
      navigate('/')
      return
    }
    fetchPosts()
  }, [cat, fetchPosts, navigate])

  if (!cat) return null

  const handlePostCreated = () => {
    setShowAddPost(false)
    setPage(1)
    fetchPosts()
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4"
      style={{ background: 'linear-gradient(160deg, #050510 0%, #0a0a20 30%, #0d0818 60%, #080515 100%)' }}
    >
      {/* Neon ambient */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
        <div style={{
          position: 'absolute', top: '-10%', right: '10%', width: '500px', height: '500px',
          background: `radial-gradient(circle, ${cat.accentColor}0a 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </div>

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
      </motion.div>

      {/* Posts Grid */}
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
        ) : posts.length === 0 ? (
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
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </motion.div>
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
                    background: page === pageNum
                      ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                      : 'transparent',
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
