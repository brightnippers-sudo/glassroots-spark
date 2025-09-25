import { useState } from "react"
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
    headline: "Inspiring excellence across disciplines",
    subhead: "Join thousands of students in Nigeria's premier academic competition",
    primaryCTALabel: "Register Now",
    primaryCTAAction: "register_modal",
    secondaryCTALabel: "Practice Quizzes",
    secondaryCTAAction: "quiz_engine",
    selectedEvent: "maths-2025",
    seatsLeft: 1250,
    ctaOverride: "Limited Seats Available"
  })

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

  const handleSave = () => {
    console.log("Saving hero content:", { heroData, manifestoData })
    // Save logic here
  }

  const handlePublish = () => {
    console.log("Publishing hero content")
    // Publish logic with confirmation modal
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
                <Label htmlFor="subhead">Subheadline</Label>
                <Input
                  id="subhead"
                  value={heroData.subhead}
                  onChange={(e) => setHeroData({...heroData, subhead: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-cta">Primary CTA Label</Label>
                  <Input
                    id="primary-cta"
                    value={heroData.primaryCTALabel}
                    onChange={(e) => setHeroData({...heroData, primaryCTALabel: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="primary-action">Primary CTA Action</Label>
                  <Select
                    value={heroData.primaryCTAAction}
                    onValueChange={(value) => setHeroData({...heroData, primaryCTAAction: value})}
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
                    value={heroData.secondaryCTALabel}
                    onChange={(e) => setHeroData({...heroData, secondaryCTALabel: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-action">Secondary CTA Action</Label>
                  <Select
                    value={heroData.secondaryCTAAction}
                    onValueChange={(value) => setHeroData({...heroData, secondaryCTAAction: value})}
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

          {/* Competition Selector */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Next Competition</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="selected-event">Featured Event</Label>
                <Select
                  value={heroData.selectedEvent}
                  onValueChange={(value) => setHeroData({...heroData, selectedEvent: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title} - Closes {event.closeDate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seats-left">Seats Left</Label>
                  <Input
                    id="seats-left"
                    type="number"
                    value={heroData.seatsLeft}
                    onChange={(e) => setHeroData({...heroData, seatsLeft: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="cta-override">CTA Text Override</Label>
                  <Input
                    id="cta-override"
                    value={heroData.ctaOverride}
                    onChange={(e) => setHeroData({...heroData, ctaOverride: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Manifesto Editor */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Manifesto Editor</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured-manifesto"
                  checked={manifestoData.featured}
                  onCheckedChange={(checked) => setManifestoData({...manifestoData, featured: checked})}
                />
                <Label htmlFor="featured-manifesto">Show full manifesto on About page</Label>
              </div>
              
              <div>
                <Label htmlFor="manifesto-content">Manifesto Content</Label>
                <Textarea
                  id="manifesto-content"
                  value={manifestoData.content}
                  onChange={(e) => setManifestoData({...manifestoData, content: e.target.value})}
                  className="min-h-[200px]"
                  placeholder="Enter the full manifesto content..."
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            
            {/* Desktop Preview */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Desktop View</h3>
              <div className="bg-background border rounded-lg p-4 min-h-[300px]">
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold">{heroData.headline}</h1>
                  <p className="text-muted-foreground">{heroData.subhead}</p>
                  <div className="flex gap-4 justify-center">
                    <Button>{heroData.primaryCTALabel}</Button>
                    <Button variant="outline">{heroData.secondaryCTALabel}</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {heroData.ctaOverride} • {heroData.seatsLeft} seats left
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Mobile View</h3>
              <div className="bg-background border rounded-lg p-4 max-w-sm mx-auto min-h-[200px]">
                <div className="text-center space-y-3">
                  <h1 className="text-xl font-bold">{heroData.headline}</h1>
                  <p className="text-sm text-muted-foreground">{heroData.subhead}</p>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full">{heroData.primaryCTALabel}</Button>
                    <Button variant="outline" size="sm" className="w-full">{heroData.secondaryCTALabel}</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Preview */}
            <div>
              <h3 className="font-medium mb-2">Countdown Widget</h3>
              <div className="bg-accent/10 border rounded-lg p-3 text-center">
                <div className="text-sm font-medium">Registration closes in:</div>
                <div className="text-lg font-bold">14d 7h 23m 45s</div>
              </div>
            </div>
          </GlassCard>

          {/* Version History */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              <History className="w-5 h-5 inline mr-2" />
              Version History
            </h2>
            <div className="space-y-3">
              {[
                { version: "v1.4", date: "2025-01-15 14:30", author: "Admin", changes: "Updated hero CTA labels" },
                { version: "v1.3", date: "2025-01-14 09:15", author: "Admin", changes: "Changed featured event" },
                { version: "v1.2", date: "2025-01-13 16:45", author: "Admin", changes: "Updated manifesto content" }
              ].map((version, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                  <div>
                    <div className="font-medium">{version.version}</div>
                    <div className="text-sm text-muted-foreground">{version.changes}</div>
                    <div className="text-xs text-muted-foreground">{version.date} by {version.author}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Revert
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Accessibility Check */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              <Wand2 className="w-5 h-5 inline mr-2" />
              Accessibility Check
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Contrast Ratio</span>
                <span className="text-green-600 font-medium">4.8:1 ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mobile Legibility</span>
                <span className="text-green-600 font-medium">Pass ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CTA Visibility</span>
                <span className="text-green-600 font-medium">Good ✓</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default HeroContentEditor