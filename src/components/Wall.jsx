import { useState, useEffect, useCallback, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getCategoryById, POSTS_PER_WALL } from '../lib/categories';
import { generateSamplePosts } from '../lib/sampleData';
import { useAuth } from '../context/useAuth';
import PostCard from './PostCard';
import AddPostModal from './AddPostModal';

const USE_SAMPLE_DATA = false;

function postsReducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true };
    case 'loaded':
      return {
        loading: false,
        posts: action.posts,
        totalCount: action.totalCount,
      };
    case 'deleted':
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.id),
        totalCount: Math.max(0, state.totalCount - 1),
      };
    default:
      return state;
  }
}

export default function Wall() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [{ posts, loading, totalCount }, dispatch] = useReducer(postsReducer, {
    posts: [],
    loading: true,
    totalCount: 0,
  });
  const [displayPosts, setDisplayPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const [page, setPage] = useState(1);
  const [showAddPost, setShowAddPost] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const cat = getCategoryById(category);
  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_WALL));

  const loadPosts = useCallback(async () => {
    dispatch({ type: 'loading' });

    if (USE_SAMPLE_DATA) {
      const sample = generateSamplePosts(category, 100);
      const from = (page - 1) * POSTS_PER_WALL;
      dispatch({
        type: 'loaded',
        posts: sample.slice(from, from + POSTS_PER_WALL),
        totalCount: sample.length,
      });
      return;
    }

    const from = (page - 1) * POSTS_PER_WALL;
    const to = from + POSTS_PER_WALL - 1;

    const [countResult, dataResult] = await Promise.all([
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('category', category),
      supabase
        .from('posts')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(from, to),
    ]);

    if (dataResult.error) {
      console.error('Error fetching posts:', dataResult.error.message);
    }

    const loadedPosts = dataResult.data || [];
    dispatch({
      type: 'loaded',
      posts: loadedPosts,
      totalCount: countResult.count || 0,
    });

    // Fetch like counts for loaded posts
    if (loadedPosts.length > 0) {
      const postIds = loadedPosts.map((p) => p.id);
      const { data: likesData } = await supabase
        .from('likes')
        .select('post_id')
        .in('post_id', postIds);

      if (likesData) {
        const counts = {};
        likesData.forEach((like) => {
          counts[like.post_id] = (counts[like.post_id] || 0) + 1;
        });
        setLikeCounts(counts);
      }

      // Fetch current user's likes
      if (user) {
        const { data: userLikesData } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        if (userLikesData) {
          setUserLikes(new Set(userLikesData.map((l) => l.post_id)));
        }
      }
    }
  }, [category, page, user]);

  useEffect(() => {
    if (!cat) {
      navigate('/');
      return;
    }
    loadPosts();
  }, [cat, loadPosts, navigate]);

  useEffect(() => {
    setDisplayPosts(posts);
  }, [posts]);

  if (!cat) return null;

  const scramble = () => {
    setDisplayPosts((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setShuffleKey((k) => k + 1);
  };

  const handleLike = async (postId) => {
    if (!user) return;
    const liked = userLikes.has(postId);

    // Optimistic update
    setUserLikes((prev) => {
      const next = new Set(prev);
      liked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (liked ? -1 : 1),
    }));

    if (liked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);
      if (error) {
        // Revert on failure
        setUserLikes((prev) => new Set(prev).add(postId));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: (prev[postId] || 0) + 1,
        }));
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.id, post_id: postId });
      if (error) {
        setUserLikes((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] || 0) - 1),
        }));
      }
    }
  };

  const handleDelete = async (postId) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
      console.error('Error deleting post:', error.message);
      return;
    }
    dispatch({ type: 'deleted', id: postId });
    setDisplayPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handlePostCreated = () => {
    setShowAddPost(false);
    setPage(1);
    loadPosts();
  };

  return (
    <div
      className="relative min-h-screen pt-16 lg:pt-20"
      style={{ background: '#0a0e17' }}
    >
      {/* Sidebar - desktop / Top bar - mobile */}
      <motion.div
        className="mb-2 px-3 py-3 lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:z-20 lg:mb-0 lg:flex lg:w-48 lg:flex-col lg:justify-between lg:px-4 lg:py-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Top section: back + title + buttons */}
        <div className="flex gap-3 lg:flex-col lg:gap-5">
          <motion.button
            onClick={() => navigate('/')}
            className="cursor-pointer text-gray-500 transition-colors hover:text-indigo-400 lg:self-start"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          <div className="flex items-center gap-2 lg:gap-3">
            <motion.span
              className="text-2xl lg:text-3xl"
              style={{ color: cat.accentColor }}
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {cat.icon}
            </motion.span>
            <div>
              <h1 className="text-base leading-tight font-bold text-white lg:text-xl">
                {cat.label}
              </h1>
              <p className="text-[11px] text-gray-500">
                {totalCount} {totalCount === 1 ? 'post' : 'posts'}
                {totalPages > 1 && ` · ${page}/${totalPages}`}
              </p>
            </div>
          </div>

          {/* Desktop buttons */}
          <div className="hidden flex-col gap-2 lg:flex">
            <motion.button
              onClick={() => setShowAddPost(true)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #bf5af2)',
                color: '#0a0e17',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Dump it
            </motion.button>
            <motion.button
              onClick={scramble}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
              style={{
                background: 'rgba(0, 212, 255, 0.04)',
                border: '1px solid rgba(0, 212, 255, 0.1)',
                color: '#4a5568',
              }}
              whileHover={{
                scale: 1.03,
                borderColor: 'rgba(0, 212, 255, 0.3)',
                color: '#00d4ff',
              }}
              whileTap={{ y: -4 }}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Scramble
            </motion.button>
          </div>

          {/* Mobile buttons */}
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <motion.button
              onClick={scramble}
              className="cursor-pointer rounded-md p-2"
              style={{
                background: 'rgba(0, 212, 255, 0.04)',
                border: '1px solid rgba(0, 212, 255, 0.1)',
                color: '#4a5568',
              }}
              whileTap={{ y: -4 }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => setShowAddPost(true)}
              className="cursor-pointer rounded-md p-2 text-white"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #bf5af2)',
                color: '#0a0e17',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Bottom slogan - desktop only */}
        <p className="hidden text-[11px] leading-relaxed text-gray-600 italic lg:block">
          {cat.slogan}
        </p>
      </motion.div>

      {/* Posts */}
      <div className="px-2 lg:ml-48 lg:px-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="h-10 w-10 rounded-full"
              style={{
                border: `3px solid ${cat.accentColor}20`,
                borderTopColor: cat.accentColor,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : displayPosts.length === 0 ? (
          <motion.div
            className="py-20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              className="mb-4 block text-5xl"
              style={{ color: cat.accentColor }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: 'easeOut',
              }}
            >
              {cat.icon}
            </motion.span>
            <p className="mb-2 text-lg text-gray-400">Nothing here yet.</p>
            <p className="text-sm text-gray-600">
              Be the first to dump something.
            </p>
          </motion.div>
        ) : (
          <div
            style={{ columnGap: '10px' }}
            className="[column-count:2] md:[column-count:3] lg:[column-count:4] xl:[column-count:5] 2xl:[column-count:6]"
          >
            {displayPosts.map((post, i) => (
              <div key={post.id} className="mb-2.5 break-inside-avoid">
                <PostCard
                  post={post}
                  index={i}
                  shuffleKey={shuffleKey}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  likeCount={likeCounts[post.id] || 0}
                  liked={userLikes.has(post.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="mt-10 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ border: '1px solid rgba(0, 212, 255, 0.1)' }}
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <motion.button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="h-9 w-9 cursor-pointer rounded-lg text-sm"
                  style={{
                    background:
                      page === pageNum
                        ? 'linear-gradient(135deg, #00d4ff, #bf5af2)'
                        : 'transparent',
                    color: page === pageNum ? '#0a0e17' : '#4a5568',
                    border:
                      page === pageNum
                        ? 'none'
                        : '1px solid rgba(0, 212, 255, 0.08)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {pageNum}
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ border: '1px solid rgba(0, 212, 255, 0.1)' }}
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
  );
}
