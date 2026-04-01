import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../lib/categories';
import { MINDDUMP_CHARS } from '../lib/constants';

function WavingTitle() {
  return (
    <motion.h1
      className="mb-4 text-5xl font-black tracking-tight md:text-6xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {MINDDUMP_CHARS.map((item, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ color: item.color }}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
        >
          {item.char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export default function CategorySelect() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex min-h-screen flex-col items-center px-4 pt-24 pb-16"
      style={{ background: '#0a0e17' }}
    >
      {/* Neon ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '10%',
            width: '500px',
            height: '500px',
            background:
              'radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0%',
            right: '5%',
            width: '600px',
            height: '400px',
            background:
              'radial-gradient(circle, rgba(255, 45, 149, 0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: '400px',
            height: '400px',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(circle, rgba(191, 90, 242, 0.04) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Hero */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <WavingTitle />
        <motion.p
          className="mb-1 text-lg font-medium"
          style={{ color: 'rgba(0, 212, 255, 0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Dump your thoughts. Keep your peace.
        </motion.p>
        <motion.p
          className="text-sm"
          style={{ color: 'rgba(255, 45, 149, 0.8)' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Because some thoughts need a place to land.
        </motion.p>
      </motion.div>

      {/* Category Grid */}
      <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            onClick={() => navigate(`/wall/${cat.id}`)}
            className="group relative cursor-pointer rounded-xl p-6 text-left"
            style={{
              background: 'rgba(0, 212, 255, 0.02)',
              border: '1px solid rgba(0, 212, 255, 0.06)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: 0.2 + i * 0.08,
                ease: 'easeOut',
              },
            }}
            whileHover={{
              scale: 1.03,
              y: -4,
              borderColor: `${cat.accentColor}60`,
              boxShadow: `0 0 25px ${cat.accentColor}25, 0 0 60px ${cat.accentColor}08`,
              background: 'rgba(0, 212, 255, 0.03)',
              transition: { duration: 0.15 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mb-4 flex items-start justify-between">
              <motion.span
                className="text-3xl font-light"
                style={{ color: cat.accentColor }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {cat.icon}
              </motion.span>
              <svg
                className="h-4 w-4 transition-colors"
                style={{ color: 'rgba(0, 212, 255, 0.15)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7v10"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-bold text-white">{cat.label}</h3>
            <p className="text-sm text-gray-400">{cat.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Footer tagline */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: 'rgba(0, 212, 255, 0.8)' }}
        >
          No filters. No receipts. Just dump it.
        </p>
      </motion.div>
    </div>
  );
}
