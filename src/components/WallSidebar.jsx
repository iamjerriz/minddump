import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function WallSidebar({
  cat,
  totalCount,
  totalPages,
  page,
  onAddPost,
  onScramble,
}) {
  const navigate = useNavigate();

  return (
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
            <p className="text-[11px] text-gray-300">
              {totalCount} {totalCount === 1 ? 'post' : 'posts'}
              {totalPages > 1 && ` · ${page}/${totalPages}`}
            </p>
          </div>
        </div>

        {/* Desktop buttons */}
        <div className="hidden flex-col gap-2 lg:flex">
          <motion.button
            onClick={onAddPost}
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
            onClick={onScramble}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
            style={{
              background: 'rgba(0, 212, 255, 0.04)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
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
            onClick={onScramble}
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
            onClick={onAddPost}
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
      <p className="hidden text-[11px] leading-relaxed text-gray-300 italic lg:block">
        {cat.slogan}
      </p>
    </motion.div>
  );
}
