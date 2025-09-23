import { Timer, Users, Star } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"

const ConversionSection = () => {
  // Mock testimonials data
  const testimonials = [
    {
      quote: "This competition opened doors I never knew existed. The experience was transformative.",
      name: "Adebayo Ogundimu",
      role: "2023 Gold Medalist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "The practice quizzes helped me excel not just in the competition but in my studies too.",
      name: "Fatima Abdullah", 
      role: "Regional Champion",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "Representing my school at the national level was a dream come true. Thank you SCMC!",
      name: "Chukwuemeka Okafor",
      role: "National Finalist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ]

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
                  <h3 className="text-xl font-semibold text-foreground">Registration Closing Soon!</h3>
                  <p className="text-muted-foreground">Only 72 hours left • 2,847 seats remaining</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">03</div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">14</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">27</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <GlassButton variant="accent" size="lg">
                  Secure Your Spot
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Trust & Social Proof */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Join Thousands of Young Scholars
          </h2>
          
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <GlassCard className="text-center hover-glass">
              <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
              <div className="text-muted-foreground">Total Participants</div>
            </GlassCard>
            <GlassCard className="text-center hover-glass">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Registered Schools</div>
            </GlassCard>
            <GlassCard className="text-center hover-glass">
              <div className="text-3xl font-bold text-primary mb-2">36</div>
              <div className="text-muted-foreground">States Covered</div>
            </GlassCard>
            <GlassCard className="text-center hover-glass">
              <div className="text-3xl font-bold text-primary mb-2">8</div>
              <div className="text-muted-foreground">Years of Excellence</div>
            </GlassCard>
          </div>

          {/* Testimonials Carousel */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <GlassCard 
                key={index} 
                className="text-center hover-glass"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
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
              <GlassButton variant="primary" size="lg">
                <Users className="w-5 h-5" />
                Register Now
              </GlassButton>
              <GlassButton variant="secondary" size="lg">
                Learn More
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

export default ConversionSection