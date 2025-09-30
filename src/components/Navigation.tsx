import { useState, useRef, useEffect } from "react"
import { Menu, X, ChevronDown, User, MoreHorizontal } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { cn } from "@/lib/utils"
import { useLocation } from "react-router-dom"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoggedIn] = useState(false) // TODO: Replace with actual auth state
  const location = useLocation()
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Menu structure with dropdowns
  const menuStructure = {
    primary: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Competitions", href: "/competitions" },
    ],
    dropdowns: {
      "Resources": {
        items: [
          { name: "Resources", href: "/resources", description: "Study materials and guides" },
          { name: "Results", href: "/results", description: "Competition results and rankings" },
          { name: "Media", href: "/media", description: "Photos, videos, and press" },
          { name: "Blog", href: "/blog", description: "Latest news and insights" },
        ]
      },
      "Schools & Clubs": {
        items: [
          { name: "Schools", href: "/schools", description: "School directory and registration" },
          { name: "Club", href: "/club", description: "Smarter Than 20 Club" },
        ]
      },
      "Login": {
        items: isLoggedIn ? [
          { name: "Participant Dashboard", href: "/dashboard", description: "Your personal dashboard" },
          { name: "Coach Dashboard", href: "/coach", description: "Manage your participants" },
          { name: "Sponsor Dashboard", href: "/sponsor", description: "Track your impact" },
          { name: "Logout", href: "/logout", description: "Sign out of your account" },
        ] : [
          { name: "Login", href: "/login", description: "Sign up or Sign into your account" },
          { name: "Register", href: "/register", description: "Register for a Competition" },
        ]
      }
    },
    standalone: [
      { name: "Sponsors", href: "/sponsors" },
    ]
  }

  const isActivePage = (href: string) => {
    if (href === "/" && location.pathname === "/") return true
    if (href !== "/" && location.pathname.startsWith(href)) return true
    return false
  }

  const isActiveDropdown = (dropdownName: string) => {
    const items = menuStructure.dropdowns[dropdownName as keyof typeof menuStructure.dropdowns]?.items || []
    return items.some(item => isActivePage(item.href))
  }

  const handleDropdownEnter = (dropdown: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenDropdown(dropdown)
  }

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  const handleDropdownClick = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold text-secondary-orange hover:text-secondary-orange/80 transition-colors">
              ScholarsNG
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8">
              {/* Primary items */}
              {menuStructure.primary.map((item) => (
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

              {/* Dropdown items */}
              {Object.entries(menuStructure.dropdowns).map(([dropdownName, dropdown]) => (
                <div
                  key={dropdownName}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(dropdownName)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => handleDropdownClick(dropdownName)}
                    className={cn(
                      "flex items-center gap-1 transition-colors duration-200 font-medium",
                      isActiveDropdown(dropdownName) || openDropdown === dropdownName
                        ? "text-secondary-orange"
                        : "text-foreground hover:text-secondary-orange"
                    )}
                    aria-expanded={openDropdown === dropdownName}
                    aria-haspopup="true"
                  >
                    {dropdownName === "Login" && isLoggedIn ? (
                      <User className="w-4 h-4" />
                    ) : (
                      dropdownName
                    )}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      openDropdown === dropdownName && "rotate-180"
                    )} />
                  </button>

                  {/* Dropdown menu */}
                  <div className={cn(
                    "absolute top-full left-0 mt-2 w-80 glass-card border border-white/10 rounded-base opacity-0 invisible transform translate-y-2 transition-all duration-200",
                    openDropdown === dropdownName && "opacity-100 visible translate-y-0"
                  )}>
                    <div className="p-2">
                      {dropdown.items.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "block px-4 py-3 rounded-base transition-colors duration-200",
                            isActivePage(item.href)
                              ? "bg-secondary-orange/20 text-secondary-orange"
                              : "text-foreground hover:bg-white/5 hover:text-secondary-orange"
                          )}
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Standalone items */}
              {menuStructure.standalone.map((item) => (
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

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-6">
            {menuStructure.primary.slice(0, 2).map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors duration-200 font-medium",
                  isActivePage(item.href)
                    ? "text-secondary-orange"
                    : "text-foreground hover:text-secondary-orange"
                )}
              >
                {item.name}
              </a>
            ))}
            
            <div className="relative">
              <button
                onClick={() => handleDropdownClick("more")}
                className="flex items-center gap-1 text-foreground hover:text-secondary-orange transition-colors duration-200 font-medium"
                aria-expanded={openDropdown === "more"}
              >
                <MoreHorizontal className="w-4 h-4" />
                More
              </button>
              
              {openDropdown === "more" && (
                <div className="absolute top-full right-0 mt-2 w-72 glass-card border border-white/10 rounded-base">
                  <div className="p-2">
                    {[...menuStructure.primary.slice(2), ...menuStructure.standalone].map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "block px-4 py-2 rounded-base transition-colors duration-200",
                          isActivePage(item.href)
                            ? "bg-secondary-orange/20 text-secondary-orange"
                            : "text-foreground hover:bg-white/5 hover:text-secondary-orange"
                        )}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {!isLoggedIn && (
              <GlassButton variant="accent" size="sm" asChild>
                <a href="/register">Register Now</a>
              </GlassButton>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X /> : <Menu />}
            </GlassButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1 glass-card mt-4 mb-4">
            {/* Primary links */}
            <div className="space-y-1">
              {menuStructure.primary.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 transition-colors duration-200 font-medium rounded-base",
                    isActivePage(item.href)
                      ? "text-secondary-orange bg-secondary-orange/10"
                      : "text-foreground hover:text-secondary-orange hover:bg-white/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Dropdown sections */}
            {Object.entries(menuStructure.dropdowns).map(([dropdownName, dropdown]) => (
              <div key={dropdownName} className="border-t border-white/10 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                  {dropdownName}
                </div>
                {dropdown.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block px-6 py-2 transition-colors duration-200 rounded-base",
                      isActivePage(item.href)
                        ? "text-secondary-orange bg-secondary-orange/10"
                        : "text-foreground hover:text-secondary-orange hover:bg-white/5"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            ))}

            {/* Standalone items */}
            <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
              {menuStructure.standalone.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 transition-colors duration-200 font-medium rounded-base",
                    isActivePage(item.href)
                      ? "text-secondary-orange bg-secondary-orange/10"
                      : "text-foreground hover:text-secondary-orange hover:bg-white/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="pt-4 space-y-2">
              {!isLoggedIn && (
                <GlassButton variant="accent" className="w-full" asChild>
                  <a href="/register">Register Now</a>
                </GlassButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation