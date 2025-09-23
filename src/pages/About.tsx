import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Users, Target, Award, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Adebayo",
      role: "Founder & Executive Director",
      bio: "20+ years in educational development, former Cambridge examiner",
      image: "/placeholder.svg"
    },
    {
      name: "Prof. Michael Chen",
      role: "Academic Director",
      bio: "Mathematics education specialist, curriculum development expert",
      image: "/placeholder.svg"
    },
    {
      name: "Mrs. Folake Ogundimu",
      role: "Operations Manager",
      bio: "Educational logistics coordinator, school partnership specialist",
      image: "/placeholder.svg"
    }
  ];

  const milestones = [
    { year: "2016", event: "SCMC Founded", description: "First competition with 500 participants" },
    { year: "2018", event: "National Expansion", description: "Reached all 36 states + FCT" },
    { year: "2020", event: "Virtual Pivot", description: "Seamless transition to online competitions" },
    { year: "2022", event: "25,000+ Participants", description: "Largest grassroots STEM competition in Nigeria" },
    { year: "2024", event: "International Recognition", description: "Partnership with Cambridge Assessment" }
  ];

  const engagementOptions = [
    {
      title: "For Students",
      description: "Register individually or through your school",
      icon: Users,
      actions: ["Practice quizzes", "Join competitions", "Earn certificates"]
    },
    {
      title: "For Coaches",
      description: "Guide and mentor competition participants",
      icon: Target,
      actions: ["Apply as coach", "Access training materials", "Track student progress"]
    },
    {
      title: "For Schools",
      description: "Register multiple students and track performance",
      icon: Award,
      actions: ["Bulk registration", "School dashboard", "Performance analytics"]
    },
    {
      title: "For Sponsors",
      description: "Partner with us to impact education",
      icon: Globe,
      actions: ["Sponsor competitions", "School activations", "Brand visibility"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Inspiring excellence across disciplines
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Empowering the next generation of thinkers through world-class competition standards and grassroots accessibility.
          </p>
          <div className="flex gap-4 justify-center">
            <GlassButton variant="primary" size="lg">
              Join Our Mission
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              Read Full Manifesto
            </GlassButton>
          </div>
        </div>
      </section>

      {/* Vision Manifesto */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Vision Manifesto</h2>
              
              <blockquote className="text-xl italic text-primary border-l-4 border-primary pl-6 my-8">
                "Every child deserves access to world-class educational opportunities, regardless of their background or location."
              </blockquote>
              
              <div className="text-foreground space-y-6 leading-relaxed">
                <p>
                  The Scholars Cambridge Mathematics Competition (SCMC) was born from a simple yet powerful belief: 
                  that academic excellence should not be confined to elite institutions or urban centers. We envision 
                  a Nigeria where every student, from the bustling streets of Lagos to the quiet villages of Kebbi, 
                  has access to internationally standardized competitions that challenge, inspire, and elevate their potential.
                </p>
                
                <p>
                  Our grassroots approach combines rigorous academic standards with inclusive accessibility. We don't 
                  just organize competitions; we build ecosystems of learning that connect students, teachers, schools, 
                  and communities in a shared pursuit of excellence. Through mathematics, science, and coding challenges, 
                  we prepare young minds for the complexities of tomorrow's world.
                </p>
                
                <p>
                  Since 2016, we have grown from a small initiative to Nigeria's largest grassroots STEM competition, 
                  reaching over 25,000 students across all 36 states and the Federal Capital Territory. Our virtual-first 
                  approach ensures that geography is no barrier to participation, while our partnership network provides 
                  ongoing support for continuous learning.
                </p>
                
                <p>
                  We measure success not just in correct answers, but in the confidence gained, the curiosity sparked, 
                  and the dreams unleashed. Every certificate awarded represents a step toward educational equity. 
                  Every competition strengthens the foundation of Nigeria's intellectual future.
                </p>
              </div>
              
              <div className="mt-12 text-center">
                <GlassButton variant="accent" size="lg">
                  Download Full Manifesto (PDF)
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Team & Organizers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Team & Organizers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/30"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <GlassCard className="p-6">
                      <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{milestone.event}</h3>
                      <p className="text-muted-foreground text-sm">{milestone.description}</p>
                    </GlassCard>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Engage */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Ways to Engage</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementOptions.map((option, index) => (
              <GlassCard key={index} className="p-6">
                <GlassCardHeader>
                  <option.icon className="w-8 h-8 text-primary mb-3" />
                  <GlassCardTitle className="text-lg">{option.title}</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-muted-foreground text-sm mb-4">{option.description}</p>
                  <ul className="space-y-2">
                    {option.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="text-sm text-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {action}
                      </li>
                    ))}
                  </ul>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Make an Impact?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students, educators, and organizations already part of the SCMC community.
            </p>
            <div className="flex gap-4 justify-center">
              <GlassButton variant="primary" size="lg">
                Register Your School
              </GlassButton>
              <GlassButton variant="accent" size="lg">
                Become a Sponsor
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;