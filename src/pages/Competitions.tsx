import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Filter, Download } from "lucide-react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Competitions = () => {
  const [selectedCompetition, setSelectedCompetition] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const competitions = [
    {
      id: 1,
      title: "Scholars Cambridge Maths 2025",
      stage: "Stage One",
      type: "Mathematics",
      status: "Open",
      registrationDeadline: "March 15, 2025",
      competitionDate: "March 22, 2025",
      regions: ["Southwest", "South-South"],
      virtual: true,
      participants: 12500,
      description: "National mathematics competition focusing on problem-solving and analytical thinking."
    },
    {
      id: 2,
      title: "SCMC Science Challenge",
      stage: "Regional",
      type: "Science", 
      status: "Closed",
      registrationDeadline: "February 28, 2025",
      competitionDate: "March 8, 2025",
      regions: ["North Central"],
      virtual: true,
      participants: 8750,
      description: "Comprehensive science competition covering Physics, Chemistry, and Biology."
    },
    {
      id: 3,
      title: "Coding Competition Finals",
      stage: "Finals",
      type: "Coding",
      status: "Invite-only",
      registrationDeadline: "Invitation Only",
      competitionDate: "April 5, 2025",
      regions: ["National"],
      virtual: true,
      participants: 500,
      description: "Elite coding competition for top performers from regional rounds."
    },
    {
      id: 4,
      title: "Mathematics Olympiad Prep",
      stage: "Stage One",
      type: "Mathematics",
      status: "Open",
      registrationDeadline: "April 20, 2025",
      competitionDate: "April 28, 2025",
      regions: ["Northwest", "Northeast"],
      virtual: true,
      participants: 0,
      description: "Preparation competition for international mathematics olympiad."
    }
  ];

  const pastCompetitions = [
    {
      title: "SCMC Mathematics 2024 Finals",
      date: "December 2024",
      participants: 15000,
      winner: "Adaora Chukwu - Kings College Lagos"
    },
    {
      title: "Science Challenge 2024",
      date: "November 2024", 
      participants: 12000,
      winner: "Ibrahim Musa - Government College Kano"
    }
  ];

  const regions = [
    "Southwest",
    "South-South & Southeast", 
    "North Central",
    "Northwest",
    "Northeast"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-success/20 text-success";
      case "Closed":
        return "bg-danger/20 text-danger";
      case "Invite-only":
        return "bg-secondary-orange/20 text-secondary-orange";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Stage One":
        return "bg-primary/20 text-primary";
      case "Regional":
        return "bg-secondary-orange/20 text-secondary-orange";
      case "Finals":
        return "bg-accent/20 text-accent-foreground";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const filteredCompetitions = competitions.filter(comp => {
    return (selectedCompetition === "all" || comp.type === selectedCompetition) &&
           (selectedStatus === "all" || comp.status === selectedStatus) &&
           (selectedRegion === "all" || comp.regions.includes(selectedRegion));
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Competitions</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover upcoming competitions and register to showcase your skills in Mathematics, Science, and Coding.
          </p>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter by:</span>
            </div>
            
            <select 
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="glass-card px-3 py-2 text-sm rounded-base border-white/10 text-foreground"
            >
              <option value="all">All Competitions</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Coding">Coding</option>
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="glass-card px-3 py-2 text-sm rounded-base border-white/10 text-foreground"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Invite-only">Invite-only</option>
            </select>

            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="glass-card px-3 py-2 text-sm rounded-base border-white/10 text-foreground"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Competition Cards */}
      <section className="pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredCompetitions.map((competition) => (
              <GlassCard key={competition.id} className="p-6">
                <GlassCardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <GlassCardTitle className="text-xl mb-2">{competition.title}</GlassCardTitle>
                      <div className="flex gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs rounded-pill ${getStageColor(competition.stage)}`}>
                          {competition.stage}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-pill ${getStatusColor(competition.status)}`}>
                          {competition.status}
                        </span>
                        <span className="px-2 py-1 bg-muted/20 text-muted-foreground text-xs rounded-pill">
                          {competition.type}
                        </span>
                      </div>
                    </div>
                    {competition.virtual && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-pill">
                        Virtual
                      </span>
                    )}
                  </div>
                </GlassCardHeader>
                
                <GlassCardContent>
                  <p className="text-muted-foreground text-sm mb-4">{competition.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Competition: {competition.competitionDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Registration Deadline: {competition.registrationDeadline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Regions: {competition.regions.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-foreground">
                        {competition.participants > 0 ? `${competition.participants.toLocaleString()} registered` : "Registration just opened"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {competition.status === "Open" ? (
                      <GlassButton variant="accent" size="sm" className="flex-1">
                        Register Now
                      </GlassButton>
                    ) : competition.status === "Closed" ? (
                      <GlassButton variant="ghost" size="sm" disabled className="flex-1">
                        Registration Closed
                      </GlassButton>
                    ) : (
                      <GlassButton variant="secondary" size="sm" className="flex-1">
                        View Details
                      </GlassButton>
                    )}
                    <GlassButton variant="ghost" size="sm">
                      View Details
                    </GlassButton>
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Archive Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Past Competitions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pastCompetitions.map((competition, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{competition.title}</h3>
                    <p className="text-muted-foreground text-sm">{competition.date} • {competition.participants.toLocaleString()} participants</p>
                  </div>
                  <GlassButton variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                    Results CSV
                  </GlassButton>
                </div>
                <div className="p-3 bg-success/10 rounded-base">
                  <p className="text-sm font-medium text-success">🏆 Winner: {competition.winner}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Competitions;