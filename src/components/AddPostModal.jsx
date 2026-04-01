import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabase';
import { getCategoryById } from '../lib/categories';
import { generateRandomName } from '../lib/helpers';

export default function AddPostModal({ category, onClose, onPostCreated }) {
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const cat = getCategoryById(category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setSubmitting(true);
    const displayName = anonymous
      ? generateRandomName()
      : user.user_metadata?.full_name || 'Anonymous';
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      username: displayName,
      avatar_url: anonymous ? '' : user.user_metadata?.avatar_url || '',
      category,
      content: content.trim(),
    });

    setSubmitting(false);

    if (error) {
      console.error('Error creating post:', error.message);
      return;
    }

    setContent('');
    onPostCreated();
  };

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
          background: 'linear-gradient(135deg, #0f1620 0%, #141e2e 100%)',
          border: `1px solid ${cat?.accentColor}20`,
          boxShadow: `0 0 40px ${cat?.accentColor}10`,
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="mb-5 flex items-center justify-between">
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
            className="cursor-pointer text-xl leading-none transition-colors"
            style={{ color: '#4a5568' }}
            whileHover={{ scale: 1.2, rotate: 90, color: '#00d4ff' }}
            whileTap={{ scale: 0.9 }}
          >
            &times;
          </motion.button>
        </div>

        {user ? (
          <form onSubmit={handleSubmit}>
            <motion.div
              className="mb-4 flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                {!anonymous && (
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt=""
                    className="h-7 w-7 rounded-full"
                    style={{ boxShadow: `0 0 8px ${cat?.accentColor}30` }}
                  />
                )}
                <span className="text-sm" style={{ color: '#00d4ff90' }}>
                  {anonymous
                    ? '🎭 Posting anonymously'
                    : user.user_metadata?.full_name}
                </span>
              </div>
              <label className="flex cursor-pointer items-center gap-1.5 select-none">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="peer sr-only"
                />
                <div
                  className="relative h-4.5 w-8 rounded-full transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3.5"
                  style={{
                    background: anonymous
                      ? cat?.accentColor || '#00d4ff'
                      : 'rgba(255,255,255,0.1)',
                  }}
                />
                <span className="text-[11px]">Anon</span>
              </label>
            </motion.div>
            <motion.textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Dump your ${cat?.label?.toLowerCase()} here...`}
              className="w-full resize-none rounded-xl p-4 text-sm text-gray-100 focus:ring-2 focus:outline-none"
              style={{
                background: 'rgba(0, 212, 255, 0.04)',
                border: `1px solid ${cat?.accentColor}15`,
                '--tw-ring-color': `${cat?.accentColor}40`,
                '::placeholder': { color: '#2d3748' },
              }}
              rows={5}
              maxLength={500}
              autoFocus
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            />
            <motion.div
              className="mt-4 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs text-gray-300">
                {content.length}/500
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 text-sm text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={!content.trim() || submitting}
                  className="cursor-pointer rounded-md px-6 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-30"
                  style={{
                    background: `linear-gradient(135deg, #00d4ff, ${cat?.accentColor || '#bf5af2'})`,
                    color: '#0a0e17',
                    boxShadow: `0 0 20px ${cat?.accentColor}25`,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 0 30px ${cat?.accentColor}40`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {submitting ? 'Dumping...' : 'Dump it'}
                </motion.button>
              </div>
            </motion.div>
          </form>
        ) : (
          <motion.div
            className="py-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="mb-5" style={{ color: '#4a5568' }}>
              Sign in to write on this wall
            </p>
            <motion.button
              onClick={signInWithGoogle}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #bf5af2)',
                color: '#0a0e17',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#0a0e17"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#0a0e17"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#0a0e17"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#0a0e17"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
