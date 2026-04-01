import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getCategoryById } from '../lib/categories';
import { useWallPosts } from '../hooks/useWallPosts';
import WallSidebar from './WallSidebar';
import PostsGrid from './PostsGrid';
import Pagination from './Pagination';
import AddPostModal from './AddPostModal';

export default function Wall() {
  const { category } = useParams();
  const navigate = useNavigate();
  const {
    posts,
    loading,
    totalCount,
    totalPages,
    page,
    setPage,
    likeCounts,
    userLikes,
    handleLike,
    handleDelete: hookDelete,
    loadPosts,
  } = useWallPosts(category);

  const [displayPosts, setDisplayPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const cat = getCategoryById(category);

  useEffect(() => {
    if (!cat) {
      navigate('/');
    }
  }, [cat, navigate]);

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

  const handleDelete = async (postId) => {
    await hookDelete(postId);
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
      <WallSidebar
        cat={cat}
        totalCount={totalCount}
        totalPages={totalPages}
        page={page}
        onAddPost={() => setShowAddPost(true)}
        onScramble={scramble}
      />

      <div className="px-2 lg:ml-48 lg:px-3">
        <PostsGrid
          cat={cat}
          loading={loading}
          displayPosts={displayPosts}
          shuffleKey={shuffleKey}
          likeCounts={likeCounts}
          userLikes={userLikes}
          onDelete={handleDelete}
          onLike={handleLike}
        />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

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
