import { motion } from 'framer-motion'

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
      />
    </div>
  )
}

export default LoadingSpinner