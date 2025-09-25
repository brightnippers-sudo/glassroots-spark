import { useState } from "react";
import { 
  User, 
  Trophy, 
  FileDown, 
  CreditCard, 
  Bell, 
  Camera, 
  Share2,
  Download,
  ExternalLink,
  Star,
  Users,
  Calendar
} from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const [selectedRegistration, setSelectedRegistration] = useState("reg-1");

  // Mock data
  const participant = {
    name: "Sarah Johnson",
    id: "SCMC2024001",
    photo: "/placeholder.svg",
    tier: "Bronze"
  };

  const registrations = [
    { id: "reg-1", title: "Scholars Cambridge Maths 2025", status: "Confirmed", date: "Mar 15, 2024" },
    { id: "reg-2", title: "SCMC Science Challenge", status: "Pending Payment", date: "Apr 20, 2024" }
  ];

  const clubStats = {
    referrals: 12,
    battles: 38,
    totalNeeded: 50,
    nextTier: "Silver"
  };

  const certificates = [
    { title: "Mathematics Excellence 2024", date: "Jan 2024", url: "#" },
    { title: "Science Achievement 2023", date: "Dec 2023", url: "#" }
  ];

  const invoices = [
    { id: "INV-001", amount: "₦15,000", status: "Paid", date: "Feb 2024" },
    { id: "INV-002", amount: "₦12,000", status: "Pending", date: "Mar 2024" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={participant.photo} 
                alt={participant.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
              />
              <button className="absolute -bottom-1 -right-1 glass-card p-2 rounded-full">
                <Camera className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{participant.name}</h1>
              <p className="text-muted-foreground">Participant ID: {participant.id}</p>
              <Badge className="mt-2 bg-secondary-orange/20 text-secondary-orange">
                {participant.tier} Member
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Registrations */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  My Registrations
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <select 
                  value={selectedRegistration}
                  onChange={(e) => setSelectedRegistration(e.target.value)}
                  className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground"
                >
                  {registrations.map(reg => (
                    <option key={reg.id} value={reg.id}>{reg.title}</option>
                  ))}
                </select>
                
                {registrations.filter(r => r.id === selectedRegistration).map(reg => (
                  <div key={reg.id} className="glass p-4 rounded-base">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{reg.title}</h3>
                        <p className="text-sm text-muted-foreground">Competition Date: {reg.date}</p>
                        <Badge className={`mt-2 ${reg.status === 'Confirmed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                          {reg.status}
                        </Badge>
                      </div>
                      <GlassButton variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                        Entry Slip
                      </GlassButton>
                    </div>
                  </div>
                ))}
              </GlassCardContent>
            </GlassCard>

            {/* Smarter Than 20 Club */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Smarter Than 20 Club
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-base text-center">
                    <div className="text-2xl font-bold text-primary">{clubStats.referrals}</div>
                    <div className="text-sm text-muted-foreground">Referrals</div>
                  </div>
                  <div className="glass p-4 rounded-base text-center">
                    <div className="text-2xl font-bold text-primary">{clubStats.battles}</div>
                    <div className="text-sm text-muted-foreground">Battles Won</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress to {clubStats.nextTier}</span>
                    <span className="text-foreground">{clubStats.referrals + clubStats.battles}/{clubStats.totalNeeded}</span>
                  </div>
                  <Progress value={((clubStats.referrals + clubStats.battles) / clubStats.totalNeeded) * 100} className="h-2" />
                </div>

                <GlassButton className="w-full" variant="secondary">
                  <Share2 className="w-4 h-4" />
                  Share Referral Link
                </GlassButton>
              </GlassCardContent>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Activity
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                {[
                  { message: "Registration confirmed for Maths Competition", time: "2 hours ago", type: "success" },
                  { message: "Certificate generated for Science Challenge", time: "1 day ago", type: "info" },
                  { message: "Payment reminder sent", time: "3 days ago", type: "warning" }
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center p-3 glass rounded-base">
                    <span className="text-sm text-foreground">{activity.message}</span>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </GlassCardContent>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certificates */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Certificates
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                {certificates.map((cert, index) => (
                  <div key={index} className="glass p-3 rounded-base">
                    <h4 className="font-medium text-foreground text-sm">{cert.title}</h4>
                    <p className="text-xs text-muted-foreground">{cert.date}</p>
                    <GlassButton variant="ghost" size="sm" className="mt-2 w-full">
                      <FileDown className="w-4 h-4" />
                      Download PDF
                    </GlassButton>
                  </div>
                ))}
              </GlassCardContent>
            </GlassCard>

            {/* Invoices & Payments */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payments
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                {invoices.map((invoice, index) => (
                  <div key={index} className="glass p-3 rounded-base">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{invoice.id}</h4>
                        <p className="text-xs text-muted-foreground">{invoice.date}</p>
                        <p className="font-semibold text-primary">{invoice.amount}</p>
                      </div>
                      {invoice.status === 'Pending' && (
                        <GlassButton variant="accent" size="sm">
                          Pay Now
                        </GlassButton>
                      )}
                    </div>
                  </div>
                ))}
              </GlassCardContent>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Quick Actions
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-2">
                <GlassButton variant="ghost" size="sm" className="w-full justify-start">
                  <User className="w-4 h-4" />
                  Edit Profile
                </GlassButton>
                <GlassButton variant="ghost" size="sm" className="w-full justify-start">
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </GlassButton>
                <GlassButton variant="ghost" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4" />
                  Contact Support
                </GlassButton>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;