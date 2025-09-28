import { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Mail, 
  Eye, 
  Edit, 
  Shield, 
  ShieldCheck,
  MoreHorizontal,
  Plus,
  School as SchoolIcon,
  Users,
  UserCheck,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Phone,
  Globe,
  MapPin,
  Calendar
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const SchoolsManager = () => {
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const schools = [
    {
      id: '1',
      logo: '/placeholder-logo.jpg',
      name: 'Royal Academy Lagos',
      state: 'Lagos',
      region: 'Southwest',
      levels: ['Primary', 'JSS', 'SSS'],
      coachCount: 3,
      studentCount: 450,
      verified: true,
      website: 'www.royalacademy.edu.ng',
      email: 'info@royalacademy.edu.ng',
      phone: '+234 801 234 5678',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      logo: '/placeholder-logo.jpg',
      name: 'Greenwood College',
      state: 'Ogun',
      region: 'Southwest',
      levels: ['JSS', 'SSS'],
      coachCount: 2,
      studentCount: 280,
      verified: false,
      website: 'www.greenwood.edu.ng',
      email: 'admin@greenwood.edu.ng',
      phone: '+234 803 456 7890',
      lastActive: '1 day ago'
    },
    {
      id: '3',
      logo: '/placeholder-logo.jpg',
      name: 'Federal Government College Kaduna',
      state: 'Kaduna',
      region: 'Northwest',
      levels: ['JSS', 'SSS'],
      coachCount: 5,
      studentCount: 680,
      verified: true,
      website: 'www.fgckaduna.edu.ng',
      email: 'contact@fgckaduna.edu.ng',
      phone: '+234 805 123 4567',
      lastActive: '3 hours ago'
    }
  ];

  const kpis = [
    { label: 'Total Schools', value: '1,247', trend: '+25', icon: SchoolIcon },
    { label: 'Verified Schools', value: '892', trend: '+12', icon: ShieldCheck },
    { label: 'Active Coaches', value: '2,456', trend: '+48', icon: UserCheck },
    { label: 'Registered This Month', value: '58', trend: '+25', icon: Calendar }
  ];

  const regions = [
    'Southwest', 'South-South', 'Southeast', 'North Central', 'Northwest', 'Northeast'
  ];

  const handleSelectAll = () => {
    if (selectedSchools.length === schools.length) {
      setSelectedSchools([]);
    } else {
      setSelectedSchools(schools.map(s => s.id));
    }
  };

  const handleSelectSchool = (schoolId: string) => {
    setSelectedSchools(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge className="bg-success/20 text-success">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge className="bg-secondary-orange/20 text-secondary-orange">
        <Shield className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const getLevelsBadges = (levels: string[]) => {
    return levels.map((level, idx) => (
      <Badge key={idx} variant="outline" className="text-xs">
        {level}
      </Badge>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schools Manager</h1>
          <p className="text-muted-foreground">Manage school registrations and verification</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <GlassButton variant="secondary" size="sm">
                <Upload className="w-4 h-4" />
                Import Schools
              </GlassButton>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Import Schools</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drop CSV file here or click to browse</p>
                  <Button variant="outline" className="mt-2">Download Sample CSV</Button>
                </div>
                <GlassButton className="w-full">Upload & Preview</GlassButton>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <GlassButton variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Add School
              </GlassButton>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Add New School</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="School Name" />
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="ogun">Ogun</SelectItem>
                      <SelectItem value="kaduna">Kaduna</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region.toLowerCase()}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="Email" type="email" />
                <Input placeholder="Phone" />
                <Input placeholder="Website" />
                <div className="flex gap-2 pt-4">
                  <GlassButton variant="primary" className="flex-1">Create School</GlassButton>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <GlassCard key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-success">+{kpi.trend} this month</p>
              </div>
              <kpi.icon className="h-6 w-6 text-primary" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, state, contact..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="ogun">Ogun</SelectItem>
                <SelectItem value="kaduna">Kaduna</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region.toLowerCase()}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <GlassButton variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Bulk Actions */}
      {selectedSchools.length > 0 && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedSchools.length} school{selectedSchools.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <GlassButton variant="secondary" size="sm">
                    <ShieldCheck className="w-4 h-4" />
                    Bulk Verify
                  </GlassButton>
                </DialogTrigger>
                <DialogContent className="glass-card">
                  <DialogHeader>
                    <DialogTitle>Bulk Verify Schools</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You are about to verify {selectedSchools.length} school(s). Please provide a reason for verification.
                    </p>
                    <Textarea placeholder="Verification reason..." />
                    <div className="flex gap-2">
                      <GlassButton variant="primary" className="flex-1">Verify Schools</GlassButton>
                      <Button variant="outline" className="flex-1">Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <GlassButton variant="secondary" size="sm">
                <Download className="w-4 h-4" />
                Export Selected
              </GlassButton>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSchools([])}
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Showing {schools.length} of 1,247 schools
        </span>
      </div>

      {/* Schools List */}
      <GlassCard className="p-0">
        {viewMode === 'table' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSchools.length === schools.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>School</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Levels</TableHead>
                <TableHead>Coaches</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSchools.includes(school.id)}
                      onCheckedChange={() => handleSelectSchool(school.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <SchoolIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{school.name}</p>
                        <p className="text-xs text-muted-foreground">{school.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{school.state}</p>
                      <p className="text-xs text-muted-foreground">{school.region}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {getLevelsBadges(school.levels)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{school.coachCount}</TableCell>
                  <TableCell className="text-center">{school.studentCount}</TableCell>
                  <TableCell>{getVerificationBadge(school.verified)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="glass-card w-full sm:max-w-3xl">
                          <SheetHeader>
                            <SheetTitle>School Profile</SheetTitle>
                          </SheetHeader>
                          <SchoolDetailView school={school} />
                        </SheetContent>
                      </Sheet>
                      
                      {!school.verified && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ShieldCheck className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-card">
                            <DialogHeader>
                              <DialogTitle>Verify School</DialogTitle>
                            </DialogHeader>
                            <VerificationModal school={school} />
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {schools.map((school) => (
              <GlassCard key={school.id} className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Checkbox
                    checked={selectedSchools.includes(school.id)}
                    onCheckedChange={() => handleSelectSchool(school.id)}
                  />
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <SchoolIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{school.name}</h3>
                    {getVerificationBadge(school.verified)}
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{school.state}, {school.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs">{school.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs">{school.phone}</span>
                  </div>
                  {school.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">{school.website}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1 mt-3 mb-4">
                  {getLevelsBadges(school.levels)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{school.coachCount}</p>
                    <p className="text-xs text-muted-foreground">Coaches</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{school.studentCount}</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="glass-card w-full sm:max-w-3xl">
                      <SheetHeader>
                        <SheetTitle>School Profile</SheetTitle>
                      </SheetHeader>
                      <SchoolDetailView school={school} />
                    </SheetContent>
                  </Sheet>
                  
                  {!school.verified && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <ShieldCheck className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card">
                        <DialogHeader>
                          <DialogTitle>Verify School</DialogTitle>
                        </DialogHeader>
                        <VerificationModal school={school} />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Page 1 of 52
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

// School Detail View Component
const SchoolDetailView = ({ school }: { school: any }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
          <SchoolIcon className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{school.name}</h2>
          <div className="flex gap-2 mt-1">
            {getVerificationBadge(school.verified)}
            <Badge variant="outline">{school.region}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <GlassButton variant="secondary" size="sm">
            <Mail className="w-4 h-4" />
            Contact
          </GlassButton>
          <GlassButton variant="secondary" size="sm">
            <Edit className="w-4 h-4" />
            Edit
          </GlassButton>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Contact Email</label>
                <Input value={school.email} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input value={school.phone} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Website</label>
                <Input value={school.website} readOnly />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">State</label>
                <Input value={school.state} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Region</label>
                <Input value={school.region} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Levels Taught</label>
                <div className="flex gap-1 mt-2">
                  {getLevelsBadges(school.levels)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <GlassCard className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{school.studentCount}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{school.coachCount}</p>
              <p className="text-sm text-muted-foreground">Certified Coaches</p>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">245</p>
              <p className="text-sm text-muted-foreground">Competitions Entered</p>
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="coaches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">School Coaches</h3>
            <Dialog>
              <DialogTrigger asChild>
                <GlassButton size="sm">
                  <Plus className="w-4 h-4" />
                  Invite Coach
                </GlassButton>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle>Invite Coach</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Coach Email" type="email" />
                  <Textarea placeholder="Personal message (optional)" />
                  <GlassButton className="w-full">Send Invitation</GlassButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-3">
            <GlassCard className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">AO</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mrs. Adunni Oluwaseun</p>
                    <p className="text-sm text-muted-foreground">Mathematics & Science Coach</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-success/20 text-success">Certified</Badge>
                  <Button variant="outline" size="sm">View Profile</Button>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">TE</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mr. Tunde Emeka</p>
                    <p className="text-sm text-muted-foreground">English & Literature Coach</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-secondary-orange/20 text-secondary-orange">Pending</Badge>
                  <Button variant="outline" size="sm">Approve</Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="registrations" className="space-y-4">
          <div className="space-y-3">
            <GlassCard className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">Mathematics Competition 2024</p>
                  <p className="text-sm text-muted-foreground">85 students registered</p>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">Science Competition 2024</p>
                  <p className="text-sm text-muted-foreground">67 students registered</p>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="space-y-3">
            <GlassCard className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">School Registration Certificate</p>
                    <p className="text-sm text-muted-foreground">Uploaded: March 10, 2024</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-success/20 text-success">Verified</Badge>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
              </div>
            </GlassCard>
            
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center">
              <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload additional documents</p>
              <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-2 border-primary/20 pl-4 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <p className="font-medium text-foreground">School Verified</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Verified by Admin • 2 hours ago
              </p>
            </div>
            
            <div className="border-l-2 border-primary/20 pl-4 py-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                <p className="font-medium text-foreground">New Coach Added</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Mrs. Adunni Oluwaseun joined as coach • 1 week ago
              </p>
            </div>
            
            <div className="border-l-2 border-primary/20 pl-4 py-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium text-foreground">Document Uploaded</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Registration certificate uploaded • 2 weeks ago
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Verification Modal Component
const VerificationModal = ({ school }: { school: any }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You are about to verify <strong>{school.name}</strong>. Please provide verification details.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Verification Reason</label>
          <Textarea placeholder="Documents reviewed and approved..." />
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground">Verification Evidence</label>
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center">
            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Upload supporting documents</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground">Verification Expiry (Optional)</label>
          <Input type="date" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="notify" />
          <label htmlFor="notify" className="text-sm text-foreground">
            Notify school contact via email
          </label>
        </div>
      </div>
      
      <div className="flex gap-2 pt-4">
        <GlassButton variant="primary" className="flex-1">
          <ShieldCheck className="w-4 h-4" />
          Verify School
        </GlassButton>
        <Button variant="outline" className="flex-1">Cancel</Button>
      </div>
    </div>
  );
};

function getVerificationBadge(verified: boolean) {
  return verified ? (
    <Badge className="bg-success/20 text-success">
      <ShieldCheck className="w-3 h-3 mr-1" />
      Verified
    </Badge>
  ) : (
    <Badge className="bg-secondary-orange/20 text-secondary-orange">
      <Shield className="w-3 h-3 mr-1" />
      Pending
    </Badge>
  );
}

function getLevelsBadges(levels: string[]) {
  return levels.map((level, idx) => (
    <Badge key={idx} variant="outline" className="text-xs">
      {level}
    </Badge>
  ));
}

export default SchoolsManager;