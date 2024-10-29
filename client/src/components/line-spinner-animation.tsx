'use client'

import { motion } from 'framer-motion'

export function LineSpinnerAnimationComponent() {
  const numberOfLines = 12
  const spinnerSize = 40
  const lineWidth = 2
  const lineHeight = 10

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <motion.div
        className="relative"
        style={{ width: spinnerSize, height: spinnerSize }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        aria-label="Loading"
      >
        {[...Array(numberOfLines)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute bg-white"
            style={{
              width: lineWidth,
              height: lineHeight,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${index * (360 / numberOfLines)}deg) translateY(${spinnerSize / 2 - lineHeight / 2}px)`,
              opacity: 1 - (index * 0.7) / numberOfLines,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}