import { useState } from "react";
import { Play, Download, Camera, FileText, Mail, Calendar, Award, Users, MapPin } from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Media = () => {
  const [showAccreditationModal, setShowAccreditationModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock data
  const featuredVideo = {
    title: "SCMC Documentary: Inspiring Excellence",
    description: "Follow the journey of young mathematicians as they compete in the national championships.",
    thumbnail: "/placeholder.svg",
    duration: "12:34",
    views: "45.2K"
  };

  const winnerSpotlights = [
    {
      name: "Adaeze Okonkwo",
      title: "2024 Mathematics Champion",
      school: "Royal Crown Academy",
      quote: "SCMC taught me that mathematics is not just about numbers, but about solving real-world problems.",
      photo: "/placeholder.svg",
      achievement: "National Champion"
    },
    {
      name: "Ibrahim Yusuf", 
      title: "Science Excellence Award",
      school: "Federal Government College",
      quote: "The competition pushed me to explore science beyond textbooks and discover my passion for research.",
      photo: "/placeholder.svg",
      achievement: "Regional Winner"
    },
    {
      name: "Chioma Nwafor",
      title: "Coding Innovation Prize",
      school: "St. Teresa's College", 
      quote: "SCMC opened doors to the world of technology and showed me that girls can excel in STEM.",
      photo: "/placeholder.svg",
      achievement: "Innovation Award"
    }
  ];

  const photoGallery = [
    { url: "/placeholder.svg", caption: "National Finals Ceremony 2024", category: "Events" },
    { url: "/placeholder.svg", caption: "Students in Action", category: "Competition" },
    { url: "/placeholder.svg", caption: "Award Presentation", category: "Ceremonies" },
    { url: "/placeholder.svg", caption: "Team Collaboration", category: "Activities" },
    { url: "/placeholder.svg", caption: "Regional Competition", category: "Competition" },
    { url: "/placeholder.svg", caption: "Coaching Session", category: "Preparation" },
    { url: "/placeholder.svg", caption: "Winner Celebration", category: "Achievements" },
    { url: "/placeholder.svg", caption: "School Visit", category: "Outreach" }
  ];

  const pressReleases = [
    {
      title: "SCMC 2024 Results: Record-Breaking Participation",
      date: "March 15, 2024",
      excerpt: "Over 25,000 students from 1,200+ schools participated in this year's competition...",
      category: "Results"
    },
    {
      title: "Partnership Announcement: MTN Foundation Joins SCMC",
      date: "February 28, 2024", 
      excerpt: "MTN Foundation becomes official sponsor, expanding reach to underserved communities...",
      category: "Partnership"
    },
    {
      title: "SCMC Launches Virtual Competition Platform",
      date: "January 20, 2024",
      excerpt: "New technology platform enables nationwide participation and real-time scoring...",
      category: "Technology"
    }
  ];

  const mediaKit = {
    items: [
      { name: "Brand Guidelines", type: "PDF", size: "2.1 MB" },
      { name: "Logo Package", type: "ZIP", size: "5.4 MB" },
      { name: "Photo Assets", type: "ZIP", size: "45.2 MB" },
      { name: "Competition Statistics", type: "PDF", size: "1.8 MB" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Media & Stories
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore inspiring stories, memorable moments, and comprehensive media resources from SCMC competitions.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        {/* Featured Documentary */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Documentary</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An in-depth look at the impact of SCMC on students, schools, and communities across Nigeria.
            </p>
          </div>

          <GlassCard className="overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary-orange/10">
              <img 
                src={featuredVideo.thumbnail} 
                alt={featuredVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <GlassButton size="lg" variant="hero" className="glass-card backdrop-blur-md">
                  <Play className="w-8 h-8" />
                  Play Documentary
                </GlassButton>
              </div>
              <div className="absolute bottom-4 right-4 glass-card px-3 py-1 rounded-base">
                <span className="text-sm text-foreground">{featuredVideo.duration}</span>
              </div>
            </div>
            <GlassCardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">{featuredVideo.title}</h3>
              <p className="text-muted-foreground mb-4">{featuredVideo.description}</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/20 text-primary">
                  {featuredVideo.views} views
                </Badge>
                <GlassButton variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                  Download
                </GlassButton>
              </div>
            </GlassCardContent>
          </GlassCard>
        </section>

        {/* Winner Spotlights */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Winner Spotlights</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet our champions and learn about their inspiring journeys to success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {winnerSpotlights.map((winner, index) => (
              <GlassCard key={index} className="p-6">
                <div className="text-center mb-6">
                  <img 
                    src={winner.photo} 
                    alt={winner.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white/20"
                  />
                  <h3 className="text-lg font-bold text-foreground mb-1">{winner.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{winner.school}</p>
                  <Badge className="bg-secondary-orange/20 text-secondary-orange">
                    {winner.achievement}
                  </Badge>
                </div>
                
                <blockquote className="text-sm text-muted-foreground italic text-center mb-4">
                  "{winner.quote}"
                </blockquote>
                
                <div className="text-center">
                  <GlassButton variant="ghost" size="sm">
                    Read Full Story
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Photo Gallery */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Photo Gallery</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Capturing moments of excellence, determination, and celebration from SCMC events.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photoGallery.map((photo, index) => (
              <div 
                key={index} 
                className="glass-card overflow-hidden rounded-base cursor-pointer group hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedImage(photo.url)}
              >
                <div className="aspect-square relative">
                  <img 
                    src={photo.url} 
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground mb-1">{photo.caption}</p>
                  <Badge className="bg-primary/20 text-primary text-xs">
                    {photo.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Press Releases */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Press Releases</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Latest news and announcements from SCMC competitions and partnerships.
            </p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{release.title}</h3>
                      <Badge className="bg-accent/20 text-accent">
                        {release.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{release.date}</span>
                    </div>
                    <p className="text-muted-foreground">{release.excerpt}</p>
                  </div>
                  <div className="ml-6">
                    <GlassButton variant="ghost" size="sm">
                      <FileText className="w-4 h-4" />
                      Read More
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Media Kit & Accreditation */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Media Kit */}
            <GlassCard className="p-6">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Media Kit
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-muted-foreground mb-6">
                  Download our comprehensive media kit including logos, brand guidelines, and high-resolution images.
                </p>
                
                <div className="space-y-3">
                  {mediaKit.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 glass rounded-base">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.type} • {item.size}</p>
                      </div>
                      <GlassButton variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  ))}
                </div>
                
                <GlassButton variant="primary" className="w-full mt-6">
                  <Download className="w-4 h-4" />
                  Download Full Kit
                </GlassButton>
              </GlassCardContent>
            </GlassCard>

            {/* Press Accreditation */}
            <GlassCard className="p-6">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Press Accreditation
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-muted-foreground mb-6">
                  Apply for media accreditation to cover SCMC events and access exclusive content.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 glass rounded-base">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Access to competition venues</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 glass rounded-base">
                    <Camera className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Photo & video opportunities</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 glass rounded-base">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Exclusive interviews with winners</span>
                  </div>
                </div>

                <Dialog open={showAccreditationModal} onOpenChange={setShowAccreditationModal}>
                  <DialogTrigger asChild>
                    <GlassButton variant="secondary" className="w-full">
                      <Mail className="w-4 h-4" />
                      Request Accreditation
                    </GlassButton>
                  </DialogTrigger>
                  <DialogContent className="glass-card border border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Press Accreditation Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                          <Input placeholder="Your full name" className="glass-card border-white/10" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Media Organization</label>
                          <Input placeholder="News outlet/publication" className="glass-card border-white/10" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                          <Input type="email" placeholder="your.email@outlet.com" className="glass-card border-white/10" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                          <Input placeholder="+234 xxx xxx xxxx" className="glass-card border-white/10" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Event of Interest</label>
                        <select className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground">
                          <option value="">Select an event</option>
                          <option value="nationals">National Finals</option>
                          <option value="regionals">Regional Competitions</option>
                          <option value="awards">Awards Ceremony</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Coverage Details</label>
                        <textarea 
                          placeholder="Describe your planned coverage and media requirements..."
                          className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-3">
                        <GlassButton variant="primary" className="flex-1">Submit Request</GlassButton>
                        <GlassButton variant="ghost" onClick={() => setShowAccreditationModal(false)}>Cancel</GlassButton>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </GlassCardContent>
            </GlassCard>
          </div>
        </section>
      </div>
      <Footer />

      {/* Image Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Gallery image"
              className="max-w-full max-h-full object-contain rounded-base"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;