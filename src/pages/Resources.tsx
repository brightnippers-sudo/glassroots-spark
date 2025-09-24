import { ExternalLink, Download, BookOpen, HelpCircle } from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

const Resources = () => {
  const quizCategories = [
    {
      title: "Lower Primary",
      description: "Ages 6-9 • Basic concepts and foundations",
      url: "#",
      color: "from-primary/20 to-primary/10"
    },
    {
      title: "Upper Primary", 
      description: "Ages 10-12 • Intermediate problem solving",
      url: "#",
      color: "from-secondary-orange/20 to-secondary-orange/10"
    },
    {
      title: "Lower Secondary",
      description: "Ages 13-15 • Advanced mathematical thinking", 
      url: "#",
      color: "from-accent/20 to-accent/10"
    },
    {
      title: "Upper Secondary",
      description: "Ages 16-18 • Competition-level challenges",
      url: "#", 
      color: "from-success/20 to-success/10"
    }
  ];

  const resources = [
    {
      title: "Competition Brochure 2024",
      description: "Complete guide to all competitions and categories",
      type: "PDF",
      size: "2.4 MB"
    },
    {
      title: "Teacher Preparation Guide", 
      description: "How to prepare students for competitions",
      type: "PDF",
      size: "1.8 MB"
    },
    {
      title: "Competition Rules & Regulations",
      description: "Official rules and scoring criteria",
      type: "PDF", 
      size: "956 KB"
    }
  ];

  const faqs = [
    {
      question: "How do I prepare for the competition?",
      answer: "Start with practice quizzes in your category, review the syllabus, and use our teacher guides."
    },
    {
      question: "What topics are covered?",
      answer: "Each category covers age-appropriate curriculum topics. Download the brochure for detailed syllabi."
    },
    {
      question: "Can I practice multiple times?",
      answer: "Yes! Our quiz engine allows unlimited practice sessions to help you prepare."
    },
    {
      question: "Are there sample questions available?",
      answer: "Practice quizzes contain sample questions similar to the actual competition format."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Resources & Preparation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Everything you need to excel in our competitions - practice quizzes, guides, and preparation materials.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlassButton size="lg" variant="primary">
              <ExternalLink className="w-5 h-5" />
              Practice Quizzes
            </GlassButton>
            <GlassButton size="lg" variant="secondary">
              <Download className="w-5 h-5" />
              Download Competition Brochure
            </GlassButton>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        {/* Practice Quizzes */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Practice Quizzes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sharpen your skills with our interactive quiz engine. Choose your category and start practicing today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizCategories.map((category, index) => (
              <GlassCard key={index} className="group hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className={`h-2 bg-gradient-to-r ${category.color} rounded-t-base`} />
                <GlassCardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <GlassButton variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
                    <ExternalLink className="w-4 h-4" />
                    Start Practice
                  </GlassButton>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Teacher Guides & Brochures */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Teacher Guides & Brochures</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive resources for educators and students to excel in our competitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <GlassCard key={index} className="group hover:scale-105 transition-all duration-300">
                <GlassCardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="glass-card p-3 rounded-base">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {resource.type} • {resource.size}
                        </div>
                        <GlassButton variant="ghost" size="sm" className="group-hover:bg-primary/10">
                          <Download className="w-4 h-4" />
                          Download
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* FAQ & How to Prepare */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">FAQ & How to Prepare</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions and essential tips for competition success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <GlassCard key={index}>
                <GlassCardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="glass-card p-2 rounded-base mt-1">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Preparation Tips */}
        <section>
          <GlassCard className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-6">Essential Preparation Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">1. Start Early</h3>
                  <p className="text-sm text-muted-foreground">Begin preparation at least 2-3 months before the competition date for optimal results.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">2. Practice Regularly</h3>
                  <p className="text-sm text-muted-foreground">Use our quiz engine daily to build confidence and identify areas for improvement.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">3. Review Guidelines</h3>
                  <p className="text-sm text-muted-foreground">Download and thoroughly read the competition rules and syllabus before competing.</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

export default Resources;