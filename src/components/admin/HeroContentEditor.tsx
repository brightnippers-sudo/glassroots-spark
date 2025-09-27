import { useState, useEffect } from "react"
import { apiService } from "@/services/apiService"
import { Save, Eye, History, Upload, Calendar, Wand2 } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const HeroContentEditor = () => {
  const [heroData, setHeroData] = useState({
    headline: "",
    subheadline: "",
    description: "",
    competition: {
      stage: "",
      date: "",
      location: ""
    },
    cta: {
      primary: {
        label: "",
        action: ""
      },
      secondary: {
        label: "",
        action: ""
      }
    },
    selectedEvent: "",
    seatsLeft: 0,
    registrationDeadline: "",
    ctaOverride: ""
  })

  useEffect(() => {
    // Load hero content when component mounts
    const loadHeroContent = async () => {
      try {
        const data = await apiService.getHeroContent();
        if (data && data.content) {
          setHeroData(JSON.parse(data.content));
        }
      } catch (error) {
        console.error('Error loading hero content:', error);
      }
    };
    
    loadHeroContent();
  }, [])

  const [manifestoData, setManifestoData] = useState({
    content: "We believe every child deserves the opportunity to excel...",
    featured: true
  })

  const events = [
    { id: "maths-2025", title: "Scholars Cambridge Maths 2025", closeDate: "2025-03-15", virtual: true },
    { id: "science-2025", title: "Scholars Cambridge Science 2025", closeDate: "2025-04-20", virtual: true },
    { id: "coding-2025", title: "Scholars Cambridge Coding 2025", closeDate: "2025-05-10", virtual: true }
  ]

  const ctaActions = [
    { value: "register_modal", label: "Open Registration Modal" },
    { value: "external_url", label: "External URL" },
    { value: "quiz_engine", label: "Quiz Engine Link" }
  ]

  const handleSave = async () => {
    try {
      await apiService.updateHeroContent(heroData);
      alert('Hero content saved as draft successfully!');
    } catch (error) {
      console.error('Error saving hero content:', error);
      alert('Error saving hero content. Please try again.');
    }
  }

  const handlePublish = async () => {
    try {
      await apiService.updateHeroContent({ ...heroData, is_active: true });
      alert('Hero content published successfully!');
    } catch (error) {
      console.error('Error publishing hero content:', error);
      alert('Error publishing hero content. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hero & Content Editor</h1>
          <p className="text-muted-foreground">Admin / Hero & Content Editor</p>
        </div>
        <div className="flex gap-2">
          <GlassButton variant="secondary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </GlassButton>
          <Dialog>
            <DialogTrigger asChild>
              <GlassButton variant="accent">
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </GlassButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publish Hero Content</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to publish these changes? This will update the live homepage.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handlePublish}>Publish</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Column */}
        <div className="space-y-6">
          {/* Hero Editor */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Hero Section Editor</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="headline">Hero Headline</Label>
                <Textarea
                  id="headline"
                  value={heroData.headline}
                  onChange={(e) => setHeroData({...heroData, headline: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="subheadline">Subheadline</Label>
                <Input
                  id="subheadline"
                  value={heroData.subheadline}
                  onChange={(e) => setHeroData({...heroData, subheadline: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={heroData.description}
                  onChange={(e) => setHeroData({...heroData, description: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="competition-stage">Competition Stage</Label>
                  <Input
                    id="competition-stage"
                    value={heroData.competition.stage}
                    onChange={(e) => setHeroData({
                      ...heroData, 
                      competition: {...heroData.competition, stage: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="competition-date">Competition Date</Label>
                  <Input
                    id="competition-date"
                    type="date"
                    value={heroData.competition.date}
                    onChange={(e) => setHeroData({
                      ...heroData, 
                      competition: {...heroData.competition, date: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="competition-location">Location</Label>
                  <Input
                    id="competition-location"
                    value={heroData.competition.location}
                    onChange={(e) => setHeroData({
                      ...heroData, 
                      competition: {...heroData.competition, location: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registration-deadline">Registration Deadline</Label>
                  <Input
                    id="registration-deadline"
                    type="datetime-local"
                    value={heroData.registrationDeadline?.slice(0, 16) || ''}
                    onChange={(e) => setHeroData({
                      ...heroData,
                      registrationDeadline: new Date(e.target.value).toISOString()
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="seats-left">Seats Left</Label>
                  <Input
                    id="seats-left"
                    type="number"
                    min="0"
                    value={heroData.seatsLeft}
                    onChange={(e) => setHeroData({
                      ...heroData,
                      seatsLeft: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-cta">Primary CTA Label</Label>
                  <Input
                    id="primary-cta"
                    value={heroData.cta.primary.label}
                    onChange={(e) => setHeroData({
                      ...heroData,
                      cta: {
                        ...heroData.cta,
                        primary: {...heroData.cta.primary, label: e.target.value}
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="primary-action">Primary CTA Action</Label>
                  <Select
                    value={heroData.cta.primary.action}
                    onValueChange={(value) => setHeroData({
                      ...heroData,
                      cta: {
                        ...heroData.cta,
                        primary: {...heroData.cta.primary, action: value}
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ctaActions.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="secondary-cta">Secondary CTA Label</Label>
                  <Input
                    id="secondary-cta"
                    value={heroData.cta.secondary.label}
                    onChange={(e) => setHeroData({
                      ...heroData,
                      cta: {
                        ...heroData.cta,
                        secondary: {...heroData.cta.secondary, label: e.target.value}
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-action">Secondary CTA Action</Label>
                  <Select
                    value={heroData.cta.secondary.action}
                    onValueChange={(value) => setHeroData({
                      ...heroData,
                      cta: {
                        ...heroData.cta,
                        secondary: {...heroData.cta.secondary, action: value}
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ctaActions.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Hero Illustration</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Upload new hero illustration</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default HeroContentEditor