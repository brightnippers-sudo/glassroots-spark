import { useState } from "react";
import { Trophy, Medal, Award, Filter, Download, Share2, Search } from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Results = () => {
  const [selectedCompetition, setSelectedCompetition] = useState("maths-2024");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Mock data
  const competitions = [
    { id: "maths-2024", name: "Scholars Cambridge Maths 2024" },
    { id: "science-2024", name: "SCMC Science Challenge 2024" },
    { id: "coding-2024", name: "Coding Competition 2024" }
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "lower-primary", name: "Lower Primary" },
    { id: "upper-primary", name: "Upper Primary" },
    { id: "jss", name: "JSS" },
    { id: "sss", name: "SSS" }
  ];

  const topThree = [
    {
      rank: 1,
      name: "Adaeze Okonkwo",
      school: "Royal Crown Academy",
      region: "Southwest",
      score: 95.5,
      percentile: 99.8,
      photo: "/placeholder.svg"
    },
    {
      rank: 2, 
      name: "Ibrahim Yusuf",
      school: "Federal Government College",
      region: "North Central", 
      score: 94.2,
      percentile: 98.9,
      photo: "/placeholder.svg"
    },
    {
      rank: 3,
      name: "Chioma Nwafor", 
      school: "St. Teresa's College",
      region: "Southeast",
      score: 93.8,
      percentile: 97.5,
      photo: "/placeholder.svg"
    }
  ];

  const leaderboard = [
    ...topThree,
    {
      rank: 4,
      name: "Michael Adebayo",
      school: "Lagos State Model College",
      region: "Southwest",
      score: 92.1,
      percentile: 95.2,
      photo: "/placeholder.svg"
    },
    {
      rank: 5,
      name: "Fatima Ahmed",
      school: "Government Secondary School",
      region: "Northwest", 
      score: 91.7,
      percentile: 93.8,
      photo: "/placeholder.svg"
    },
    {
      rank: 6,
      name: "Emmanuel Okoro",
      school: "Community High School",
      region: "South-South",
      score: 90.5,
      percentile: 91.4,
      photo: "/placeholder.svg"
    }
  ];

  const getPositionIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getPositionBg = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3: return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default: return "glass-card border-white/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Results & Leaderboards
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Celebrate excellence and track competition performance across all categories and regions.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-8">
        {/* Filters */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Competition</label>
              <select 
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground"
              >
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Year</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <GlassButton variant="ghost">
                <Filter className="w-4 h-4" />
                Apply
              </GlassButton>
              <GlassButton variant="ghost">
                <Download className="w-4 h-4" />
                Export
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Top 3 Highlight */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Top Performers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topThree.map((participant) => (
              <GlassCard key={participant.rank} className={`${getPositionBg(participant.rank)} p-6 text-center`}>
                <div className="flex justify-center mb-4">
                  {getPositionIcon(participant.rank)}
                </div>
                <img 
                  src={participant.photo} 
                  alt={participant.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-white/20"
                />
                <h3 className="text-lg font-bold text-foreground mb-1">{participant.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{participant.school}</p>
                <Badge className="mb-4 bg-primary/20 text-primary">
                  {participant.region}
                </Badge>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">{participant.score}%</div>
                  <div className="text-sm text-muted-foreground">{participant.percentile}th percentile</div>
                </div>
                <GlassButton variant="ghost" size="sm" className="mt-4">
                  <Share2 className="w-4 h-4" />
                  View Details
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Full Leaderboard */}
        <section>
          <GlassCard>
            <GlassCardHeader>
              <div className="flex justify-between items-center">
                <GlassCardTitle>Full Leaderboard</GlassCardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search participants..." 
                      className="pl-10 glass-card border-white/10"
                    />
                  </div>
                </div>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Rank</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Participant</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">School</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Region</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Score</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Percentile</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((participant) => (
                      <tr key={participant.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getPositionIcon(participant.rank)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={participant.photo} 
                              alt={participant.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-medium text-foreground">{participant.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{participant.school}</td>
                        <td className="py-4 px-4">
                          <Badge className="bg-primary/20 text-primary">{participant.region}</Badge>
                        </td>
                        <td className="py-4 px-4 font-semibold text-foreground">{participant.score}%</td>
                        <td className="py-4 px-4 text-muted-foreground">{participant.percentile}th</td>
                        <td className="py-4 px-4">
                          <GlassButton variant="ghost" size="sm">
                            View
                          </GlassButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                <div className="text-sm text-muted-foreground">
                  Showing 1-10 of 847 participants
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="ghost" size="sm">Previous</GlassButton>
                  <GlassButton variant="ghost" size="sm">1</GlassButton>
                  <GlassButton variant="secondary" size="sm">2</GlassButton>
                  <GlassButton variant="ghost" size="sm">3</GlassButton>
                  <GlassButton variant="ghost" size="sm">Next</GlassButton>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

export default Results;