"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Animated notification component
export function AnimatedNotification({ show, message, type = "info", duration = 3000, onClose }) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  // Define colors based on notification type
  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-700"
      case "error":
        return "bg-red-100 border-red-500 text-red-700"
      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-700"
      default:
        return "bg-blue-100 border-blue-500 text-blue-700"
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-md border-l-4 shadow-md ${getColors()}`}
        >
          <div className="flex items-center justify-between">
            <p>{message}</p>
            <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animated page transition wrapper
export function PageTransition({ children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  )
}

// Loading animation component
export function LoadingAnimation({ size = "medium", color = "primary" }) {
  const sizeClass = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  const colorClass = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`rounded-full border-2 border-t-transparent ${sizeClass[size]} ${colorClass[color]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}

// Dancing dog animation (fun element mentioned in requirements)
export function DancingDog({ show = true }) {
  if (!show) return null

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 cursor-pointer"
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: [0, 10, -10, 10, 0] }}
      transition={{
        scale: { duration: 0.5 },
        rotate: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
      }}
      whileHover={{ scale: 1.2 }}
      title="Dancing dog!"
    >
      <img
        src="/placeholder.svg?height=60&width=60"
        alt="Dancing dog"
        className="rounded-full border-2 border-primary shadow-lg"
      />
    </motion.div>
  )
}

// File upload progress animation
export function FileUploadProgress({ progress, fileName }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium truncate">{fileName}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
