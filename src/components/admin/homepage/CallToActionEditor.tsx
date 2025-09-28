import { useState, useEffect } from "react"
import { apiService } from "@/services/apiService"
import { Save } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContentState {
  mainCta: {
    headline: string
    description: string
    primaryButton: {
      label: string
      action: string
    }
    secondaryButton: {
      label: string
      action: string
    }
  }
  practiceArea: {
    headline: string
    description: string
    ctaLabel: string
    ctaAction: string
  }
}

const defaultContent: ContentState = {
  mainCta: {
    headline: "Ready to Begin Your Journey?",
    description: "Join the ranks of tomorrow's leaders. Register now and take the first step towards academic excellence.",
    primaryButton: {
      label: "Register Now",
      action: "register_modal"
    },
    secondaryButton: {
      label: "Learn More",
      action: "/about"
    }
  },
  practiceArea: {
    headline: "Practice Area",
    description: "Prepare for the competition with our comprehensive practice materials and quizzes.",
    ctaLabel: "Start Your Practice Journey",
    ctaAction: "/practice"
  }
}

const CallToActionEditor = () => {
  const [content, setContent] = useState<ContentState>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await apiService.getHomepageContent('cta')
        console.log('Raw CTA response:', response)
        
        if (response.success && response.content) {
          let parsedContent = typeof response.content === 'string' ? 
            JSON.parse(response.content) : response.content;
            
          console.log('Parsed CTA content:', parsedContent)
          
          const mergedContent = {
            mainCta: {
              ...defaultContent.mainCta,
              ...parsedContent.mainCta,
            },
            practiceArea: {
              ...defaultContent.practiceArea,
              ...parsedContent.practiceArea,
            }
          }
          
          console.log('Setting CTA content:', mergedContent)
          setContent(mergedContent)
        }
      } catch (error) {
        console.error('Error loading CTA content:', error)
        setError('Failed to load content')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadContent()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      console.log('Saving CTA content:', content)
      const response = await apiService.updateHomepageContent('cta', {
        content: JSON.stringify(content)
      })
      
      if (response.success) {
        alert('Content updated successfully!')
      } else {
        throw new Error('Failed to update content')
      }
    } catch (error) {
      console.error('Error saving CTA content:', error)
      setError('Failed to save content')
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Call to Action Editor</h2>
            <p className="text-sm text-muted-foreground">Loading content...</p>
          </div>
        </div>
        <GlassCard className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Call to Action Editor</h2>
          <p className="text-sm text-muted-foreground">Edit the main call-to-action sections</p>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        <GlassButton 
          variant="primary" 
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </GlassButton>
      </div>

      <Tabs defaultValue="main">
        <TabsList>
          <TabsTrigger value="main">Main CTA</TabsTrigger>
          <TabsTrigger value="practice">Practice Area</TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <GlassCard className="p-6 space-y-4">
            <div>
              <Label>Headline</Label>
              <Input
                value={content.mainCta.headline}
                onChange={(e) => setContent({
                  ...content,
                  mainCta: { ...content.mainCta, headline: e.target.value }
                })}
                placeholder="Enter main headline"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.mainCta.description}
                onChange={(e) => setContent({
                  ...content,
                  mainCta: { ...content.mainCta, description: e.target.value }
                })}
                placeholder="Enter description text"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Button Label</Label>
                <Input
                  value={content.mainCta.primaryButton.label}
                  onChange={(e) => setContent({
                    ...content,
                    mainCta: {
                      ...content.mainCta,
                      primaryButton: { ...content.mainCta.primaryButton, label: e.target.value }
                    }
                  })}
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <Label>Primary Button Action</Label>
                <Input
                  value={content.mainCta.primaryButton.action}
                  onChange={(e) => setContent({
                    ...content,
                    mainCta: {
                      ...content.mainCta,
                      primaryButton: { ...content.mainCta.primaryButton, action: e.target.value }
                    }
                  })}
                  placeholder="Enter action (e.g., register_modal)"
                />
              </div>
              <div>
                <Label>Secondary Button Label</Label>
                <Input
                  value={content.mainCta.secondaryButton.label}
                  onChange={(e) => setContent({
                    ...content,
                    mainCta: {
                      ...content.mainCta,
                      secondaryButton: { ...content.mainCta.secondaryButton, label: e.target.value }
                    }
                  })}
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <Label>Secondary Button Action</Label>
                <Input
                  value={content.mainCta.secondaryButton.action}
                  onChange={(e) => setContent({
                    ...content,
                    mainCta: {
                      ...content.mainCta,
                      secondaryButton: { ...content.mainCta.secondaryButton, action: e.target.value }
                    }
                  })}
                  placeholder="Enter action (e.g., /about)"
                />
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="practice">
          <GlassCard className="p-6 space-y-4">
            <div>
              <Label>Section Headline</Label>
              <Input
                value={content.practiceArea.headline}
                onChange={(e) => setContent({
                  ...content,
                  practiceArea: { ...content.practiceArea, headline: e.target.value }
                })}
                placeholder="Enter section headline"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.practiceArea.description}
                onChange={(e) => setContent({
                  ...content,
                  practiceArea: { ...content.practiceArea, description: e.target.value }
                })}
                placeholder="Enter description text"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTA Button Label</Label>
                <Input
                  value={content.practiceArea.ctaLabel}
                  onChange={(e) => setContent({
                    ...content,
                    practiceArea: { ...content.practiceArea, ctaLabel: e.target.value }
                  })}
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <Label>CTA Button Action</Label>
                <Input
                  value={content.practiceArea.ctaAction}
                  onChange={(e) => setContent({
                    ...content,
                    practiceArea: { ...content.practiceArea, ctaAction: e.target.value }
                  })}
                  placeholder="Enter action (e.g., /practice)"
                />
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <GlassCard className="p-6">
        <h3 className="font-medium mb-4">Live Preview</h3>
        <div className="space-y-8">
          <div className="max-w-2xl mx-auto text-center p-6 bg-primary/5 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">{content.mainCta.headline}</h3>
            <p className="text-muted-foreground mb-6">{content.mainCta.description}</p>
            <div className="flex gap-4 justify-center">
              <GlassButton variant="primary">{content.mainCta.primaryButton.label}</GlassButton>
              <GlassButton variant="secondary">{content.mainCta.secondaryButton.label}</GlassButton>
            </div>
          </div>

          <div className="max-w-2xl mx-auto text-center p-6 bg-accent/5 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">{content.practiceArea.headline}</h3>
            <p className="text-muted-foreground mb-6">{content.practiceArea.description}</p>
            <GlassButton variant="accent">{content.practiceArea.ctaLabel}</GlassButton>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default CallToActionEditor
