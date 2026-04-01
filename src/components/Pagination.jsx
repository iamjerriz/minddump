import { motion } from 'framer-motion';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <motion.div
      className="mt-10 flex items-center justify-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
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
              onClick={() => onPageChange(pageNum)}
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
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
        style={{ border: '1px solid rgba(0, 212, 255, 0.1)' }}
      >
        Next
      </button>
    </motion.div>
  );
}
