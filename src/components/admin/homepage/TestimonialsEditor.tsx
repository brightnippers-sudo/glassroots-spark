import { useState, useEffect } from "react"
import { apiService } from "@/services/apiService"
import { Save, Plus, Trash2, Image } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState([])
  
  useEffect(() => {
    // Load testimonials when component mounts
    const loadTestimonials = async () => {
      try {
        const data = await apiService.getTestimonials();
        setTestimonials(data.map((t: any) => ({
          ...t,
          imageUrl: t.image_url,
          isFeatured: t.is_featured
        })));
      } catch (error) {
        console.error('Error loading testimonials:', error);
      }
    };
    
    loadTestimonials();
  }, [])

  const handleAddTestimonial = async () => {
    const newTestimonial = {
      name: "",
      role: "",
      quote: "",
      image_url: "",
      is_featured: false
    }
    try {
      const response = await apiService.addTestimonial(newTestimonial);
      setTestimonials([...testimonials, { 
        ...response.testimonial,
        imageUrl: response.testimonial.image_url,
        isFeatured: response.testimonial.is_featured
      }]);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Error adding testimonial. Please try again.');
    }
  }

  const handleDeleteTestimonial = async (id: number) => {
    try {
      await apiService.deleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
      alert('Testimonial deleted successfully!');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial. Please try again.');
    }
  }

  const handleUpdateTestimonial = async (id: number, field: string, value: any) => {
    try {
      const updatedTestimonials = testimonials.map(t => 
        t.id === id ? { ...t, [field]: value } : t
      );
      setTestimonials(updatedTestimonials);
      
      // Find the updated testimonial
      const testimonial = updatedTestimonials.find(t => t.id === id);
      if (testimonial) {
        await apiService.updateTestimonial(id, {
          name: testimonial.name,
          role: testimonial.role,
          quote: testimonial.quote,
          image_url: testimonial.imageUrl,
          is_featured: testimonial.isFeatured
        });
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      // Revert changes if update fails
      const loadTestimonials = async () => {
        const data = await apiService.getTestimonials();
        setTestimonials(data.map((t: any) => ({
          ...t,
          imageUrl: t.image_url,
          isFeatured: t.is_featured
        })));
      };
      loadTestimonials();
    }
  }

  const handleSave = async () => {
    try {
      // Save all testimonials
      await Promise.all(testimonials.map(testimonial => 
        apiService.updateTestimonial(testimonial.id, {
          name: testimonial.name,
          role: testimonial.role,
          quote: testimonial.quote,
          image_url: testimonial.imageUrl,
          is_featured: testimonial.isFeatured
        })
      ));
      alert('All testimonials saved successfully!');
    } catch (error) {
      console.error('Error saving testimonials:', error);
      alert('Error saving testimonials. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Testimonials Manager</h2>
        <div className="flex gap-2">
          <GlassButton variant="secondary" onClick={handleAddTestimonial}>
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </GlassButton>
          <GlassButton variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {testimonials.map((testimonial) => (
          <GlassCard key={testimonial.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  {testimonial.imageUrl ? (
                    <img 
                      src={testimonial.imageUrl} 
                      alt={testimonial.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Image className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Input
                    className="font-medium mb-1"
                    placeholder="Enter name"
                    value={testimonial.name}
                    onChange={(e) => handleUpdateTestimonial(testimonial.id, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Enter role/title"
                    value={testimonial.role}
                    onChange={(e) => handleUpdateTestimonial(testimonial.id, "role", e.target.value)}
                  />
                </div>
              </div>
              <GlassButton 
                variant="ghost" 
                onClick={() => handleDeleteTestimonial(testimonial.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </GlassButton>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Image URL</Label>
                <Input
                  placeholder="Enter image URL"
                  value={testimonial.imageUrl}
                  onChange={(e) => handleUpdateTestimonial(testimonial.id, "imageUrl", e.target.value)}
                />
              </div>

              <div>
                <Label>Testimonial Quote</Label>
                <Textarea
                  placeholder="Enter testimonial quote"
                  value={testimonial.quote}
                  onChange={(e) => handleUpdateTestimonial(testimonial.id, "quote", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={testimonial.isFeatured}
                  onCheckedChange={(checked) => handleUpdateTestimonial(testimonial.id, "isFeatured", checked)}
                />
                <Label>Feature on homepage</Label>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsEditor