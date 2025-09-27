import { Timer, Users, Star } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"

import { useState, useEffect } from "react"
import { apiService } from "@/services/apiService"
import { useDialog } from "@/hooks/use-dialog"

const ConversionSection = () => {
  const defaultContent = {
    headline: "Join Thousands of Young Scholars",
    description: "Join the ranks of tomorrow's leaders. Register now and take the first step towards academic excellence.",
    urgencyStrip: {
      title: "Registration Closing Soon!",
      seatsRemaining: 2847,
      ctaLabel: "Secure Your Spot",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      isCountdownActive: true
    },
    cards: [
      {
        id: 1,
        value: "₦500K",
        label: "First Prize",
      },
      {
        id: 2,
        value: "₦250K",
        label: "Second Prize",
      },
      {
        id: 3,
        value: "₦100K",
        label: "Third Prize",
      },
      {
        id: 4,
        value: "₦50K",
        label: "Merit Prize",
      }
    ],
    cta: {
      primary: {
        label: "Register Now",
        action: "register_modal"
      },
      secondary: {
        label: "Learn More",
        action: "learn_more"
      }
    }
  }

  const [content, setContent] = useState(defaultContent)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!content.urgencyStrip.deadline || !content.urgencyStrip.isCountdownActive) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const now = new Date().getTime()
      // Convert MySQL datetime to JS Date by replacing space with T
      const deadline = new Date(content.urgencyStrip.deadline.replace(' ', 'T')).getTime()
      const distance = deadline - now

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    // Initial calculation
    calculateTimeLeft()
    
    // Update every second for smooth countdown
    const interval = setInterval(calculateTimeLeft, 1000)
    
    // Cleanup interval on unmount or when deadline/isCountdownActive changes
    return () => clearInterval(interval)
  }, [content.urgencyStrip.deadline, content.urgencyStrip.isCountdownActive])
  const { openDialog } = useDialog()

  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('Fetching conversion content...') // Debug log
        const data = await apiService.getHomepageContent('conversion')
        console.log('Received data:', data) // Log full response
        
        if (data && data.content) {
          let parsedContent
          try {
            parsedContent = typeof data.content === 'string' ? 
              JSON.parse(data.content) : data.content
            console.log('Parsed content:', parsedContent) // Log parsed content
          } catch (parseError) {
            console.error('Error parsing content:', parseError)
            console.log('Raw content that failed to parse:', data.content)
            return // Exit if we can't parse the content
          }

          // Create validated cards array
          const cards = Array(4).fill(null).map((_, index) => {
            const defaultCard = defaultContent.cards[index];
            const parsedCard = Array.isArray(parsedContent.cards) && parsedContent.cards[index];
            
            return {
              id: index + 1,
              value: parsedCard?.value || defaultCard.value,
              label: parsedCard?.label || defaultCard.label
            };
          });

          // Parse deadline ensuring proper format
          let deadline;
          try {
            deadline = parsedContent.urgencyStrip?.deadline ?
              // Handle MySQL datetime format
              new Date(parsedContent.urgencyStrip.deadline.replace(' ', 'T')) :
              new Date(defaultContent.urgencyStrip.deadline);
          } catch (e) {
            console.error('Error parsing deadline:', e);
            deadline = new Date(defaultContent.urgencyStrip.deadline);
          }

          // Create properly structured content
          const mergedContent = {
            headline: parsedContent.headline || defaultContent.headline,
            description: parsedContent.description || defaultContent.description,
            urgencyStrip: {
              title: parsedContent.urgencyStrip?.title || defaultContent.urgencyStrip.title,
              seatsRemaining: Number(parsedContent.urgencyStrip?.seatsRemaining) || 
                defaultContent.urgencyStrip.seatsRemaining,
              ctaLabel: parsedContent.urgencyStrip?.ctaLabel || defaultContent.urgencyStrip.ctaLabel,
              deadline: deadline.toISOString(),
              isCountdownActive: Boolean(parsedContent.urgencyStrip?.isCountdownActive)
            },
            cards: cards,
            cta: {
              primary: {
                label: parsedContent.cta?.primary?.label || defaultContent.cta.primary.label,
                action: (parsedContent.cta?.primary?.action === 'register_modal' ? 'register' : 'learn-more') as 'register' | 'learn-more'
              },
              secondary: {
                label: parsedContent.cta?.secondary?.label || defaultContent.cta.secondary.label,
                action: 'learn-more' as const
              }
            }
          }

          console.log('Setting new content:', mergedContent);
          setContent(mergedContent)
        }
      } catch (error) {
        console.error('Error loading conversion content:', error)
      }
    }

    // Initial load
    loadContent()

    // Set up polling every 30 seconds to check for updates
    const pollInterval = setInterval(loadContent, 30000)

    // Cleanup on unmount
    return () => clearInterval(pollInterval)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Registration Urgency Strip */}
        <div className="mb-16">
          <GlassCard className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Timer className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {content.urgencyStrip.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds > 0 
                      ? `Only ${timeLeft.days} days left` 
                      : 'Registration Closed'} 
                    {timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds > 0 && 
                      ` • ${content.urgencyStrip.seatsRemaining.toLocaleString()} seats remaining`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds > 0 ? (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{String(timeLeft.days).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">Days</div>
                    </div>
                    <div className="text-center relative">
                      <div className="text-2xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">Hours</div>
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-primary font-bold">:</div>
                    </div>
                    <div className="text-center relative">
                      <div className="text-2xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">Minutes</div>
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-primary font-bold">:</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">Seconds</div>
                    </div>
                    <GlassButton 
                      variant="accent" 
                      size="lg"
                      onClick={() => openDialog('register')}
                    >
                      Secure Your Spot
                    </GlassButton>
                  </>
                ) : (
                  <GlassButton 
                    variant="secondary" 
                    size="lg"
                    onClick={() => openDialog('learn-more')}
                  >
                    Learn More About Next Competition
                  </GlassButton>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Prize Information */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Win Amazing Prizes
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Compete for a chance to win cash prizes and recognition
          </p>
          
          {/* Prize Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {content.cards.map((card) => (
              <GlassCard 
                key={card.id} 
                className="text-center hover-glass transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  {card.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {card.label}
                </div>
              </GlassCard>
            ))}
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center">
          <GlassCard className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join the ranks of tomorrow's leaders. Register now and take the first step towards academic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton 
                variant="primary" 
                size="lg"
                onClick={() => openDialog(content.cta.primary.action === 'register_modal' ? 'register' : 'learn-more')}
              >
                <Users className="w-5 h-5" />
                {content.cta.primary.label}
              </GlassButton>
              <GlassButton 
                variant="secondary" 
                size="lg"
                onClick={() => openDialog('learn-more')}
              >
                {content.cta.secondary.label}
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

export default ConversionSection