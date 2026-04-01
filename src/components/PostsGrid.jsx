import { motion } from 'framer-motion';
import PostCard from './PostCard';

export default function PostsGrid({
  cat,
  loading,
  displayPosts,
  shuffleKey,
  likeCounts,
  userLikes,
  onDelete,
  onLike,
}) {
  if (loading) {
    return (
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
    );
  }

  if (displayPosts.length === 0) {
    return (
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
        <p className="text-sm text-gray-600">Be the first to dump something.</p>
      </motion.div>
    );
  }

  return (
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
            onDelete={onDelete}
            onLike={onLike}
            likeCount={likeCounts[post.id] || 0}
            liked={userLikes.has(post.id)}
          />
        </div>
      ))}
    </div>
  );
}
