import { useState } from "react";
import { 
  Building2, 
  DollarSign, 
  Eye, 
  Edit, 
  BarChart3, 
  FileText, 
  Plus,
  Search,
  Filter,
  Download,
  Star,
  CheckCircle,
  Clock,
  Upload,
  TrendingUp
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SponsorsManager = () => {
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);

  // Mock data
  const sponsors = [
    {
      id: 1,
      name: "TechCorp Nigeria",
      package: "Gold",
      status: "Active",
      email: "partnerships@techcorp.ng",
      logo: "/placeholder.svg",
      deliverables: {
        social_posts: true,
        livestream_feature: true,
        school_activation: false,
        video_content: true
      },
      kpis: {
        registrations: 1250,
        schools: 45,
        impressions: 125000,
        clicks: 3200
      }
    },
    {
      id: 2,
      name: "EduFinance",
      package: "Silver",
      status: "Pending",
      email: "marketing@edufinance.com",
      logo: null,
      deliverables: {
        social_posts: false,
        livestream_feature: false,
        school_activation: false,
        video_content: false
      },
      kpis: {
        registrations: 0,
        schools: 0,
        impressions: 0,
        clicks: 0
      }
    }
  ];

  const packages = [
    {
      id: 1,
      title: "Gold Package",
      price: "₦2,500,000",
      deliverables: ["Social media campaigns", "Livestream features", "School activations", "Video content"],
      max_slots: 3
    },
    {
      id: 2,
      title: "Silver Package", 
      price: "₦1,500,000",
      deliverables: ["Social media mentions", "Results page recognition", "Newsletter features"],
      max_slots: 5
    },
    {
      id: 3,
      title: "Bronze Package",
      price: "₦750,000", 
      deliverables: ["Logo placement", "Website recognition"],
      max_slots: 10
    }
  ];

  const inquiries = [
    {
      id: 1,
      organization: "Nigerian Bank PLC",
      contact: "Sarah Adebayo",
      email: "sarah@nigerianbank.com",
      package: "Gold",
      budget: "₦2M - ₦3M",
      date: "2024-03-15",
      status: "New"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Sponsors Manager</h1>
        <div className="flex gap-3">
          <GlassButton variant="secondary" onClick={() => setShowPackageModal(true)}>
            <Plus className="w-4 h-4" />
            Add Package
          </GlassButton>
          <GlassButton variant="primary">
            <Plus className="w-4 h-4" />
            Add Sponsor
          </GlassButton>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sponsors</p>
              <p className="text-2xl font-bold text-foreground">8</p>
            </div>
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
              <p className="text-2xl font-bold text-foreground">6</p>
            </div>
            <Star className="h-8 w-8 text-primary" />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">₦12.5M</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Inquiries</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search sponsors..." className="pl-10 glass-card border-white/10" />
          </div>
          <Select>
            <SelectTrigger className="w-48 glass-card border-white/10">
              <SelectValue placeholder="Filter by package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Packages</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-48 glass-card border-white/10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Sponsors List */}
      <GlassCard>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Sponsors</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sponsor</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sponsors.map((sponsor) => (
                <TableRow key={sponsor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        {sponsor.logo ? (
                          <img src={sponsor.logo} alt={sponsor.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <Building2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">{sponsor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      sponsor.package === 'Gold' ? 'bg-yellow-500/20 text-yellow-500' :
                      sponsor.package === 'Silver' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-orange-500/20 text-orange-500'
                    }`}>
                      {sponsor.package}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      sponsor.status === 'Active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {sponsor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{sponsor.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {Object.entries(sponsor.deliverables).map(([key, completed]) => (
                        <div key={key} className={`w-3 h-3 rounded-full ${completed ? 'bg-success' : 'bg-muted'}`}></div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <GlassButton variant="ghost" size="sm" onClick={() => setSelectedSponsor(sponsor)}>
                        <Eye className="w-4 h-4" />
                      </GlassButton>
                      <GlassButton variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </GlassButton>
                      <GlassButton variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>

      {/* Sponsor Packages */}
      <GlassCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Sponsor Packages</h2>
            <GlassButton variant="secondary" size="sm" onClick={() => setShowPackageModal(true)}>
              <Plus className="w-4 h-4" />
              Add Package
            </GlassButton>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <GlassCard key={pkg.id} className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{pkg.title}</h3>
                <p className="text-2xl font-bold text-primary mb-4">{pkg.price}</p>
                <ul className="space-y-2 mb-4">
                  {pkg.deliverables.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mb-4">Max slots: {pkg.max_slots}</p>
                <GlassButton variant="ghost" size="sm" className="w-full">
                  <Edit className="w-4 h-4" />
                  Edit Package
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Sponsor Inquiries */}
      <GlassCard>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Sponsor Inquiries</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Package Interest</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium text-foreground">{inquiry.organization}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-foreground">{inquiry.contact}</p>
                      <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{inquiry.package}</TableCell>
                  <TableCell className="text-foreground">{inquiry.budget}</TableCell>
                  <TableCell className="text-muted-foreground">{inquiry.date}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-500/20 text-blue-500">{inquiry.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <GlassButton variant="primary" size="sm">
                        Convert to Sponsor
                      </GlassButton>
                      <GlassButton variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>

      {/* Sponsor Detail Modal */}
      {selectedSponsor && (
        <Dialog open={!!selectedSponsor} onOpenChange={() => setSelectedSponsor(null)}>
          <DialogContent className="max-w-4xl glass-card">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedSponsor.name} - Sponsor Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedSponsor.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedSponsor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Package:</span>
                    <Badge className="bg-yellow-500/20 text-yellow-500">{selectedSponsor.package}</Badge>
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Deliverables Progress</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedSponsor.deliverables).map(([key, completed]) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${completed ? 'bg-success' : 'bg-muted'} flex items-center justify-center`}>
                          {completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-foreground capitalize">{key.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPI Entry */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">KPI Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-base text-center">
                    <div className="text-2xl font-bold text-primary">{selectedSponsor.kpis.registrations}</div>
                    <div className="text-sm text-muted-foreground">Registrations</div>
                  </div>
                  <div className="glass p-4 rounded-base text-center">
                    <div className="text-2xl font-bold text-primary">{selectedSponsor.kpis.schools}</div>
                    <div className="text-sm text-muted-foreground">Schools</div>
                  </div>
                  <div className="glass p-4 rounded-base text-center">
                    <div className="text-2xl font-bold text-primary">{selectedSponsor.kpis.impressions.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Impressions</div>
                  </div>
                  <div className="glass p-4 rounded-base text-center">
                    <div className="text-2xl font-bold text-primary">{selectedSponsor.kpis.clicks}</div>
                    <div className="text-sm text-muted-foreground">Clicks</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="period-start">Period Start</Label>
                      <Input type="date" id="period-start" className="glass-card border-white/10" />
                    </div>
                    <div>
                      <Label htmlFor="period-end">Period End</Label>
                      <Input type="date" id="period-end" className="glass-card border-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="registrations">Registrations</Label>
                      <Input type="number" id="registrations" placeholder="0" className="glass-card border-white/10" />
                    </div>
                    <div>
                      <Label htmlFor="schools-activated">Schools Activated</Label>
                      <Input type="number" id="schools-activated" placeholder="0" className="glass-card border-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="impressions">Impressions</Label>
                      <Input type="number" id="impressions" placeholder="0" className="glass-card border-white/10" />
                    </div>
                    <div>
                      <Label htmlFor="clicks">Clicks</Label>
                      <Input type="number" id="clicks" placeholder="0" className="glass-card border-white/10" />
                    </div>
                  </div>
                  <GlassButton variant="primary" className="w-full">
                    <TrendingUp className="w-4 h-4" />
                    Update KPIs
                  </GlassButton>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-base">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-medium text-foreground">Sponsor Agreement</h4>
                  <p className="text-sm text-muted-foreground mb-3">Upload signed agreement</p>
                  <GlassButton variant="ghost" size="sm" className="w-full">
                    <Upload className="w-4 h-4" />
                    Upload
                  </GlassButton>
                </div>
                <div className="glass p-4 rounded-base">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-medium text-foreground">Invoice</h4>
                  <p className="text-sm text-muted-foreground mb-3">Generate invoice</p>
                  <GlassButton variant="ghost" size="sm" className="w-full">
                    <Download className="w-4 h-4" />
                    Generate
                  </GlassButton>
                </div>
                <div className="glass p-4 rounded-base">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-medium text-foreground">Media Assets</h4>
                  <p className="text-sm text-muted-foreground mb-3">Brand assets & logos</p>
                  <GlassButton variant="ghost" size="sm" className="w-full">
                    <Upload className="w-4 h-4" />
                    Upload
                  </GlassButton>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Package Modal */}
      <Dialog open={showPackageModal} onOpenChange={setShowPackageModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Sponsor Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="package-title">Package Title</Label>
              <Input id="package-title" placeholder="e.g., Gold Package" className="glass-card border-white/10" />
            </div>
            <div>
              <Label htmlFor="package-price">Price</Label>
              <Input id="package-price" placeholder="e.g., ₦2,500,000" className="glass-card border-white/10" />
            </div>
            <div>
              <Label htmlFor="deliverables">Deliverables (one per line)</Label>
              <Textarea 
                id="deliverables" 
                placeholder="Social media campaigns&#10;Livestream features&#10;School activations"
                className="glass-card border-white/10 min-h-24"
              />
            </div>
            <div>
              <Label htmlFor="max-slots">Maximum Slots</Label>
              <Input type="number" id="max-slots" placeholder="3" className="glass-card border-white/10" />
            </div>
            <div className="flex gap-3 pt-4">
              <GlassButton variant="primary" className="flex-1">
                Create Package
              </GlassButton>
              <GlassButton variant="ghost" onClick={() => setShowPackageModal(false)}>
                Cancel
              </GlassButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsManager;