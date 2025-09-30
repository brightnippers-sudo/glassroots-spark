import { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Mail, 
  Eye, 
  Edit, 
  UserCheck, 
  MoreHorizontal,
  Calendar,
  School,
  Award,
  Users,
  CheckSquare,
  X,
  Plus,
  ArrowUpDown,
  User,
  Camera
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const StudentManager = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const students = [
    {
      id: '1',
      avatar: '/placeholder-avatar.jpg',
      firstName: 'Adaora',
      lastName: 'Okwu',
      regId: 'SCMC2024001',
      school: 'Royal Academy Lagos',
      class: 'JSS 2',
      category: 'Junior Secondary',
      competitions: ['Mathematics', 'Science'],
      paymentStatus: 'paid',
      clubStatus: 'ambassador',
      lastActivity: '2 hours ago',
      tier: 'Silver',
      email: 'adaora.okwu@email.com',
      phone: '+234 901 234 5678'
    },
    {
      id: '2',
      avatar: '/placeholder-avatar.jpg',
      firstName: 'Kemi',
      lastName: 'Adeleke',
      regId: 'SCMC2024002',
      school: 'Greenwood College',
      class: 'SS 1',
      category: 'Senior Secondary',
      competitions: ['English', 'Literature'],
      paymentStatus: 'pending',
      clubStatus: 'member',
      lastActivity: '1 day ago',
      tier: 'Bronze',
      email: 'kemi.adeleke@email.com',
      phone: '+234 901 234 5679'
    },
    // Add more mock students...
  ];

  const kpis = [
    { label: 'Total Students', value: '25,847', trend: '+12%', icon: Users },
    { label: 'Registered This Month', value: '2,456', trend: '+8%', icon: Calendar },
    { label: 'Pending Payments', value: '1,234', trend: '-5%', icon: Award },
    { label: 'Certificates Issued', value: '18,420', trend: '+15%', icon: Award }
  ];

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success/20 text-success">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-secondary-orange/20 text-secondary-orange">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-destructive/20 text-destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClubStatusBadge = (status: string) => {
    switch (status) {
      case 'ambassador':
        return <Badge className="bg-primary/20 text-primary">Ambassador</Badge>;
      case 'member':
        return <Badge className="bg-muted/20 text-muted-foreground">Member</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Manager</h1>
          <p className="text-muted-foreground">Manage student registrations and profiles</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <GlassButton variant="secondary" size="sm">
                <Upload className="w-4 h-4" />
                Import CSV
              </GlassButton>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Import Students</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drop CSV file here or click to browse</p>
                </div>
                <GlassButton className="w-full">Upload & Preview</GlassButton>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <GlassButton variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Add Student
              </GlassButton>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Email" type="email" />
                <Input placeholder="Phone" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="royal">Royal Academy Lagos</SelectItem>
                    <SelectItem value="greenwood">Greenwood College</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 pt-4">
                  <GlassButton variant="primary" className="flex-1">Create Student</GlassButton>
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
                <p className="text-xs text-success">{kpi.trend}</p>
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
                placeholder="Search by name, email, registration ID, school..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <GlassButton variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <GlassButton variant="secondary" size="sm">
                <Download className="w-4 h-4" />
                Export Selected
              </GlassButton>
              <GlassButton variant="secondary" size="sm">
                <Mail className="w-4 h-4" />
                Send Email
              </GlassButton>
              <GlassButton variant="secondary" size="sm">
                <UserCheck className="w-4 h-4" />
                Mark as Paid
              </GlassButton>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedStudents([])}
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Table/Cards Toggle */}
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
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Showing {students.length} of 25,847 students
        </span>
      </div>

      {/* Student List */}
      <GlassCard className="p-0">
        {viewMode === 'table' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedStudents.length === students.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Registration ID</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Class/Category</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Club Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleSelectStudent(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{student.regId}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{student.class}</p>
                      <p className="text-xs text-muted-foreground">{student.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-secondary-orange/20 text-secondary-orange">
                      {student.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPaymentStatusBadge(student.paymentStatus)}</TableCell>
                  <TableCell>{getClubStatusBadge(student.clubStatus)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student.lastActivity}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="glass-card w-full sm:max-w-2xl">
                          <SheetHeader>
                            <SheetTitle>Student Details</SheetTitle>
                          </SheetHeader>
                          <StudentDetailView student={student} />
                        </SheetContent>
                      </Sheet>
                      
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {students.map((student) => (
              <GlassCard key={student.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleSelectStudent(student.id)}
                  />
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {student.firstName[0]}{student.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{student.regId}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">School:</span>
                    <span className="text-foreground">{student.school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Class:</span>
                    <span className="text-foreground">{student.class}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tier:</span>
                    <Badge className="bg-secondary-orange/20 text-secondary-orange">
                      {student.tier}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment:</span>
                    {getPaymentStatusBadge(student.paymentStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Club:</span>
                    {getClubStatusBadge(student.clubStatus)}
                  </div>
                </div>
                
                <div className="flex gap-1 mt-4 pt-3 border-t border-white/10">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="glass-card w-full sm:max-w-2xl">
                      <SheetHeader>
                        <SheetTitle>Student Details</SheetTitle>
                      </SheetHeader>
                      <StudentDetailView student={student} />
                    </SheetContent>
                  </Sheet>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// Enhanced Student Detail View Component
const StudentDetailView = ({ student }: { student: any }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(student.avatar);
  
  // Mock data for activity and payments
  const studentActivity = [
    { type: 'login', message: 'Student logged into dashboard', time: '2 hours ago', status: 'success' },
    { type: 'payment_completed', message: 'Payment of ₦5,000 completed for Mathematics Competition', time: '1 day ago', status: 'success' },
    { type: 'profile_update', message: 'Profile information updated', time: '2 days ago', status: 'info' },
    { type: 'registration', message: 'Registered for Science Competition', time: '3 days ago', status: 'info' },
    { type: 'certificate_issued', message: 'Certificate issued for English Competition', time: '1 week ago', status: 'success' }
  ];

  const studentPayments = [
    { id: 'P001', competition: 'Mathematics Competition', amount: '₦5,000', discount: '₦1,000', final: '₦4,000', status: 'completed', date: '2024-01-15', receipt: 'REC-001' },
    { id: 'P002', competition: 'Science Competition', amount: '₦6,000', discount: '₦500', final: '₦5,500', status: 'pending', date: '2024-01-20', receipt: null },
    { id: 'P003', competition: 'English Competition', amount: '₦4,500', discount: '₦0', final: '₦4,500', status: 'completed', date: '2024-01-10', receipt: 'REC-002' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return '🔐';
      case 'payment_completed': return '💰';
      case 'profile_update': return '👤';
      case 'registration': return '📝';
      case 'certificate_issued': return '🏆';
      default: return '📋';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/20 text-success">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-secondary-orange/20 text-secondary-orange">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-destructive/20 text-destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Student Header */}
      <div className="flex items-center gap-4 p-4 glass rounded-base">
        <div className="relative">
          <img 
            src={profilePhoto} 
            alt={`${student.firstName} ${student.lastName}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
          />
          {editMode && (
            <button className="absolute -bottom-1 -right-1 glass-card p-2 rounded-full">
              <Camera className="w-3 h-3 text-foreground" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">ID: {student.regId}</p>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-secondary-orange/20 text-secondary-orange">{student.tier}</Badge>
            <Badge className="bg-primary/20 text-primary">{student.clubStatus}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <GlassButton 
            variant={editMode ? "primary" : "secondary"} 
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            <Edit className="w-4 h-4" />
            {editMode ? 'Save' : 'Edit'}
          </GlassButton>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <GlassCard className="p-4">
        <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <GlassButton variant="ghost" size="sm" className="justify-start">
            <UserCheck className="w-4 h-4" />
            Reset Password
          </GlassButton>
          <GlassButton variant="ghost" size="sm" className="justify-start">
            <User className="w-4 h-4" />
            Impersonate Student
          </GlassButton>
          <GlassButton variant="ghost" size="sm" className="justify-start">
            <Mail className="w-4 h-4" />
            Send Message
          </GlassButton>
          <GlassButton variant="ghost" size="sm" className="justify-start">
            <X className="w-4 h-4" />
            Suspend Account
          </GlassButton>
        </div>
      </GlassCard>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-card">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">Profile</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20">Activity</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-primary/20">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <GlassCard className="p-4">
            <h4 className="font-semibold text-foreground mb-4">Student Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={student.firstName} 
                  disabled={!editMode}
                  className="glass-card border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={student.lastName} 
                  disabled={!editMode}
                  className="glass-card border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={student.email} 
                  disabled={!editMode}
                  className="glass-card border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={student.phone} 
                  disabled={!editMode}
                  className="glass-card border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="school">School</Label>
                <Input 
                  id="school" 
                  value={student.school} 
                  disabled={!editMode}
                  className="glass-card border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade/Class</Label>
                <Input 
                  id="grade" 
                  value={student.class} 
                  disabled={!editMode}
                  className="glass-card border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="tier">Tier</Label>
                <Select disabled={!editMode}>
                  <SelectTrigger className="glass-card border-white/10">
                    <SelectValue placeholder={student.tier || 'Basic'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="participantId">Participant ID</Label>
                <Input 
                  id="participantId" 
                  value={student.regId} 
                  disabled
                  className="glass-card border-white/10 bg-muted/10"
                />
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <GlassCard className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-foreground">Recent Activity</h4>
              <Select>
                <SelectTrigger className="w-32 glass-card border-white/10">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              {studentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 glass rounded-base">
                  <div className="text-lg">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      activity.type === 'payment_completed' ? 'bg-success/20 text-success' :
                      activity.type === 'login' ? 'bg-primary/20 text-primary' :
                      'bg-muted/20 text-muted-foreground'
                    }`}
                  >
                    {activity.type.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 mt-6">
          <GlassCard className="p-4">
            <h4 className="font-semibold text-foreground mb-4">Payment History</h4>
            <div className="space-y-3">
              {studentPayments.map((payment) => (
                <div key={payment.id} className="p-4 glass rounded-base">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-foreground">{payment.competition}</h5>
                      <p className="text-sm text-muted-foreground">Payment ID: {payment.id}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground line-through">{payment.amount}</p>
                      {payment.discount !== '₦0' && (
                        <p className="text-sm text-secondary-orange">Discount: {payment.discount}</p>
                      )}
                      <p className="font-semibold text-foreground">{payment.final}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    {getPaymentStatusBadge(payment.status)}
                    <div className="flex gap-2">
                      {payment.receipt && (
                        <GlassButton variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                          Receipt
                        </GlassButton>
                      )}
                      {payment.status === 'pending' && (
                        <GlassButton variant="secondary" size="sm">
                          <CheckSquare className="w-4 h-4" />
                          Mark Paid
                        </GlassButton>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentManager;