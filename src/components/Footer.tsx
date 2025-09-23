import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"

const Footer = () => {
  const footerLinks = {
    competition: [
      { name: "How to Register", href: "#register" },
      { name: "Competition Rules", href: "#rules" },
      { name: "Practice Quizzes", href: "#practice" },
      { name: "Results & Leaderboards", href: "#results" },
    ],
    resources: [
      { name: "Study Materials", href: "#materials" },
      { name: "Teacher Guides", href: "#guides" },
      { name: "Past Questions", href: "#past-questions" },
      { name: "Success Stories", href: "#stories" },
    ],
    support: [
      { name: "Contact Us", href: "#contact" },
      { name: "FAQ", href: "#faq" },
      { name: "Technical Support", href: "#support" },
      { name: "Media Kit", href: "#media" },
    ],
    about: [
      { name: "Our Mission", href: "#mission" },
      { name: "Team", href: "#team" },
      { name: "Sponsors", href: "#sponsors" },
      { name: "Careers", href: "#careers" },
    ]
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Newsletter Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Get the latest competition updates, practice materials, and success stories delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-base bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <GlassButton variant="accent">
              Subscribe
            </GlassButton>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Scholars Cambridge</h2>
            <p className="text-primary-foreground/80 mb-6">
              Inspiring excellence in Maths, Science & Coding across Nigeria. Building tomorrow's leaders today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Competition Links */}
          <div>
            <h3 className="font-semibold mb-4">Competition</h3>
            <ul className="space-y-2">
              {footerLinks.competition.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-accent transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-accent transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-accent transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-accent transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-accent" />
            <div>
              <div className="font-medium">Email Us</div>
              <div className="text-primary-foreground/80">info@scholarscambridge.ng</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-accent" />
            <div>
              <div className="font-medium">Call Us</div>
              <div className="text-primary-foreground/80">+234 (0) 123 456 7890</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-accent" />
            <div>
              <div className="font-medium">Visit Us</div>
              <div className="text-primary-foreground/80">Lagos, Nigeria</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-primary-foreground/80">
              © {new Date().getFullYear()} Scholars Cambridge Competition. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer