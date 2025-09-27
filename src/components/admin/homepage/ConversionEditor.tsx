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
  headline: string
  description: string
  urgencyStrip: {
    title: string
    seatsRemaining: number
    ctaLabel: string
    deadline: string
    isCountdownActive: boolean
  }
  cards: Array<{
    id: number
    value: string
    label: string
  }>
  cta: {
    primary: {
      label: string
      action: string
    }
    secondary: {
      label: string
      action: string
    }
  }
}

const defaultContent: ContentState = {
  headline: "Win Amazing Prizes",
  description: "Compete for a chance to win cash prizes and recognition",
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
      action: "/about"
    }
  }
}

const ConversionEditor = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [content, setContent] = useState<ContentState>(defaultContent)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await apiService.getHomepageContent('conversion')
        
        if (data && data.content) {
          try {
            let parsedContent = typeof data.content === 'string' ? JSON.parse(data.content) : data.content
            console.log('Raw parsed content:', parsedContent)
            
            // Keep the MySQL datetime format
            const deadline = parsedContent.urgencyStrip?.deadline || 
              new Date().toISOString().slice(0, 19).replace('T', ' ')
            
            // Ensure the parsed content has all required fields with proper defaults
            const mergedContent = {
              ...defaultContent,
              ...parsedContent,
              urgencyStrip: {
                ...defaultContent.urgencyStrip,
                ...parsedContent.urgencyStrip,
                deadline: deadline, // Keep MySQL format
                seatsRemaining: Number(parsedContent.urgencyStrip?.seatsRemaining) || 
                  defaultContent.urgencyStrip.seatsRemaining,
                isCountdownActive: parsedContent.urgencyStrip?.isCountdownActive ?? 
                  defaultContent.urgencyStrip.isCountdownActive,
              },
              cards: (parsedContent.cards || []).map((card: any, index: number) => ({
                id: card.id || index + 1,
                value: card.value || defaultContent.cards[index]?.value || '',
                label: card.label || defaultContent.cards[index]?.label || '',
              })).slice(0, 4), // Ensure we only have 4 cards
              cta: {
                primary: {
                  ...defaultContent.cta.primary,
                  ...parsedContent.cta?.primary,
                },
                secondary: {
                  ...defaultContent.cta.secondary,
                  ...parsedContent.cta?.secondary,
                }
              }
            }
            console.log('Setting merged content:', mergedContent) // Debug log
            setContent(mergedContent)
          } catch (parseError) {
            console.error('Error parsing content:', parseError)
            console.log('Raw content:', data.content) // Debug log of raw content
            setContent(defaultContent) // Use default content if parsing fails
          }
        } else {
          console.log('No content found, using default') // Debug log
          setContent(defaultContent)
        }
      } catch (error) {
        console.error('Error loading conversion content:', error)
        setError('Failed to load content. Using default values.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadContent()
  }, [])

  const handleSave = async () => {
    if (isSaving) return
    
    try {
      setIsSaving(true)
      
      // Validate required fields
      if (!content.headline || !content.description) {
        alert('Please fill in the headline and description fields.')
        return
      }

      // Validate cards
      if (!content.cards.every(card => card.value && card.label)) {
        alert('Please fill in all prize values and labels.')
        return
      }

      // Validate CTAs
      if (!content.cta.primary.label || !content.cta.primary.action ||
          !content.cta.secondary.label || !content.cta.secondary.action) {
        alert('Please fill in all Call to Action fields.')
        return
      }

      // Ensure cards array is properly structured with exactly 4 valid cards
      const validatedCards = Array(4).fill(null).map((_, index) => {
        const currentCard = content.cards[index];
        const defaultCard = defaultContent.cards[index];
        return {
          id: index + 1,
          value: (currentCard && currentCard.value) || defaultCard.value,
          label: (currentCard && currentCard.label) || defaultCard.label,
        };
      });

      // Use the deadline directly as it's already in MySQL format
      const deadline = content.urgencyStrip.deadline || 
        new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Prepare data for saving with explicit structure
      const dataToSave = {
        headline: content.headline || defaultContent.headline,
        description: content.description || defaultContent.description,
        urgencyStrip: {
          title: content.urgencyStrip.title || defaultContent.urgencyStrip.title,
          seatsRemaining: Number(content.urgencyStrip.seatsRemaining),
          ctaLabel: content.urgencyStrip.ctaLabel || defaultContent.urgencyStrip.ctaLabel,
          deadline: deadline,
          isCountdownActive: Boolean(content.urgencyStrip.isCountdownActive)
        },
        cards: validatedCards,
        cta: {
          primary: {
            label: content.cta.primary.label || defaultContent.cta.primary.label,
            action: content.cta.primary.action || defaultContent.cta.primary.action
          },
          secondary: {
            label: content.cta.secondary.label || defaultContent.cta.secondary.label,
            action: content.cta.secondary.action || defaultContent.cta.secondary.action
          }
        }
      }

      // Save the content
      console.log('Saving data:', dataToSave)
      const saveResponse = await apiService.updateHomepageContent('conversion', {
        content: JSON.stringify(dataToSave),
        is_active: true
      })
      console.log('Save response:', saveResponse)

      if (!saveResponse.success) {
        throw new Error('Failed to save content')
      }

      // Show success message
      alert('Conversion section content updated successfully!')
      
      // Refresh the content to ensure we have the latest data
      console.log('Fetching updated data...')
      const updatedData = await apiService.getHomepageContent('conversion')
      console.log('Updated data received:', updatedData)
      if (updatedData && updatedData.content) {
        try {
          // Parse the content if it's a string
          let parsedContent = typeof updatedData.content === 'string' ? 
            JSON.parse(updatedData.content) : updatedData.content;

          console.log('Parsed refreshed content:', parsedContent);
          
          // Get the deadline in MySQL format
          const deadline = parsedContent.urgencyStrip?.deadline || 
            new Date().toISOString().slice(0, 19).replace('T', ' ');

          // Always start with the default cards
          const cards = defaultContent.cards.map((defaultCard, index) => ({
            id: index + 1,
            value: defaultCard.value,
            label: defaultCard.label
          }));

          // Only update cards if we have valid card data
          if (Array.isArray(parsedContent.cards) && parsedContent.cards.some(card => card !== null)) {
            const validCards = parsedContent.cards
              .filter((card: any) => card !== null && typeof card === 'object')
              .slice(0, 4);

            validCards.forEach((card: any, index: number) => {
              if (index < cards.length && card) {
                cards[index] = {
                  id: index + 1,
                  value: card.value || cards[index].value,
                  label: card.label || cards[index].label
                };
              }
            });
          }

          // Create a properly structured updated content object
          const updatedContentObject = {
            headline: parsedContent.headline || defaultContent.headline,
            description: parsedContent.description || defaultContent.description,
            urgencyStrip: {
              ...defaultContent.urgencyStrip,
              ...(parsedContent.urgencyStrip || {}),
              deadline: deadline.toISOString(),
              seatsRemaining: Number(parsedContent.urgencyStrip?.seatsRemaining) || 
                defaultContent.urgencyStrip.seatsRemaining,
              isCountdownActive: parsedContent.urgencyStrip?.isCountdownActive ?? 
                defaultContent.urgencyStrip.isCountdownActive,
            },
            cards: cards,
            cta: {
              primary: {
                ...defaultContent.cta.primary,
                ...(parsedContent.cta?.primary || {})
              },
              secondary: {
                ...defaultContent.cta.secondary,
                ...(parsedContent.cta?.secondary || {})
              }
            }
          };

          console.log('Setting content to:', updatedContentObject);
          setContent(updatedContentObject);
        } catch (error) {
          console.error('Error processing updated content:', error);
          alert('Error refreshing content. Please reload the page.');
        }
      }
    } catch (error) {
      console.error('Error saving conversion content:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Conversion Section Editor</h2>
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
          <h2 className="text-xl font-semibold">Conversion Section Editor</h2>
          <p className="text-sm text-muted-foreground">Edit the main conversion elements</p>
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
          <TabsTrigger value="main">Main Content</TabsTrigger>
          <TabsTrigger value="urgency">Urgency Strip</TabsTrigger>
          <TabsTrigger value="cta">Call to Action</TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <GlassCard className="p-6 space-y-4">
            <div>
              <Label>Main Headline</Label>
              <Input
                value={content.headline}
                onChange={(e) => setContent({...content, headline: e.target.value})}
                placeholder="Enter main headline"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description}
                onChange={(e) => setContent({...content, description: e.target.value})}
                placeholder="Enter description text"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">Prize Information</Label>
                <p className="text-sm text-muted-foreground mb-4">Configure the competition prizes</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {content.cards.map((card, index) => (
                  <GlassCard key={card.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                        index === 1 ? 'bg-gray-300/20 text-gray-400' :
                        index === 2 ? 'bg-amber-600/20 text-amber-600' :
                        'bg-purple-500/20 text-purple-500'
                      }`}>
                        {index + 1}
                      </div>
                      <Label className="text-base font-medium">
                        {index === 0 ? 'First Prize' :
                         index === 1 ? 'Second Prize' :
                         index === 2 ? 'Third Prize' :
                         'Merit Prize'}
                      </Label>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Prize Amount</Label>
                        <Input
                          value={card.value}
                          onChange={(e) => {
                            const newCards = [...content.cards]
                            newCards[index] = { ...card, value: e.target.value }
                            setContent({ ...content, cards: newCards })
                          }}
                          placeholder="Enter prize amount (e.g., ₦500K)"
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Prize Label</Label>
                        <Input
                          value={card.label}
                          onChange={(e) => {
                            const newCards = [...content.cards]
                            newCards[index] = { ...card, label: e.target.value }
                            setContent({ ...content, cards: newCards })
                          }}
                          placeholder={`Enter label (e.g., ${index === 0 ? 'First' : index === 1 ? 'Second' : index === 2 ? 'Third' : 'Merit'} Prize)`}
                        />
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="urgency">
          <GlassCard className="p-6 space-y-4">
            <div>
              <Label>Urgency Title</Label>
              <Input
                value={content.urgencyStrip.title}
                onChange={(e) => setContent({
                  ...content,
                  urgencyStrip: {...content.urgencyStrip, title: e.target.value}
                })}
                placeholder="Enter urgency strip title"
              />
            </div>
            
            <div>
              <Label>Registration Deadline</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="datetime-local"
                  value={content.urgencyStrip.deadline ? 
                    // Handle MySQL datetime format by replacing space with T
                    content.urgencyStrip.deadline.replace(' ', 'T').slice(0, 16) : 
                    ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      // Convert HTML datetime-local format to MySQL datetime format
                      const mysqlDateTime = e.target.value.replace('T', ' ') + ':00';
                      setContent({
                        ...content,
                        urgencyStrip: {
                          ...content.urgencyStrip,
                          deadline: mysqlDateTime
                        }
                      });
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.urgencyStrip.isCountdownActive}
                      onChange={(e) => setContent({
                        ...content,
                        urgencyStrip: {
                          ...content.urgencyStrip,
                          isCountdownActive: e.target.checked
                        }
                      })}
                      className="rounded border-input"
                    />
                    Show Countdown
                  </Label>
                </div>
              </div>
            </div>
            <div>
              <Label>Seats Remaining</Label>
              <Input
                type="number"
                value={content.urgencyStrip.seatsRemaining}
                onChange={(e) => setContent({
                  ...content,
                  urgencyStrip: {...content.urgencyStrip, seatsRemaining: parseInt(e.target.value)}
                })}
                placeholder="Enter number of seats remaining"
              />
            </div>
            <div>
              <Label>CTA Label</Label>
              <Input
                value={content.urgencyStrip.ctaLabel}
                onChange={(e) => setContent({
                  ...content,
                  urgencyStrip: {...content.urgencyStrip, ctaLabel: e.target.value}
                })}
                placeholder="Enter CTA button text"
              />
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="cta">
          <GlassCard className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary CTA Label</Label>
                <Input
                  value={content.cta.primary.label}
                  onChange={(e) => setContent({
                    ...content,
                    cta: {
                      ...content.cta,
                      primary: {...content.cta.primary, label: e.target.value}
                    }
                  })}
                  placeholder="Enter primary CTA text"
                />
              </div>
              <div>
                <Label>Primary CTA Action</Label>
                <Input
                  value={content.cta.primary.action}
                  onChange={(e) => setContent({
                    ...content,
                    cta: {
                      ...content.cta,
                      primary: {...content.cta.primary, action: e.target.value}
                    }
                  })}
                  placeholder="Enter action (e.g., register_modal)"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Secondary CTA Label</Label>
                <Input
                  value={content.cta.secondary.label}
                  onChange={(e) => setContent({
                    ...content,
                    cta: {
                      ...content.cta,
                      secondary: {...content.cta.secondary, label: e.target.value}
                    }
                  })}
                  placeholder="Enter secondary CTA text"
                />
              </div>
              <div>
                <Label>Secondary CTA Action</Label>
                <Input
                  value={content.cta.secondary.action}
                  onChange={(e) => setContent({
                    ...content,
                    cta: {
                      ...content.cta,
                      secondary: {...content.cta.secondary, action: e.target.value}
                    }
                  })}
                  placeholder="Enter action (e.g., /about)"
                />
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <GlassCard className="p-6">
        <h3 className="font-medium mb-4">Live Preview</h3>
        <div className="space-y-6">
          {content.urgencyStrip.isCountdownActive && (
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{content.urgencyStrip.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {content.urgencyStrip.seatsRemaining.toLocaleString()} seats remaining
                  </p>
                </div>
                <GlassButton variant="accent" size="sm">
                  {content.urgencyStrip.ctaLabel}
                </GlassButton>
              </div>
            </div>
          )}

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">{content.headline}</h2>
            <p className="text-lg text-muted-foreground">{content.description}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.cards.map((card, index) => (
              <GlassCard 
                key={card.id} 
                className={`p-4 text-center transition-all duration-300 hover:scale-105 ${
                  index === 0 ? 'bg-yellow-500/10 border-yellow-500/20' :
                  index === 1 ? 'bg-gray-300/10 border-gray-300/20' :
                  index === 2 ? 'bg-amber-600/10 border-amber-600/20' :
                  'bg-purple-500/10 border-purple-500/20'
                }`}
              >
                <div className="text-3xl font-bold mb-2">{card.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{card.label}</div>
              </GlassCard>
            ))}
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <GlassButton variant="primary" size="lg">
              {content.cta.primary.label}
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              {content.cta.secondary.label}
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default ConversionEditor
