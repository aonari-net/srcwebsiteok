"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Zap, Lock, CreditCard, ChevronUp } from "lucide-react"

const navItems = [
  { id: "features", label: "Features", icon: Shield },
  { id: "speed", label: "Speed", icon: Zap },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "pricing", label: "Pricing", icon: CreditCard },
]

export function DynamicIslandNav() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Show the island after scrolling past the hero
      setIsVisible(scrollY > windowHeight * 0.5)

      // Detect the active section
      let currentSection: string | null = null
      for (const item of navItems) {
        const el = document.getElementById(item.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.3) {
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
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setIsExpanded(false)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setIsExpanded(false)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.div
            layout
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Outer glow */}
            <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-b from-[hsl(0_0%_30%)] to-[hsl(0_0%_12%)] opacity-60" />

            {/* Glass container */}
            <motion.div
              layout
              className="relative flex items-center gap-1 rounded-[27px] border border-[hsl(0_0%_20%)]/50 bg-[hsl(0_0%_6%)]/70 backdrop-blur-2xl backdrop-saturate-150 px-2 py-2"
              style={{
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Back to top button */}
              <motion.button
                layout="position"
                onClick={scrollToTop}
                className="relative flex items-center justify-center h-10 w-10 rounded-[20px] text-[hsl(0_0%_55%)] transition-colors duration-300 hover:text-[hsl(0_0%_95%)]"
                aria-label="Back to top"
              >
                <ChevronUp className="h-4 w-4" />
              </motion.button>

              {/* Divider */}
              <motion.div
                layout="position"
                className="h-5 w-[1px] bg-[hsl(0_0%_20%)]/60 mx-0.5"
              />

              {/* Nav items */}
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                const isHovered = hoveredItem === item.id
                const Icon = item.icon

                return (
                  <motion.button
                    key={item.id}
                    layout="position"
                    onClick={() => scrollToSection(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative flex items-center justify-center rounded-[20px] transition-colors duration-300"
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {/* Active/hover background */}
                    {(isActive || isHovered) && (
                      <motion.div
                        layoutId="island-active-bg"
                        className={`absolute inset-0 rounded-[20px] ${
                          isActive
                            ? "bg-[hsl(0_0%_100%)]/10"
                            : "bg-[hsl(0_0%_100%)]/5"
                        }`}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}

                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        layoutId="island-active-dot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-[hsl(0_0%_95%)]"
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <motion.div
                      animate={{
                        width: isActive || isHovered ? "auto" : 40,
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="relative flex items-center justify-center gap-2 h-10 px-3"
                    >
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${
                          isActive
                            ? "text-[hsl(0_0%_95%)]"
                            : "text-[hsl(0_0%_45%)]"
                        }`}
                        strokeWidth={1.5}
                      />
                      <AnimatePresence mode="popLayout">
                        {(isActive || isHovered) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-xs font-medium whitespace-nowrap overflow-hidden ${
                              isActive
                                ? "text-[hsl(0_0%_95%)]"
                                : "text-[hsl(0_0%_65%)]"
                            }`}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.button>
                )
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
