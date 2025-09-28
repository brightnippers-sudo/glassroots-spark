import { useState, useEffect } from "react"
import { apiService } from "@/services/apiService"
import { GlassCard } from "@/components/ui/glass-card"
import { Quote } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  imageUrl: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await apiService.getTestimonials()
        console.log('Raw testimonials response:', response)
        
        if (response.success) {
          // Convert object with numeric keys to array
          const testimonialsArray = Object.keys(response)
            .filter(key => !isNaN(Number(key)))
            .map(key => response[key])
            .filter(t => t.is_featured); // Only show featured testimonials
            
          console.log('Filtered testimonials array:', testimonialsArray)
          
          const formattedTestimonials = testimonialsArray.map((t: any) => ({
            id: t.id,
            name: t.name || '',
            role: t.role || '',
            quote: t.quote || '',
            imageUrl: t.image_url || '',
            isFeatured: Boolean(t.is_featured),
            createdAt: t.created_at || new Date().toISOString(),
            updatedAt: t.updated_at || new Date().toISOString()
          }));
          
          console.log('Formatted testimonials:', formattedTestimonials)
          setTestimonials(formattedTestimonials)
        }
      } catch (error) {
        console.error('Error loading testimonials:', error)
        setError('Failed to load testimonials')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTestimonials()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-accent/10 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <GlassCard key={i} className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-accent/10 rounded w-24"></div>
                      <div className="h-3 bg-accent/10 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-accent/10 rounded"></div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return null // Don't show the section if there's an error
  }

  if (testimonials.length === 0) {
    return null // Don't show the section if there are no testimonials
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-card-foreground mb-12">
          What Our Scholars Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <GlassCard 
              key={testimonial.id} 
              className="p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0">
                  {testimonial.imageUrl ? (
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Quote className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <blockquote className="text-muted-foreground italic">
                "{testimonial.quote}"
              </blockquote>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
