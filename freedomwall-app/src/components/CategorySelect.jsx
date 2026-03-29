import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CATEGORIES } from '../lib/categories';

export default function CategorySelect() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen pt-24 pb-16 px-4 flex flex-col items-center relative'
      style={{ background: 'linear-gradient(160deg, #050510 0%, #0a0a20 30%, #0d0818 60%, #080515 100%)' }}
    >
      {/* Neon ambient blobs */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
        <div style={{
          position: 'absolute', top: '-15%', left: '10%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '0%', right: '5%', width: '600px', height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '50%', width: '400px', height: '400px',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </div>

      {/* Hero */}
      <motion.div className='text-center mb-16' initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <motion.h1
          className='text-5xl md:text-6xl font-black mb-4 tracking-tight text-white'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Mind<span style={{ color: '#a78bfa' }}>Dump</span>
        </motion.h1>
        <motion.p className='text-gray-400 text-lg mb-1 font-medium' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          Dump your thoughts. Keep your peace.
        </motion.p>
        <motion.p className='text-gray-500 text-sm' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Because some thoughts need a place to land.
        </motion.p>
      </motion.div>

      {/* Category Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full relative z-10'>
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            onClick={() => navigate(`/wall/${cat.id}`)}
            className='group relative p-6 rounded-xl text-left cursor-pointer'
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
            whileHover={{
              scale: 1.03,
              y: -4,
              borderColor: `${cat.accentColor}50`,
              boxShadow: `0 0 25px ${cat.accentColor}20, 0 0 60px ${cat.accentColor}08, inset 0 0 20px ${cat.accentColor}05`,
              background: 'rgba(255, 255, 255, 0.03)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className='flex items-start justify-between mb-4'>
              <motion.span className='text-3xl font-light' style={{ color: cat.accentColor }} whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                {cat.icon}
              </motion.span>
              <svg className='w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 17L17 7M17 7H7M17 7v10' />
              </svg>
            </div>
            <h3 className='text-lg font-bold text-white mb-1'>{cat.label}</h3>
            <p className='text-sm text-gray-500'>{cat.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Footer tagline */}
      <motion.div className='mt-16 text-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <p className='text-gray-400 text-xs tracking-widest uppercase'>No filters. No receipts. Just dump it.</p>
      </motion.div>
    </div>
  );
}
