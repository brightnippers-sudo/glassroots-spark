import { useState, useEffect } from "react"
import { apiService } from "@/services/apiService"
import { Save, Plus, Trash2, Image } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

const TestimonialsEditor = () => {
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
            .map(key => response[key]);
            
          console.log('Converted testimonials array:', testimonialsArray);
          
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
          
          console.log('Formatted testimonials:', formattedTestimonials);
          setTestimonials(formattedTestimonials);
        } else {
          console.error('Invalid testimonials response - missing success flag:', response);
          setError('Failed to load testimonials');
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
        setError('Failed to load testimonials. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTestimonials();
  }, [])

  const handleAddTestimonial = async () => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newTestimonial = {
      name: "",
      role: "",
      quote: "",
      image_url: "",
      is_featured: false,
      created_at: now,
      updated_at: now
    }
    try {
      const response = await apiService.addTestimonial(newTestimonial);
      console.log('Add testimonial response:', response);
      
      if (response.success && response.data) {
        const addedTestimonial: Testimonial = {
          id: response.data.id,
          name: response.data.name || '',
          role: response.data.role || '',
          quote: response.data.quote || '',
          imageUrl: response.data.image_url || '',
          isFeatured: Boolean(response.data.is_featured),
          createdAt: response.data.created_at || new Date().toISOString(),
          updatedAt: response.data.updated_at || new Date().toISOString()
        };
        
        console.log('Added testimonial:', addedTestimonial);
        setTestimonials([...testimonials, addedTestimonial]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Error adding testimonial. Please try again.');
    }
  }

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      const response = await apiService.deleteTestimonial(id);
      console.log('Delete response:', response);
      
      if (response.success) {
        setTestimonials(testimonials.filter(t => t.id !== id));
        alert('Testimonial deleted successfully!');
      } else {
        throw new Error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial. Please try again.');
    }
  }

  const handleUpdateTestimonial = async (id: number, field: string, value: any) => {
    try {
      // Optimistically update the UI
      const updatedTestimonials = testimonials.map(t => 
        t.id === id ? { ...t, [field]: value } : t
      );
      setTestimonials(updatedTestimonials);
      
      // Find the updated testimonial
      const testimonial = updatedTestimonials.find(t => t.id === id);
      if (testimonial) {
        console.log('Updating testimonial:', {
          id,
          testimonial: {
            name: testimonial.name,
            role: testimonial.role,
            quote: testimonial.quote,
            image_url: testimonial.imageUrl,
            is_featured: testimonial.isFeatured
          }
        });
        
        const response = await apiService.updateTestimonial(id, {
          name: testimonial.name,
          role: testimonial.role,
          quote: testimonial.quote,
          image_url: testimonial.imageUrl,
          is_featured: testimonial.isFeatured
        });
        
        console.log('Update response:', response);
        
        if (!response.success) {
          throw new Error('Failed to update testimonial');
        }
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      // Revert changes if update fails
      try {
        setIsLoading(true);
        const response = await apiService.getTestimonials();
        
        if (response.success) {
          // Convert object with numeric keys to array
          const testimonialsArray = Object.keys(response)
            .filter(key => !isNaN(Number(key)))
            .map(key => response[key]);
            
          console.log('Reloaded testimonials array:', testimonialsArray);
          
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
          
          console.log('Reloaded formatted testimonials:', formattedTestimonials);
          setTestimonials(formattedTestimonials);
        }
      } catch (reloadError) {
        console.error('Error reloading testimonials:', reloadError);
      } finally {
        setIsLoading(false);
      }
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Testimonials Manager</h2>
          <p className="text-sm text-muted-foreground">Loading testimonials...</p>
        </div>
        <GlassCard className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Testimonials Manager</h2>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
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

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={testimonial.isFeatured}
                    onCheckedChange={(checked) => handleUpdateTestimonial(testimonial.id, "isFeatured", checked)}
                  />
                  <Label>Feature on homepage</Label>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Created: {new Date(testimonial.createdAt).toLocaleString()}</p>
                  <p>Last updated: {new Date(testimonial.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsEditor