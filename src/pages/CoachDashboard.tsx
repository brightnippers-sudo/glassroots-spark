import { useState } from "react";
import { 
  Users, 
  Trophy, 
  CreditCard, 
  Star, 
  Plus, 
  Upload, 
  MessageSquare, 
  Search,
  Filter,
  Edit,
  UserPlus,
  Download,
  Bell,
  School,
  Award,
  TrendingUp,
  FileText
} from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CoachDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data
  const schoolInfo = {
    name: "Lagos State Model College",
    coach: "Mrs. Adebayo Olumide",
    region: "Lagos State",
    verified: true
  };

  const kpiData = {
    participantsRegistered: 42,
    competitionsActive: 3,
    paymentsDue: 2,
    topPerformer: { name: "Adebayo Sarah", score: 95 }
  };

  const participants = [
    {
      id: 1,
      name: "Adebayo Sarah",
      avatar: "/placeholder.svg",
      class: "JSS 3",
      category: "Lower Secondary",
      registrationStatus: "registered",
      paymentStatus: "paid",
      lastScore: 95
    },
    {
      id: 2,
      name: "Olusegun Michael",
      avatar: "/placeholder.svg",
      class: "SSS 2",
      category: "Upper Secondary",
      registrationStatus: "pending",
      paymentStatus: "pending",
      lastScore: 87
    },
    {
      id: 3,
      name: "Fatima Aisha",
      avatar: "/placeholder.svg",
      class: "JSS 1",
      category: "Lower Secondary",
      registrationStatus: "registered",
      paymentStatus: "paid",
      lastScore: 92
    },
    {
      id: 4,
      name: "Chioma Grace",
      avatar: "/placeholder.svg",
      class: "SSS 1",
      category: "Upper Secondary",
      registrationStatus: "draft",
      paymentStatus: "unpaid",
      lastScore: null
    }
  ];

  const competitions = [
    {
      id: 1,
      title: "Mathematics Competition 2024",
      type: "Mathematics",
      stage: "Regional",
      registrationDeadline: "2024-03-15",
      fee: "₦5,000",
      categories: ["Lower Secondary", "Upper Secondary"]
    },
    {
      id: 2,
      title: "Science Olympiad 2024",
      type: "Science",
      stage: "State Finals",
      registrationDeadline: "2024-04-01",
      fee: "₦7,500",
      categories: ["Lower Secondary", "Upper Secondary"]
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "payment",
      title: "Payment Reminder",
      message: "2 participants have pending payments due by March 15th",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "competition",
      title: "New Competition Available",
      message: "Science Olympiad 2024 registration is now open",
      time: "1 day ago",
      read: true
    },
    {
      id: 3,
      type: "result",
      title: "Results Published",
      message: "Mathematics Competition 2024 preliminary results are available",
      time: "3 days ago",
      read: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered": return "bg-success/20 text-success";
      case "paid": return "bg-success/20 text-success";
      case "pending": return "bg-secondary-orange/20 text-secondary-orange";
      case "draft": return "bg-muted/20 text-muted-foreground";
      case "unpaid": return "bg-danger/20 text-danger";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || participant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <School className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{schoolInfo.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{schoolInfo.coach}</span>
                    {schoolInfo.verified && (
                      <Badge className="bg-success/20 text-success">
                        Verified School
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <GlassButton variant="secondary" size="sm">
                  <Upload className="w-4 h-4" />
                  Bulk Upload
                </GlassButton>
                <GlassButton variant="primary" size="sm">
                  <UserPlus className="w-4 h-4" />
                  Add Participant
                </GlassButton>
              </div>
            </div>
          </div>

          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-primary" />
                <span className="text-sm text-success">+5 this month</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{kpiData.participantsRegistered}</div>
              <div className="text-sm text-muted-foreground">Participants Registered</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8 text-secondary-orange" />
                <span className="text-sm text-secondary-orange">Active</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{kpiData.competitionsActive}</div>
              <div className="text-sm text-muted-foreground">Competitions Active</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-8 h-8 text-danger" />
                <span className="text-sm text-danger">Due Soon</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{kpiData.paymentsDue}</div>
              <div className="text-sm text-muted-foreground">Payments Due</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-primary" />
                <span className="text-sm text-success">Score: {kpiData.topPerformer.score}</span>
              </div>
              <div className="text-lg font-bold text-foreground mb-1">{kpiData.topPerformer.name}</div>
              <div className="text-sm text-muted-foreground">Top Performer</div>
            </GlassCard>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="participants" className="w-full">
            <TabsList className="grid grid-cols-5 w-full lg:w-auto glass-card">
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="competitions">Competitions</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="profile">School Profile</TabsTrigger>
              <TabsTrigger value="notifications">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="w-2 h-2 bg-danger rounded-full"></span>
                  )}
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="space-y-6">
              {/* Search and Filters */}
              <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search participants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass-card"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48 glass-card">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Lower Primary">Lower Primary</SelectItem>
                      <SelectItem value="Upper Primary">Upper Primary</SelectItem>
                      <SelectItem value="Lower Secondary">Lower Secondary</SelectItem>
                      <SelectItem value="Upper Secondary">Upper Secondary</SelectItem>
                    </SelectContent>
                  </Select>
                  <GlassButton variant="secondary">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </GlassButton>
                </div>
              </GlassCard>

              {/* Participants List */}
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <div className="flex items-center justify-between">
                    <GlassCardTitle>Participants ({filteredParticipants.length})</GlassCardTitle>
                    <div className="flex gap-2">
                      <GlassButton variant="secondary" size="sm">
                        <Download className="w-4 h-4" />
                        Export
                      </GlassButton>
                      <GlassButton variant="primary" size="sm">
                        <Plus className="w-4 h-4" />
                        Register Selected
                      </GlassButton>
                    </div>
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {filteredParticipants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-4 glass rounded-base">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{participant.name}</div>
                            <div className="text-sm text-muted-foreground">{participant.class} • {participant.category}</div>
                            {participant.lastScore && (
                              <div className="text-sm text-primary">Last Score: {participant.lastScore}%</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge className={getStatusColor(participant.registrationStatus)}>
                              {participant.registrationStatus}
                            </Badge>
                            <div className="mt-1">
                              <Badge className={getStatusColor(participant.paymentStatus)}>
                                {participant.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <GlassButton variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </GlassButton>
                            {participant.registrationStatus === "draft" && (
                              <GlassButton variant="primary" size="sm">
                                Register
                              </GlassButton>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="competitions" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>Available Competitions</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {competitions.map((competition) => (
                      <div key={competition.id} className="p-4 glass rounded-base">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">{competition.title}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <div className="font-medium">{competition.type}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Stage:</span>
                                <div className="font-medium">{competition.stage}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Deadline:</span>
                                <div className="font-medium">{competition.registrationDeadline}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Fee:</span>
                                <div className="font-medium">{competition.fee}</div>
                              </div>
                            </div>
                          </div>
                          <GlassButton variant="primary">
                            Register Participants
                          </GlassButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>School Results Summary</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Results Coming Soon</h3>
                    <p className="text-muted-foreground mb-6">Competition results will appear here once published</p>
                    <GlassButton variant="secondary">
                      <FileText className="w-4 h-4" />
                      Download Previous Results
                    </GlassButton>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>School Profile</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">School Name</label>
                        <Input value={schoolInfo.name} className="glass-card" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Region</label>
                        <Input value={schoolInfo.region} className="glass-card" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Coach Name</label>
                        <Input value={schoolInfo.coach} className="glass-card" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Coach Email</label>
                        <Input placeholder="coach@school.edu.ng" className="glass-card" />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <GlassButton variant="primary">Save Changes</GlassButton>
                      <GlassButton variant="secondary">Upload School Logo</GlassButton>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>Notifications</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={cn(
                        "p-4 glass rounded-base border-l-4",
                        !notification.read && "border-l-primary bg-primary/5",
                        notification.read && "border-l-muted"
                      )}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{notification.title}</h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          {!notification.read && (
                            <GlassButton variant="ghost" size="sm">
                              Mark as Read
                            </GlassButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoachDashboard;