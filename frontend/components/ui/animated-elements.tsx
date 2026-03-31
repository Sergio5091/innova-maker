"use client"

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// Animated Counter
export function AnimatedCounter({ 
  value, 
  suffix = "", 
  duration = 2 
}: { 
  value: number
  suffix?: string
  duration?: number 
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration })
      const unsubscribe = rounded.on("change", (v) => setDisplayValue(v))
      return () => {
        controls.stop()
        unsubscribe()
      }
    }
  }, [isInView, value, count, rounded, duration])

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  )
}

// Typing Text Effect
export function TypingText({ 
  texts, 
  className = "" 
}: { 
  texts: string[]
  className?: string 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex, texts])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Floating Particles
export function FloatingParticles({ count = 20, color = "primary" }: { count?: number; color?: string }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }))

  const colorClass = color === "primary" ? "bg-primary/30" : color === "blue" ? "bg-blue-500/30" : color === "emerald" ? "bg-emerald-500/30" : "bg-orange-500/30"

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${colorClass}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Code Rain Effect
export function CodeRain({ className = "" }: { className?: string }) {
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
  const columns = 15

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/20 text-xs font-mono whitespace-nowrap"
          style={{ left: `${(i / columns) * 100}%` }}
          initial={{ y: "-100%" }}
          animate={{ y: "100vh" }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          {Array.from({ length: 30 }).map((_, j) => (
            <div key={j}>{chars[Math.floor(Math.random() * chars.length)]}</div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

// Glowing Orb
export function GlowingOrb({ 
  size = "md", 
  color = "primary",
  className = "" 
}: { 
  size?: "sm" | "md" | "lg"
  color?: "primary" | "blue" | "emerald" | "orange"
  className?: string 
}) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
  }

  const colorClasses = {
    primary: "from-primary/40 to-primary/10",
    blue: "from-blue-500/40 to-blue-500/10",
    emerald: "from-emerald-500/40 to-emerald-500/10",
    orange: "from-orange-500/40 to-orange-500/10",
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} bg-gradient-radial ${colorClasses[color]} rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Data Stream Effect
export function DataStream({ className = "" }: { className?: string }) {
  const dataPoints = [
    "0x7F3A...9B2C",
    "128.45 kW/h",
    "CPU: 42%",
    "SYNC...",
    "0xFF21...D3E8",
    "DATA OK",
    "IoT-NODE-7",
    "24.6°C",
  ]

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {dataPoints.map((data, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/40 text-xs font-mono px-2 py-1 bg-primary/5 rounded border border-primary/10"
          style={{
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8],
            y: [0, -20],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        >
          {data}
        </motion.div>
      ))}
    </div>
  )
}

// Scanning Line
export function ScanningLine({ color = "primary" }: { color?: string }) {
  const colorClass = color === "primary" ? "from-transparent via-primary/50 to-transparent" : 
                     color === "blue" ? "from-transparent via-blue-500/50 to-transparent" : 
                     color === "emerald" ? "from-transparent via-emerald-500/50 to-transparent" : 
                     "from-transparent via-orange-500/50 to-transparent"

  return (
    <motion.div
      className={`absolute left-0 right-0 h-px bg-gradient-to-r ${colorClass}`}
      animate={{ top: ["0%", "100%"] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

// Circuit Lines
export function CircuitLines({ className = "" }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M10 10 L10 50 L50 50 M50 10 L50 30 L90 30 M10 90 L40 90 L40 70 L90 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/10"
          />
          <circle cx="10" cy="10" r="3" className="fill-primary/20" />
          <circle cx="50" cy="50" r="3" className="fill-primary/20" />
          <circle cx="90" cy="30" r="3" className="fill-primary/20" />
          <circle cx="90" cy="70" r="3" className="fill-primary/20" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
      
      {/* Animated pulse along circuit */}
      <motion.circle
        r="4"
        className="fill-primary"
        animate={{
          cx: [10, 10, 50, 50],
          cy: [10, 50, 50, 50],
          opacity: [1, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  )
}

// Pulse Ring
export function PulseRing({ 
  size = 200, 
  color = "primary",
  className = "" 
}: { 
  size?: number
  color?: string
  className?: string 
}) {
  const colorClass = color === "primary" ? "border-primary" : 
                     color === "blue" ? "border-blue-500" : 
                     color === "emerald" ? "border-emerald-500" : 
                     "border-orange-500"

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`absolute inset-0 rounded-full border-2 ${colorClass}`}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
