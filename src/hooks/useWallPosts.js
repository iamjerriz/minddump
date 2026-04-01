import { useState, useEffect, useCallback, useReducer } from 'react';
import { supabase } from '../lib/supabase';
import { getCategoryById, POSTS_PER_WALL } from '../lib/categories';
import { generateSamplePosts } from '../lib/sampleData';
import { useAuth } from '../context/useAuth';

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

export function useWallPosts(category) {
  const { user } = useAuth();
  const [{ posts, loading, totalCount }, dispatch] = useReducer(postsReducer, {
    posts: [],
    loading: true,
    totalCount: 0,
  });
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const [page, setPage] = useState(1);

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
    if (getCategoryById(category)) {
      loadPosts();
    }
  }, [category, loadPosts]);

  const handleLike = async (postId) => {
    if (!user) return;
    const liked = userLikes.has(postId);

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
  };

  return {
    posts,
    loading,
    totalCount,
    totalPages,
    page,
    setPage,
    likeCounts,
    userLikes,
    handleLike,
    handleDelete,
    loadPosts,
  };
}
