import { Clock, Users, Trophy, MapPin } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"
import heroBackground from "@/assets/hero-background.jpg"

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(26, 101, 234, 0.9), rgba(251, 188, 5, 0.1)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Glass Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 glass rounded-full animate-glass-float opacity-30" />
        <div className="absolute bottom-20 right-10 w-48 h-48 glass rounded-full animate-glass-float opacity-20" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 glass rounded-full animate-glass-float opacity-25" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Competition Badge */}
          <div className="inline-flex items-center gap-2 glass-card border-white/20 text-white mb-8 px-4 py-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Next Competition — Stage One: SEMC — Mar 15, 2024 — Virtual
            </span>
          </div>

          {/* Hero Headlines */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Scholars Cambridge 
            <br />
            <span className="bg-gradient-to-r from-secondary-orange to-secondary-orange/80 bg-clip-text text-transparent">
              Competition
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            Inspire. Compete. Shine.
          </p>
          
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            A national-standard, grassroots-first competition series across Maths, Science & Coding.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <GlassButton variant="accent" size="lg" className="text-lg">
              Register Now
            </GlassButton>
            <GlassButton variant="hero" size="lg" className="text-lg">
              Practice Quizzes
            </GlassButton>
          </div>
        </div>

        {/* Live Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          <GlassCard className="text-center border-white/10 bg-white/5 backdrop-blur-md">
            <Users className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-bold text-white">25,000+</div>
            <div className="text-sm text-white/80">Participants</div>
          </GlassCard>
          
          <GlassCard className="text-center border-white/10 bg-white/5 backdrop-blur-md">
            <Trophy className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
            <div className="text-sm text-white/80">Schools</div>
          </GlassCard>
          
          <GlassCard className="text-center border-white/10 bg-white/5 backdrop-blur-md">
            <MapPin className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-bold text-white">36</div>
            <div className="text-sm text-white/80">States</div>
          </GlassCard>
          
          <GlassCard className="text-center border-white/10 bg-white/5 backdrop-blur-md">
            <Clock className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-bold text-white">8</div>
            <div className="text-sm text-white/80">Years Running</div>
          </GlassCard>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}

export default Hero