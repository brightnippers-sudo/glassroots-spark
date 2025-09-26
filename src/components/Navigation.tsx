import { useState } from "react"
import { Menu, X } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { cn } from "@/lib/utils"
import { useLocation } from "react-router-dom"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Competitions", href: "/competitions" },
    { name: "Resources", href: "/resources" },
    { name: "Results", href: "/results" },
    { name: "Schools", href: "/schools" },
    { name: "Club", href: "/club" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Media", href: "/media" },
  ]

  const isActivePage = (href: string) => {
    if (href === "/" && location.pathname === "/") return true
    if (href !== "/" && location.pathname.startsWith(href)) return true
    return false
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-secondary-orange">
              ScholarsNG
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "transition-colors duration-200 font-medium",
                    isActivePage(item.href)
                      ? "text-secondary-orange border-b-2 border-secondary-orange"
                      : "text-foreground hover:text-secondary-orange"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <GlassButton variant="ghost" size="sm" asChild>
              <a href="/login">Login</a>
            </GlassButton>
            <GlassButton variant="accent" size="sm" asChild>
              <a href="/register">Register Now</a>
            </GlassButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </GlassButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1 glass-card mt-4 mb-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 transition-colors duration-200 font-medium",
                  isActivePage(item.href)
                    ? "text-secondary-orange bg-secondary-orange/10 rounded-md"
                    : "text-foreground hover:text-secondary-orange"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <GlassButton variant="ghost" className="w-full" asChild>
                <a href="/login">Login</a>
              </GlassButton>
              <GlassButton variant="accent" className="w-full" asChild>
                <a href="/register">Register Now</a>
              </GlassButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation