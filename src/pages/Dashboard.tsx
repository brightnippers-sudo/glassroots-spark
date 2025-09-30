import { useState, useEffect, useRef } from "react";
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
  Calendar,
  Loader2
} from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { apiService } from "@/services/apiService";
import { authService } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [selectedRegistration, setSelectedRegistration] = useState("reg-1");
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [participant, setParticipant] = useState({
    name: "",
    id: "",
    photo: "/placeholder.svg",
    tier: "",
    school: "",
    grade: "",
    interests: "",
    achievements: "",
    first_name: "",
    last_name: "",
    photo_url: "",
    points: 0,
    registrations: 0,
    competitions_won: 0
  });
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [clubStats, setClubStats] = useState({
    referrals: 0,
    battles: 0,
    totalNeeded: 50,
    nextTier: "Silver"
  });
  const [recentActivity, setRecentActivity] = useState<{ 
    message: string, 
    time: string, 
    type?: string 
  }[]>([]);
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch profile directly (no nested .profile)
        const profile = await authService.getCurrentUser();

        setParticipant(prev => ({
          ...prev,
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name}`,
          first_name: profile.first_name,
          last_name: profile.last_name,
          tier: profile.tier || 'Basic',
          photo: profile.photo_url || '/placeholder.svg',
          photo_url: profile.photo_url || '/placeholder.svg',
          school: profile.school || '',
          grade: profile.grade || '',
          interests: profile.interests || '',
          achievements: profile.achievements || '',
          points: profile.points || 0,
          registrations: profile.registrations || 0,
          competitions_won: profile.competitions_won || 0,
          participant_code: profile.participant_code || ''
        }));

        // Fetch other dashboard data in parallel
        const [registrationsResponse, certificatesResponse, invoicesResponse, clubStatsResponse, activityResponse] = await Promise.all([
          apiService.getStudentRegistrations(),
          apiService.getStudentCertificates(),
          apiService.getStudentInvoices(),
          apiService.getStudentClubStats(),
          apiService.getStudentActivity()
        ]);

        if (registrationsResponse.success) setRegistrations(registrationsResponse.registrations || []);
        if (certificatesResponse.success) setCertificates(certificatesResponse.certificates || []);
        if (invoicesResponse.success) setInvoices(invoicesResponse.invoices || []);
        if (clubStatsResponse.success) setClubStats(prev => ({ ...prev, ...clubStatsResponse.stats }));
        if (activityResponse.success) setRecentActivity(activityResponse.activities || []);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Could not load some dashboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                {loading ? (
                  <div className="w-20 h-20 rounded-full bg-background/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <img 
                      src={participant.photo} 
                      alt={participant.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                    />
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          setUploadingPhoto(true);
                          const response = await apiService.updateStudentPhoto(file);
                          if (response.success && response.photo_url) {
                            setParticipant(prev => ({ ...prev, photo: response.photo_url }));
                            toast({ title: "Success", description: "Profile photo updated successfully" });
                          }
                        } catch (error) {
                          console.error("Error uploading photo:", error);
                          toast({ title: "Error", description: "Could not upload photo. Please try again.", variant: "destructive" });
                        } finally {
                          setUploadingPhoto(false);
                        }
                      }}
                    />
                    <button 
                      className="absolute -bottom-1 -right-1 glass-card p-2 rounded-full disabled:opacity-50"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                      ) : (
                        <Camera className="w-4 h-4 text-foreground" />
                      )}
                    </button>
                  </>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">
                  {participant.name || 'No Name Loaded'}
                </h1>
                <p className="text-muted-foreground">Participant ID: {participant.participant_code}</p>
                <Badge className="mt-2 bg-secondary-orange/20 text-secondary-orange">
                  {participant.tier} Member
                </Badge>
              </div>
            </div>
          </div>

          {/* ...rest of the dashboard (registrations, club stats, activity, sidebar) unchanged */}


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
                    <option key={reg.id} value={reg.id}>
                      {reg.competition_name} — {reg.status}
                    </option>
                  ))}
                </select>
                
                {registrations.filter(r => r.id === selectedRegistration).map(reg => (
                  <div key={reg.id} className="glass p-4 rounded-base">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{reg.competition_name}</h3>
                        <p className="text-sm text-muted-foreground">Competition Date: {reg.date}</p>
                        <Badge className={`mt-2 ${reg.status === 'Confirmed' ? 'bg-success/20 text-success' : reg.status === 'Pending Payment' ? 'bg-secondary-orange/20 text-secondary-orange' : 'bg-muted/20 text-muted-foreground'}`}>
                          {reg.status}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        {reg.status === "Confirmed" && reg.receipt_path && (
                          <GlassButton variant="ghost" size="sm" onClick={() => downloadReceipt(reg.receipt_path)}>
                            <Download className="w-4 h-4" />
                            Download Receipt
                          </GlassButton>
                        )}
                        
                      <div className="flex space-x-2"></div>
                        {reg.status === "Pending Payment" && (
                          <GlassButton variant="ghost" size="sm" onClick={() => handlePayment(reg.id)}>
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </GlassButton>
                        )}
                      </div>
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
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 glass rounded-base"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{activity.message}</span>

                      {/* Optional type badge */}
                      {activity.type && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            activity.type === "payment_completed"
                              ? "bg-green-500/20 text-green-600"
                              : activity.type === "registration_created"
                              ? "bg-blue-500/20 text-blue-600"
                              : "bg-muted/20 text-muted-foreground"
                          }`}
                        >
                          {activity.type.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>

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

            {/* Payments */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payments
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                {invoices
                  .filter(inv => inv.status === "completed") // ✅ Only show completed
                  .map((inv, index) => (
                    <div key={index} className="glass p-3 rounded-base">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">
                            Invoice #{inv.id}
                          </h4>
                          <p className="text-xs text-muted-foreground">{inv.created_at}</p>
                          <p className="font-semibold text-primary">{inv.amount}</p>

                          {/* Status Badge */}
                          <Badge className="mt-2 bg-success/20 text-success">
                            Completed
                          </Badge>
                        </div>

                        <div className="flex space-x-2">
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadReceipt(inv.id)}
                          >
                            <Download className="w-4 h-4" />
                            Download Receipt
                          </GlassButton>
                        </div>
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
                <GlassButton variant="ghost" size="sm" className="w-full justify-start"
                  onClick={async () => {
                    try {
                      await authService.logout(); // or your logout function
                      window.location.href = "/login"; // redirect to login page
                    } catch (error) {
                      console.error("Logout failed:", error);
                    }
                  }}
                >
                  <User className="w-4 h-4" />
                  Logout
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