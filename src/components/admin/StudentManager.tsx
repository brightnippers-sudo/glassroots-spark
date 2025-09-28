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
  ArrowUpDown
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
      lastActivity: '2 hours ago'
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
      lastActivity: '1 day ago'
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
                <SelectValue placeholder="School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                <SelectItem value="royal">Royal Academy</SelectItem>
                <SelectItem value="greenwood">Greenwood</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="jss">Junior Secondary</SelectItem>
                <SelectItem value="sss">Senior Secondary</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
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
                <TableHead>Competitions</TableHead>
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
                        <p className="text-xs text-muted-foreground">ID: {student.regId}</p>
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
                    <div className="flex gap-1 flex-wrap">
                      {student.competitions.map((comp, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
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
                    <span className="text-muted-foreground">Payment:</span>
                    {getPaymentStatusBadge(student.paymentStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Club:</span>
                    {getClubStatusBadge(student.clubStatus)}
                  </div>
                </div>
                
                <div className="flex gap-1 mt-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="glass-card w-full sm:max-w-2xl">
                      <SheetHeader>
                        <SheetTitle>Student Details</SheetTitle>
                      </SheetHeader>
                      <StudentDetailView student={student} />
                    </SheetContent>
                  </Sheet>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Page 1 of 1,035
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

// Student Detail View Component
const StudentDetailView = ({ student }: { student: any }) => {
  return (
    <div className="mt-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">First Name</label>
              <Input value={student.firstName} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <Input value={student.lastName} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input value="adaora.okwu@email.com" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Phone</label>
              <Input value="+234 801 234 5678" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">School</label>
              <Input value={student.school} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Class</label>
              <Input value={student.class} />
            </div>
          </div>
          <GlassButton>Save Changes</GlassButton>
        </TabsContent>
        
        <TabsContent value="registrations" className="space-y-4">
          <div className="space-y-3">
            {student.competitions.map((comp: string, idx: number) => (
              <GlassCard key={idx} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{comp} Competition 2024</p>
                    <p className="text-sm text-muted-foreground">Registered: March 15, 2024</p>
                  </div>
                  <div className="flex gap-2">
                    {getPaymentStatusBadge(student.paymentStatus)}
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <div className="space-y-3">
            <GlassCard className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">Registration Fee - Mathematics</p>
                  <p className="text-sm text-muted-foreground">March 15, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">₦15,000</p>
                  <Badge className="bg-success/20 text-success">Paid</Badge>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="certificates" className="space-y-4">
          <div className="space-y-3">
            <GlassCard className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">Participation Certificate</p>
                  <p className="text-sm text-muted-foreground">Mathematics Competition 2024</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Download</Button>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-2 border-primary/20 pl-4 py-2">
              <p className="font-medium text-foreground">Profile Updated</p>
              <p className="text-sm text-muted-foreground">
                Admin updated contact information • 2 hours ago
              </p>
            </div>
            <div className="border-l-2 border-primary/20 pl-4 py-2">
              <p className="font-medium text-foreground">Payment Received</p>
              <p className="text-sm text-muted-foreground">
                Registration fee payment confirmed • 1 week ago
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function getPaymentStatusBadge(status: string) {
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
}

export default StudentManager;