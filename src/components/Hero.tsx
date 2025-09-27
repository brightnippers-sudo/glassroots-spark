import { Clock, Users, Trophy, MapPin } from "lucide-react"
import CountdownTimer from "./CountdownTimer"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"
import heroBackground from "@/assets/hero-background.jpg"

import { useState, useEffect } from "react"
import { apiService } from "@/services/apiService"

interface Statistics {
  participants: number;
  schools: number;
  states: number;
  years: number;
}

const DEFAULT_STATS: Statistics = {
  participants: 25000,
  schools: 500,
  states: 36,
  years: 8
};

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    headline: "Scholars Cambridge Competition",
    subheadline: "Inspire. Compete. Shine.",
    description: "A national-standard, grassroots-first competition series across Maths, Science & Coding.",
    competition: {
      stage: "Stage One: SEMC",
      date: "Mar 15, 2024",
      location: "Virtual"
    },
    cta: {
      primary: {
        label: "Register Now",
        action: "/register"
      },
      secondary: {
        label: "Practice Quizzes",
        action: "/practice"
      }
    }
  })

  const [statistics, setStatistics] = useState<Statistics>(DEFAULT_STATS)

  useEffect(() => {
    async function loadContent() {
      try {
        const [heroData, statsData] = await Promise.all([
          apiService.getHeroContent(),
          apiService.getStatistics()
        ]);

        if (heroData?.content) {
          setHeroContent(JSON.parse(heroData.content));
        }

        if (statsData) {
          // Convert object with numeric keys to array
          const statsArray = statsData.success ? Object.values(statsData).filter(item => 
            typeof item === 'object' && item !== null && 'key_name' in item && 'value' in item
          ) : [];
          
          if (statsArray.length > 0) {
            const statsObj = statsArray.reduce<Statistics>((acc, curr) => {
              const item = curr as { key_name: keyof Statistics; value: string | number };
              if (Object.keys(DEFAULT_STATS).includes(item.key_name)) {
                acc[item.key_name] = Number(item.value);
              }
              return acc;
            }, { ...DEFAULT_STATS });
            
            console.log('Setting hero statistics:', statsObj);
            setStatistics(statsObj);
          } else {
            console.warn('No valid statistics found in response');
            setStatistics(DEFAULT_STATS);
          }
        }
      } catch (error) {
        console.error('Error loading hero content:', error);
        setStatistics(DEFAULT_STATS);
      }
    }
    
    void loadContent();
  }, []);

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
            <CountdownTimer date={heroContent.competition.date} />
            <span className="text-sm font-medium">
              Next Competition — {heroContent.competition.stage} — {heroContent.competition.location}
            </span>
          </div>

          {/* Hero Headlines */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {heroContent.headline.split(' ').map((word, i, arr) => 
              i === arr.length - 1 ? (
                <span key={i} className="bg-gradient-to-r from-secondary-orange to-secondary-orange/80 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                i === arr.length - 2 ? word + ' ' : word + ' '
              )
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            {heroContent.subheadline}
          </p>
          
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            {heroContent.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <GlassButton variant="accent" size="lg" className="text-lg" asChild>
              <a href={heroContent.cta.primary.action}>{heroContent.cta.primary.label}</a>
            </GlassButton>
            <GlassButton variant="hero" size="lg" className="text-lg" asChild>
              <a href={heroContent.cta.secondary.action}>{heroContent.cta.secondary.label}</a>
            </GlassButton>
          </div>
        </div>

        {/* Live Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          <GlassCard className="text-center border-white/10 bg-white/5 backdrop-blur-md">
            <Users className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-bold text-white">{statistics.participants.toLocaleString()}+</div>
            <div className="text-sm text-white/80">Participants</div>
          </GlassCard>
          
          <GlassCard className="text-center border-white/10 bg-white/5 backdrop-blur-md">
            <Trophy className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-bold text-white">{statistics.schools.toLocaleString()}+</div>
            <div className="text-sm text-white/80">Schools</div>
          </GlassCard>
          
          <GlassCard className="text-center border-white/10 bg-white/5 backdrop-blur-md">
            <MapPin className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-bold text-white">{statistics.states}</div>
            <div className="text-sm text-white/80">States</div>
          </GlassCard>
          
          <GlassCard className="text-center border-white/10 bg-white/5 backdrop-blur-md">
            <Clock className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-bold text-white">{statistics.years}</div>
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