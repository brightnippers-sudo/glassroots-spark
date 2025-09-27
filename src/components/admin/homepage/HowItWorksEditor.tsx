import { useState } from "react"
import { Save, Plus, Trash2, GripVertical } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const HowItWorksEditor = () => {
  const [steps, setSteps] = useState([
    {
      id: 1,
      icon: "UserPlus",
      title: "Register",
      description: "Sign up for your preferred competition category. Choose from Maths, Science, or Coding across different grade levels.",
      ctaLabel: "Start Registration",
      ctaAction: "register_modal"
    }
  ])

  const icons = [
    "UserPlus", "BookOpen", "Trophy", "Medal", "Star", 
    "CheckCircle", "Target", "Lightbulb", "Rocket"
  ]

  const ctaActions = [
    { value: "register_modal", label: "Registration Modal" },
    { value: "quiz_engine", label: "Quiz Engine" },
    { value: "schedule_view", label: "View Schedule" },
    { value: "learn_more", label: "Learn More" }
  ]

  const handleAddStep = () => {
    const newStep = {
      id: Date.now(),
      icon: "UserPlus",
      title: "",
      description: "",
      ctaLabel: "",
      ctaAction: "register_modal"
    }
    setSteps([...steps, newStep])
  }

  const handleDeleteStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id))
  }

  const handleUpdateStep = (id: number, field: string, value: any) => {
    setSteps(steps.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const handleSave = () => {
    // Will implement API call to save steps
    console.log("Saving how it works steps:", steps)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">How It Works Editor</h2>
        <div className="flex gap-2">
          <GlassButton variant="secondary" onClick={handleAddStep}>
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </GlassButton>
          <GlassButton variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {steps.map((step, index) => (
          <GlassCard key={step.id} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <GripVertical className="text-muted-foreground cursor-move" />
              <div className="text-lg font-medium">Step {index + 1}</div>
              <GlassButton 
                variant="ghost" 
                onClick={() => handleDeleteStep(step.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </GlassButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Icon</Label>
                <Select
                  value={step.icon}
                  onValueChange={(value) => handleUpdateStep(step.id, "icon", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {icons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Enter step title"
                  value={step.title}
                  onChange={(e) => handleUpdateStep(step.id, "title", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter step description"
                  value={step.description}
                  onChange={(e) => handleUpdateStep(step.id, "description", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>CTA Label</Label>
                <Input
                  placeholder="Enter CTA text"
                  value={step.ctaLabel}
                  onChange={(e) => handleUpdateStep(step.id, "ctaLabel", e.target.value)}
                />
              </div>

              <div>
                <Label>CTA Action</Label>
                <Select
                  value={step.ctaAction}
                  onValueChange={(value) => handleUpdateStep(step.id, "ctaAction", value)}
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
          </GlassCard>
        ))}
      </div>

      {/* Preview Section */}
      <GlassCard className="p-6">
        <h3 className="font-medium mb-4">Live Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={step.id} className="p-4 bg-accent/10 rounded-lg">
              <div className="text-primary mb-2">[{step.icon}]</div>
              <h4 className="font-medium mb-2">{step.title || "Step Title"}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {step.description || "Step description will appear here"}
              </p>
              <div className="text-sm text-primary">
                {step.ctaLabel || "CTA Button"}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default HowItWorksEditor