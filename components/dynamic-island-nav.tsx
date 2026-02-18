"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Zap, Lock, CreditCard, Home } from "lucide-react"

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "features", label: "Features", icon: Shield },
  { id: "speed", label: "Speed", icon: Zap },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "pricing", label: "Pricing", icon: CreditCard },
]

export function DynamicIslandNav() {
  const [activeSection, setActiveSection] = useState<string>("home")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight

      // Detect the active section
      let currentSection: string = "home"
      for (const item of navItems) {
        if (item.id === "home") continue
        const el = document.getElementById(item.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.2) {
            currentSection = item.id
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = useCallback((id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [])

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
        className="pointer-events-auto"
      >
        {/* Outer glow */}
        <div className="absolute -inset-[2px] rounded-full bg-gradient-to-b from-white/5 to-white/[0.02] opacity-80 blur-sm" />

        {/* Glass container */}
        <div
          className="relative flex items-center gap-0 rounded-full border border-white/10 bg-black/20 backdrop-blur-3xl backdrop-saturate-200 px-2 py-2 shadow-2xl"
          style={{
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 40px rgba(255,255,255,0.02)",
          }}
        >
          {/* Nav items */}
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id
            const isHovered = hoveredItem === item.id
            const shouldExpand = isActive || isHovered
            const Icon = item.icon

            return (
              <div key={item.id} className="relative flex items-center">
                {/* Divider */}
                {index > 0 && (
                  <div className="h-6 w-[1px] bg-white/10 mx-1" />
                )}

                <button
                  onClick={() => scrollToSection(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative flex items-center justify-center rounded-full"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {/* Active/hover background */}
                  {shouldExpand && (
                    <motion.div
                      layoutId="island-active-bg"
                      className={`absolute inset-0 rounded-full ${
                        isActive
                          ? "bg-white/15 shadow-lg shadow-white/5"
                          : "bg-white/8"
                      }`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="island-active-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-white/90 shadow-lg shadow-white/50"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <motion.div
                    animate={{
                      width: shouldExpand ? "auto" : 40,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative flex items-center justify-center gap-2 h-10 px-3 overflow-hidden"
                  >
                    <Icon
                      className={`h-[18px] w-[18px] flex-shrink-0 transition-all duration-200 ${
                        isActive
                          ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                          : "text-white/50"
                      }`}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    {shouldExpand && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`text-sm font-medium whitespace-nowrap ${
                          isActive
                            ? "text-white"
                            : "text-white/70"
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.div>
                </button>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
