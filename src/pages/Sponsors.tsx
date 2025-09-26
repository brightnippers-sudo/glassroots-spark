import { useState } from "react";
import { 
  Award, 
  Users, 
  Building, 
  TrendingUp, 
  Mail, 
  Phone, 
  Calendar,
  BarChart3,
  Target,
  Eye,
  MousePointer
} from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Sponsors = () => {
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  // Mock data
  const impactStats = [
    { title: "Students Reached", value: "15,000+", icon: Users, trend: "+25% this year" },
    { title: "Partner Schools", value: "1,247", icon: Building, trend: "Across 6 regions" },
    { title: "States Covered", value: "36", icon: Target, trend: "National coverage" },
    { title: "Annual Growth", value: "40%", icon: TrendingUp, trend: "Year over year" }
  ];

  const sponsorPackages = [
    {
      tier: "Gold",
      price: "₦5,000,000",
      color: "from-yellow-400/20 to-yellow-500/20",
      features: [
        "Logo on all competition materials",
        "Feature on Live Quiz Show livestream", 
        "Social media campaign (50+ posts)",
        "Grassroots school award activations",
        "Sponsor-created highlight video",
        "Recognition on results pages",
        "Annual gala presentation opportunity"
      ]
    },
    {
      tier: "Silver", 
      price: "₦2,500,000",
      color: "from-gray-300/20 to-gray-400/20",
      features: [
        "Logo on website and certificates",
        "Social media mentions (25+ posts)",
        "School activation in 3 states",
        "Results page recognition",
        "Newsletter placement",
        "Event banner display"
      ]
    },
    {
      tier: "Bronze",
      price: "₦1,000,000", 
      color: "from-amber-600/20 to-amber-700/20",
      features: [
        "Website logo placement",
        "Social media mentions (10+ posts)",
        "School activation in 1 state",
        "Newsletter mention",
        "Certificate recognition"
      ]
    }
  ];

  const partnerStories = [
    {
      name: "FirstBank Nigeria",
      tier: "Gold",
      impact: "Sponsored 500+ students",
      quote: "SCMC aligns perfectly with our mission to develop young minds in Nigeria.",
      logo: "/placeholder.svg"
    },
    {
      name: "MTN Foundation",
      tier: "Silver", 
      impact: "Reached 15 states",
      quote: "Proud to support mathematical excellence across Nigeria.",
      logo: "/placeholder.svg"
    },
    {
      name: "Dangote Foundation",
      tier: "Gold",
      impact: "Equipped 50+ schools",
      quote: "Investing in education is investing in Nigeria's future.",
      logo: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Partner with SCMC
          </h1>
          <h2 className="text-2xl md:text-3xl text-primary mb-8">
            Invest in Tomorrow's Thinkers
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Join us in nurturing mathematical and scientific excellence across Nigeria. 
            Partner with SCMC to create lasting impact in education and youth development.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={showSponsorModal} onOpenChange={setShowSponsorModal}>
              <DialogTrigger asChild>
                <GlassButton size="lg" variant="primary">
                  <Award className="w-5 h-5" />
                  Become a Sponsor
                </GlassButton>
              </DialogTrigger>
              <DialogContent className="glass-card border border-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Sponsor Partnership Inquiry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Organization Name</label>
                      <Input placeholder="Your organization" className="glass-card border-white/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Contact Name</label>
                      <Input placeholder="Your full name" className="glass-card border-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <Input type="email" placeholder="contact@organization.com" className="glass-card border-white/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <Input placeholder="+234 xxx xxx xxxx" className="glass-card border-white/10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Package Interest</label>
                    <select className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground">
                      <option value="">Select a package</option>
                      <option value="gold">Gold Package</option>
                      <option value="silver">Silver Package</option>
                      <option value="bronze">Bronze Package</option>
                      <option value="custom">Custom Package</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Budget Range</label>
                    <select className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground">
                      <option value="">Select budget range</option>
                      <option value="1-5m">₦1M - ₦5M</option>
                      <option value="5-10m">₦5M - ₦10M</option>
                      <option value="10m+">₦10M+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea 
                      placeholder="Tell us about your organization and partnership goals..."
                      className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <GlassButton variant="primary" className="flex-1">Submit Inquiry</GlassButton>
                    <GlassButton variant="ghost" onClick={() => setShowSponsorModal(false)}>Cancel</GlassButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <GlassButton size="lg" variant="secondary">
              <Mail className="w-5 h-5" />
              Contact Sales
            </GlassButton>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        {/* Impact Statistics */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the measurable difference your sponsorship makes in developing Nigeria's future leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-2">{stat.title}</div>
                <div className="text-xs text-success">{stat.trend}</div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Sponsorship Packages */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Sponsorship Packages</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose a partnership level that aligns with your organization's goals and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsorPackages.map((pkg, index) => (
              <GlassCard key={pkg.tier} className="p-8 relative">
                <div className={`h-1 bg-gradient-to-r ${pkg.color} absolute top-0 left-0 right-0 rounded-t-base`} />
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.tier}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{pkg.price}</div>
                  <div className="text-sm text-muted-foreground">per year</div>
                </div>

                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <GlassButton variant="primary" className="w-full">
                  Choose {pkg.tier}
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Sponsor Analytics Preview */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Track Your Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Monitor your sponsorship performance with comprehensive analytics and reporting.
            </p>
          </div>

          <GlassCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center glass p-6 rounded-base">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">2,450</div>
                <div className="text-sm text-muted-foreground">Registrations Driven</div>
              </div>
              <div className="text-center glass p-6 rounded-base">
                <Building className="w-8 h-8 text-secondary-orange mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">125</div>
                <div className="text-sm text-muted-foreground">Schools Reached</div>
              </div>
              <div className="text-center glass p-6 rounded-base">
                <Eye className="w-8 h-8 text-success mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">1.2M</div>
                <div className="text-sm text-muted-foreground">Impressions</div>
              </div>
              <div className="text-center glass p-6 rounded-base">
                <MousePointer className="w-8 h-8 text-accent mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">15.3%</div>
                <div className="text-sm text-muted-foreground">Click-through Rate</div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <GlassButton variant="secondary">
                <BarChart3 className="w-4 h-4" />
                View Full Analytics
              </GlassButton>
            </div>
          </GlassCard>
        </section>

        {/* Partner Success Stories */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Partner Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our valued partners about their experience with SCMC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerStories.map((partner, index) => (
              <GlassCard key={index} className="p-6">
                <div className="text-center mb-6">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-16 h-16 mx-auto mb-4 object-contain glass-card p-2 rounded-base"
                  />
                  <h3 className="text-lg font-bold text-foreground mb-1">{partner.name}</h3>
                  <Badge className="bg-secondary-orange/20 text-secondary-orange">
                    {partner.tier} Partner
                  </Badge>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-sm font-semibold text-primary mb-2">{partner.impact}</div>
                  <blockquote className="text-sm text-muted-foreground italic">
                    "{partner.quote}"
                  </blockquote>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <GlassCard className="p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Make an Impact?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join leading organizations in shaping Nigeria's educational landscape. 
              Let's discuss how we can create a customized partnership that delivers results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton size="lg" variant="primary">
                <Calendar className="w-5 h-5" />
                Schedule Meeting
              </GlassButton>
              <GlassButton size="lg" variant="secondary">
                <Phone className="w-5 h-5" />
                Call Sales Team
              </GlassButton>
            </div>
          </GlassCard>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Sponsors;