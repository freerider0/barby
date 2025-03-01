"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FancyTextRotatorProps {
  texts?: string[]
  interval?: number
}

const defaultTexts = ["Welcome to our site", "Discover amazing features", "Join our community"]

export default function FancyTextRotator({ texts = defaultTexts, interval = 3000 }: FancyTextRotatorProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, interval)

    return () => clearInterval(rotationInterval)
  }, [texts, interval])

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentTextIndex}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5, type: "spring", stiffness: 100 },
            }}
            className="inline-block"
          >
            {texts[currentTextIndex]}
          </motion.span>
        </AnimatePresence>
      </h1>
    </div>
  )
}