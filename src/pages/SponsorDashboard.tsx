import { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Building, 
  Eye, 
  Upload, 
  FileText, 
  CreditCard, 
  MessageSquare,
  Download,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar
} from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SponsorDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  // Mock data
  const sponsorProfile = {
    name: "FirstBank Nigeria",
    tier: "Gold",
    logo: "/placeholder.svg",
    contribution: "₦5,000,000",
    activePackage: "Gold Partnership Package"
  };

  const kpiData = {
    totalContribution: "₦5,000,000",
    activeCampaigns: 3,
    schoolsReached: 125,
    studentsImpacted: 2450
  };

  const impactStats = [
    { title: "Registrations Driven", value: "2,450", icon: Users, change: "+15%" },
    { title: "Schools Activated", value: "125", icon: Building, change: "+8%" },
    { title: "Media Impressions", value: "1.2M", icon: Eye, change: "+22%" },
    { title: "Engagement Rate", value: "15.3%", icon: BarChart3, change: "+5%" }
  ];

  const deliverables = [
    { name: "Social Media Campaign", status: "completed", dueDate: "2024-01-15" },
    { name: "Livestream Feature", status: "in-progress", dueDate: "2024-02-01" },
    { name: "School Activations", status: "completed", dueDate: "2024-01-30" },
    { name: "Video Content Creation", status: "pending", dueDate: "2024-02-15" }
  ];

  const invoices = [
    { id: "INV-001", amount: "₦2,500,000", status: "paid", dueDate: "2024-01-15" },
    { id: "INV-002", amount: "₦2,500,000", status: "pending", dueDate: "2024-06-15" }
  ];

  const mediaMentions = [
    { title: "SCMC Partners with FirstBank for Educational Excellence", source: "The Guardian", date: "2024-01-20", url: "#" },
    { title: "Financial Institution Supports Young Mathematicians", source: "BusinessDay", date: "2024-01-18", url: "#" },
    { title: "FirstBank's Investment in Education Pays Off", source: "Punch", date: "2024-01-15", url: "#" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/20 text-success";
      case "in-progress": return "bg-secondary-orange/20 text-secondary-orange";
      case "pending": return "bg-muted/20 text-muted-foreground";
      case "paid": return "bg-success/20 text-success";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={sponsorProfile.logo} 
                  alt={sponsorProfile.name}
                  className="w-16 h-16 object-contain glass-card p-2 rounded-base"
                />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{sponsorProfile.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn("", sponsorProfile.tier === "Gold" && "bg-yellow-500/20 text-yellow-600")}>
                      {sponsorProfile.tier} Partner
                    </Badge>
                    <span className="text-sm text-muted-foreground">{sponsorProfile.activePackage}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <GlassButton variant="secondary" size="sm">
                  <Upload className="w-4 h-4" />
                  Upload Assets
                </GlassButton>
                <GlassButton variant="primary" size="sm">
                  <Download className="w-4 h-4" />
                  Impact Report
                </GlassButton>
              </div>
            </div>
          </div>

          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-primary" />
                <span className="text-sm text-success">Active</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{kpiData.totalContribution}</div>
              <div className="text-sm text-muted-foreground">Total Contribution</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8 text-secondary-orange" />
                <span className="text-sm text-secondary-orange">{kpiData.activeCampaigns} Active</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{kpiData.activeCampaigns}</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Building className="w-8 h-8 text-primary" />
                <span className="text-sm text-success">+8%</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{kpiData.schoolsReached}</div>
              <div className="text-sm text-muted-foreground">Schools Reached</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-secondary-orange" />
                <span className="text-sm text-success">+15%</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{kpiData.studentsImpacted}</div>
              <div className="text-sm text-muted-foreground">Students Impacted</div>
            </GlassCard>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-6 w-full lg:w-auto glass-card">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Impact Analytics */}
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <div className="flex items-center justify-between">
                    <GlassCardTitle>Impact Analytics</GlassCardTitle>
                    <div className="flex gap-2">
                      {["30", "90", "365"].map((period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period)}
                          className={cn(
                            "px-3 py-1 rounded-base text-sm transition-colors",
                            selectedPeriod === period
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {period}d
                        </button>
                      ))}
                    </div>
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {impactStats.map((stat, index) => (
                      <div key={index} className="text-center glass p-4 rounded-base">
                        <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="text-xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground mb-1">{stat.title}</div>
                        <div className="text-xs text-success">{stat.change}</div>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <GlassCardHeader>
                    <GlassCardTitle>Deliverables Progress</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="space-y-4">
                      {deliverables.slice(0, 3).map((deliverable, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {deliverable.status === "completed" ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <Clock className="w-5 h-5 text-secondary-orange" />
                            )}
                            <div>
                              <div className="font-medium text-foreground">{deliverable.name}</div>
                              <div className="text-sm text-muted-foreground">Due: {deliverable.dueDate}</div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(deliverable.status)}>
                            {deliverable.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </GlassCardContent>
                </GlassCard>

                <GlassCard className="p-6">
                  <GlassCardHeader>
                    <GlassCardTitle>Recent Media Mentions</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="space-y-4">
                      {mediaMentions.slice(0, 3).map((mention, index) => (
                        <div key={index}>
                          <div className="font-medium text-foreground mb-1">{mention.title}</div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{mention.source}</span>
                            <span>{mention.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCardContent>
                </GlassCard>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>Detailed Analytics</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Analytics Coming Soon</h3>
                    <p className="text-muted-foreground mb-6">Detailed charts and insights will be available here</p>
                    <GlassButton variant="primary">
                      Request Analytics Demo
                    </GlassButton>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="deliverables" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>Sponsorship Deliverables</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center justify-between p-4 glass rounded-base">
                        <div className="flex items-center gap-3">
                          {deliverable.status === "completed" ? (
                            <CheckCircle className="w-6 h-6 text-success" />
                          ) : deliverable.status === "in-progress" ? (
                            <Clock className="w-6 h-6 text-secondary-orange" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-muted" />
                          )}
                          <div>
                            <div className="font-medium text-foreground">{deliverable.name}</div>
                            <div className="text-sm text-muted-foreground">Due: {deliverable.dueDate}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(deliverable.status)}>
                          {deliverable.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>Invoices & Payments</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {invoices.map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-4 glass rounded-base">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-primary" />
                          <div>
                            <div className="font-medium text-foreground">{invoice.id}</div>
                            <div className="text-sm text-muted-foreground">Due: {invoice.dueDate}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold text-foreground">{invoice.amount}</div>
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                          {invoice.status === "pending" && (
                            <GlassButton variant="primary" size="sm">
                              <CreditCard className="w-4 h-4" />
                              Pay Now
                            </GlassButton>
                          )}
                          <GlassButton variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </GlassButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>Brand Assets & Materials</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="text-center py-12">
                    <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Upload Your Assets</h3>
                    <p className="text-muted-foreground mb-6">Upload logos, brand guidelines, and marketing materials</p>
                    <GlassButton variant="primary">
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </GlassButton>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <GlassCard className="p-6">
                <GlassCardHeader>
                  <GlassCardTitle>Messages & Support</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="p-4 glass rounded-base">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          A
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">SCMC Team</span>
                            <span className="text-sm text-muted-foreground">2 hours ago</span>
                          </div>
                          <p className="text-sm text-foreground">Your impact report for Q1 2024 is ready for review. Please let us know if you need any adjustments.</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="space-y-4">
                        <Textarea placeholder="Type your message..." className="glass-card" />
                        <div className="flex justify-between items-center">
                          <GlassButton variant="ghost" size="sm">
                            <Calendar className="w-4 h-4" />
                            Schedule Meeting
                          </GlassButton>
                          <GlassButton variant="primary" size="sm">
                            <MessageSquare className="w-4 h-4" />
                            Send Message
                          </GlassButton>
                        </div>
                      </div>
                    </div>
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

export default SponsorDashboard;