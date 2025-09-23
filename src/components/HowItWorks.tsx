import { UserPlus, BookOpen, Trophy, ExternalLink } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Register",
      description: "Sign up for your preferred competition category. Choose from Maths, Science, or Coding across different grade levels.",
      cta: "Start Registration",
      color: "text-primary"
    },
    {
      icon: BookOpen,
      title: "Practice Quizzes",
      description: "Access our comprehensive quiz engine to practice and prepare. Build confidence with category-specific questions.",
      cta: "Practice Now",
      color: "text-accent"
    },
    {
      icon: Trophy,
      title: "Compete",
      description: "Participate in virtual competitions and showcase your skills. Progress through stages to reach the national finals.",
      cta: "View Schedule",
      color: "text-success"
    }
  ]

  const categories = [
    {
      title: "Lower Primary",
      description: "Grades 1-3",
      subjects: ["Basic Math", "Nature Science", "Logic Puzzles"]
    },
    {
      title: "Upper Primary", 
      description: "Grades 4-6",
      subjects: ["Mathematics", "Physical Science", "Intro to Coding"]
    },
    {
      title: "Lower Secondary",
      description: "JSS 1-3",
      subjects: ["Advanced Math", "Chemistry & Physics", "Programming"]
    },
    {
      title: "Upper Secondary",
      description: "SSS 1-3", 
      subjects: ["Calculus", "Advanced Sciences", "Software Development"]
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to academic excellence and national recognition
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <GlassCard key={index} className="text-center hover-glass relative">
              <GlassCardHeader>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 glass-card flex items-center justify-center">
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                </div>
                <GlassCardTitle className="text-xl">{step.title}</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-muted-foreground mb-6">
                  {step.description}
                </p>
                <GlassButton variant="secondary" size="sm">
                  {step.cta}
                </GlassButton>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>

        {/* Practice Categories */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Practice Area
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose your category and start practicing with our comprehensive quiz engine
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <GlassCard key={index} className="hover-glass group cursor-pointer">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center justify-between">
                  {category.title}
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </GlassCardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-2">
                  {category.subjects.map((subject, subIndex) => (
                    <div key={subIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {subject}
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <GlassCard className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Start Your Practice Journey
            </h3>
            <p className="text-muted-foreground mb-6">
              Access thousands of practice questions across all categories. Build your confidence before the competition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton variant="primary" size="lg">
                <BookOpen className="w-5 h-5" />
                Access Practice Quizzes
              </GlassButton>
              <GlassButton variant="secondary" size="lg">
                Download Study Guide
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks