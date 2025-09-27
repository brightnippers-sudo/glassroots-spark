import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  School, 
  Award, 
  Calendar,
  FileText,
  CreditCard,
  Upload,
  MessageSquare,
  Star,
  Settings,
  Shield,
  UserCheck,
  Trophy,
  Mail,
  BookOpen
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import HomePageManager from "@/components/admin/homepage/HomePageManager";
import EventsManager from "@/components/admin/EventsManager";
import SponsorsManager from "@/components/admin/SponsorsManager";
import ClubControls from "@/components/admin/ClubControls";
import ResultsPublisher from "@/components/admin/ResultsPublisher";

const AdminKPICard = ({ title, value, icon: Icon, trend }: any) => (
  <GlassCard className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend && <p className="text-xs text-success mt-1">{trend}</p>}
      </div>
      <Icon className="h-8 w-8 text-primary" />
    </div>
  </GlassCard>
);

const AdminSidebar = ({ activeSection, setActiveSection }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'hero-editor', label: 'Hero/Content Editor', icon: FileText },
    { id: 'events', label: 'Events Manager', icon: Calendar },
    { id: 'registrations', label: 'Registrations & Contacts', icon: Users },
    { id: 'payments', label: 'Payments Ledger', icon: CreditCard },
    { id: 'resources', label: 'Resources Manager', icon: BookOpen },
    { id: 'testimonials', label: 'Testimonials Manager', icon: Star },
    { id: 'sponsors', label: 'Sponsors Manager', icon: Award },
    { id: 'club', label: 'Club Controls', icon: Trophy },
    { id: 'results', label: 'Results Publisher', icon: Upload },
    { id: 'certificates', label: 'Certificates Manager', icon: Shield },
    { id: 'messaging', label: 'Messaging', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen glass-card border-r border-white/10 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">SCMC Admin</h2>
        <p className="text-sm text-muted-foreground">Administrator Panel</p>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-base text-left transition-all ${
              activeSection === item.id 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const Dashboard = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminKPICard 
        title="Total Registrations" 
        value="25,847" 
        icon={Users}
        trend="+12% this month"
      />
      <AdminKPICard 
        title="Revenue (₦)" 
        value="₦45.2M" 
        icon={DollarSign}
        trend="+8% this month"
      />
      <AdminKPICard 
        title="Paid vs Pending" 
        value="18,420 / 7,427" 
        icon={CreditCard}
      />
      <AdminKPICard 
        title="Schools Activated" 
        value="1,247" 
        icon={School}
        trend="+25 new schools"
      />
      <AdminKPICard 
        title="Active Club Members" 
        value="12,580" 
        icon={UserCheck}
        trend="+450 this week"
      />
      <AdminKPICard 
        title="Sponsor Campaigns" 
        value="8 Live" 
        icon={Award}
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-base">
            <span className="text-sm text-foreground">New registration: John Doe</span>
            <span className="text-xs text-muted-foreground">2 mins ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-base">
            <span className="text-sm text-foreground">Payment verified: ₦15,000</span>
            <span className="text-xs text-muted-foreground">5 mins ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-base">
            <span className="text-sm text-foreground">New sponsor inquiry</span>
            <span className="text-xs text-muted-foreground">10 mins ago</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <GlassButton variant="primary" size="sm">
            <FileText className="w-4 h-4" />
            Export Data
          </GlassButton>
          <GlassButton variant="secondary" size="sm">
            <Mail className="w-4 h-4" />
            Send Broadcast
          </GlassButton>
          <GlassButton variant="ghost" size="sm">
            <Upload className="w-4 h-4" />
            Upload Results
          </GlassButton>
          <GlassButton variant="ghost" size="sm">
            <Shield className="w-4 h-4" />
            Generate Certificates
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  </div>
);


const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'hero-editor':
        return <HomePageManager />;
      case 'events':
        return <EventsManager />;
      case 'sponsors':
        return <SponsorsManager />;
      case 'club':
        return <ClubControls />;
      case 'results':
        return <ResultsPublisher />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">{activeSection.replace('-', ' ').toUpperCase()}</h2>
              <p className="text-muted-foreground">Content for this section coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;