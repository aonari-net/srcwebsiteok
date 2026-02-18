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
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="relative"
      >
        {/* Outer glow - softer and more diffused */}
        <div className="absolute -inset-[2px] rounded-full bg-gradient-to-b from-white/5 to-white/[0.02] opacity-80 blur-sm" />

        {/* Glass container - more transparent and glassy */}
        <motion.div
          layout
          className="relative flex items-center gap-1 rounded-full border border-white/10 bg-black/20 backdrop-blur-3xl backdrop-saturate-200 px-3 py-2.5 shadow-2xl"
          style={{
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 40px rgba(255,255,255,0.02)",
          }}
        >
          {/* Nav items */}
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id
            const isHovered = hoveredItem === item.id
            const Icon = item.icon

            return (
              <motion.div key={item.id} className="relative">
                {/* Divider - except before first item */}
                {index > 0 && (
                  <motion.div
                    layout="position"
                    className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-6 w-[1px] bg-white/10"
                  />
                )}

                <motion.button
                  layout="position"
                  onClick={() => scrollToSection(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative flex items-center justify-center rounded-full transition-all duration-300"
                  aria-label={`Navigate to ${item.label}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active/hover background with glassmorphism */}
                  <AnimatePresence>
                    {(isActive || isHovered) && (
                      <motion.div
                        layoutId="island-active-bg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 rounded-full ${
                          isActive
                            ? "bg-white/15 shadow-lg shadow-white/5"
                            : "bg-white/8"
                        }`}
                        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Active indicator dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="island-active-dot"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-white/90 shadow-lg shadow-white/50"
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{
                      width: isActive || isHovered ? "auto" : 44,
                    }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                    className="relative flex items-center justify-center gap-2.5 h-11 px-3.5"
                  >
                    <Icon
                      className={`h-[18px] w-[18px] flex-shrink-0 transition-all duration-400 ${
                        isActive
                          ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                          : "text-white/50"
                      }`}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <AnimatePresence mode="popLayout">
                      {(isActive || isHovered) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                          className={`text-sm font-medium whitespace-nowrap overflow-hidden ${
                            isActive
                              ? "text-white"
                              : "text-white/70"
                          }`}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
