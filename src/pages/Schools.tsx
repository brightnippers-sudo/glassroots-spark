import { useState } from "react";
import { School, Users, Award, Upload, Search, MapPin, Phone, Mail, CheckCircle, Star } from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Schools = () => {
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Mock data
  const kpis = [
    { title: "Registered Schools", value: "1,247", icon: School, trend: "+25 new schools" },
    { title: "Certified Coaches", value: "3,450", icon: Users, trend: "+12% this month" },
    { title: "Students Coached", value: "25,847", icon: Award, trend: "+18% this quarter" }
  ];

  const schools = [
    {
      name: "Royal Crown Academy",
      region: "Southwest",
      location: "Lagos State",
      verified: true,
      students: 245,
      coaches: 8,
      contact: "+234 801 234 5678",
      email: "admin@royalcrown.edu.ng",
      achievements: "3x Regional Champions"
    },
    {
      name: "Federal Government College",
      region: "North Central", 
      location: "Abuja FCT",
      verified: true,
      students: 189,
      coaches: 6,
      contact: "+234 802 345 6789",
      email: "info@fgcabuja.edu.ng",
      achievements: "National Finalists 2023"
    },
    {
      name: "St. Teresa's College",
      region: "Southeast",
      location: "Enugu State", 
      verified: false,
      students: 156,
      coaches: 4,
      contact: "+234 803 456 7890",
      email: "contact@stteresas.edu.ng",
      achievements: "Regional Semi-finalists"
    },
    {
      name: "Community High School",
      region: "South-South",
      location: "Rivers State",
      verified: true,
      students: 134,
      coaches: 5,
      contact: "+234 804 567 8901", 
      email: "admin@communityhigh.edu.ng",
      achievements: "Excellence in Mathematics"
    }
  ];

  const regions = [
    { id: "all", name: "All Regions" },
    { id: "southwest", name: "Southwest" },
    { id: "southeast", name: "Southeast" },
    { id: "south-south", name: "South-South" },
    { id: "north-central", name: "North Central" },
    { id: "northwest", name: "Northwest" },
    { id: "northeast", name: "Northeast" }
  ];

  const filteredSchools = selectedRegion === "all" 
    ? schools 
    : schools.filter(school => school.region.toLowerCase().replace(/[\s-]/g, '') === selectedRegion);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Schools & Coaches
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with educational institutions and certified coaches across Nigeria.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  {kpi.trend && <p className="text-xs text-success mt-1">{kpi.trend}</p>}
                </div>
                <kpi.icon className="h-8 w-8 text-primary" />
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <div className="text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Become a Coach</h3>
              <p className="text-muted-foreground mb-4">
                Join our network of certified coaches and help students excel in competitions.
              </p>
              <Dialog open={showCoachModal} onOpenChange={setShowCoachModal}>
                <DialogTrigger asChild>
                  <GlassButton variant="primary">Apply as Coach</GlassButton>
                </DialogTrigger>
                <DialogContent className="glass-card border border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Apply as a Coach</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <Input placeholder="Enter your full name" className="glass-card border-white/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <Input type="email" placeholder="your.email@example.com" className="glass-card border-white/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <Input placeholder="+234 xxx xxx xxxx" className="glass-card border-white/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Teaching Experience</label>
                      <textarea 
                        placeholder="Describe your teaching background and qualifications..."
                        className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Upload CV</label>
                      <div className="glass-card border border-dashed border-white/20 rounded-base p-6 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <GlassButton variant="primary" className="flex-1">Submit Application</GlassButton>
                      <GlassButton variant="ghost" onClick={() => setShowCoachModal(false)}>Cancel</GlassButton>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <School className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">School Registration</h3>
              <p className="text-muted-foreground mb-4">
                Register multiple students from your school with our bulk registration system.
              </p>
              <GlassButton variant="secondary">
                <Upload className="w-4 h-4" />
                Bulk Register Students
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        {/* School Directory */}
        <section>
          <GlassCard>
            <GlassCardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <GlassCardTitle>School Directory</GlassCardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search schools..." 
                      className="pl-10 glass-card border-white/10"
                    />
                  </div>
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="glass-card border border-white/10 rounded-base p-2 bg-transparent text-foreground"
                  >
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSchools.map((school, index) => (
                  <div key={index} className="glass p-6 rounded-base">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{school.name}</h3>
                          {school.verified && (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>{school.location}</span>
                        </div>
                        <Badge className="bg-primary/20 text-primary">
                          {school.region}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center glass-card p-3 rounded-base">
                        <div className="text-lg font-bold text-foreground">{school.students}</div>
                        <div className="text-xs text-muted-foreground">Students</div>
                      </div>
                      <div className="text-center glass-card p-3 rounded-base">
                        <div className="text-lg font-bold text-foreground">{school.coaches}</div>
                        <div className="text-xs text-muted-foreground">Coaches</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{school.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{school.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Star className="w-4 h-4 text-secondary-orange" />
                        <span>{school.achievements}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <GlassButton variant="ghost" size="sm" className="flex-1">
                        View Profile
                      </GlassButton>
                      <GlassButton variant="secondary" size="sm">
                        Case Study
                      </GlassButton>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <GlassButton variant="ghost">Load More Schools</GlassButton>
              </div>
            </GlassCardContent>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

export default Schools;