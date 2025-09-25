import { useState } from "react";
import { 
  Trophy, 
  Users, 
  Gift, 
  Plus, 
  Edit, 
  Star, 
  Search,
  TrendingUp,
  Award,
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClubControls = () => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data
  const overviewStats = {
    totalMembers: 12580,
    topAmbassadors: 45,
    pendingAdjustments: 7
  };

  const thresholds = {
    starter: 20,
    bronze: 50,
    silver: 100,
    gold: 200
  };

  const rewards = [
    {
      id: 1,
      title: "Free Competition Entry",
      description: "Waived registration fee for one competition",
      tier: "Starter",
      stock: "Unlimited",
      redeemed: 245
    },
    {
      id: 2,
      title: "SCMC T-Shirt",
      description: "Official SCMC branded t-shirt",
      tier: "Bronze",
      stock: 500,
      redeemed: 78
    },
    {
      id: 3,
      title: "Exclusive Masterclass",
      description: "Access to advanced problem-solving sessions",
      tier: "Silver",
      stock: "Unlimited",
      redeemed: 34
    },
    {
      id: 4,
      title: "Ambassador Role",
      description: "Official ambassador status and benefits",
      tier: "Gold",
      stock: 50,
      redeemed: 12
    }
  ];

  const ambassadors = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      referrals: 48,
      battles: 156,
      total: 204,
      tier: "Gold",
      featured: true
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com", 
      referrals: 92,
      battles: 67,
      total: 159,
      tier: "Silver",
      featured: false
    }
  ];

  const redemptionRequests = [
    {
      id: 1,
      user: "Sarah Johnson",
      email: "sarah@example.com",
      reward: "SCMC T-Shirt",
      tier: "Bronze",
      date: "2024-03-15",
      status: "Pending"
    },
    {
      id: 2,
      user: "David Wilson",
      email: "david@example.com",
      reward: "Free Competition Entry",
      tier: "Starter", 
      date: "2024-03-14",
      status: "Pending"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Club Controls</h1>
        <GlassButton variant="primary" onClick={() => setShowRewardModal(true)}>
          <Plus className="w-4 h-4" />
          Add Reward
        </GlassButton>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Club Members</p>
              <p className="text-2xl font-bold text-foreground">{overviewStats.totalMembers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Top Ambassadors</p>
              <p className="text-2xl font-bold text-foreground">{overviewStats.topAmbassadors}</p>
            </div>
            <Star className="h-8 w-8 text-primary" />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Adjustments</p>
              <p className="text-2xl font-bold text-foreground">{overviewStats.pendingAdjustments}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </GlassCard>
      </div>

      {/* Thresholds Configuration */}
      <GlassCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Tier Thresholds</h2>
            <GlassButton variant="secondary" size="sm">
              <Settings className="w-4 h-4" />
              Update Thresholds
            </GlassButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(thresholds).map(([tier, threshold]) => (
              <div key={tier} className="glass p-4 rounded-base text-center">
                <Trophy className={`w-8 h-8 mx-auto mb-3 ${
                  tier === 'gold' ? 'text-yellow-500' :
                  tier === 'silver' ? 'text-gray-400' :
                  tier === 'bronze' ? 'text-orange-500' :
                  'text-primary'
                }`} />
                <h3 className="font-semibold text-foreground capitalize">{tier}</h3>
                <p className="text-2xl font-bold text-primary">{threshold}</p>
                <p className="text-sm text-muted-foreground">wins/referrals</p>
                <GlassButton variant="ghost" size="sm" className="mt-3 w-full">
                  <Edit className="w-4 h-4" />
                  Edit
                </GlassButton>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Rewards Catalog */}
      <GlassCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Rewards Catalog</h2>
            <GlassButton variant="secondary" size="sm" onClick={() => setShowRewardModal(true)}>
              <Plus className="w-4 h-4" />
              Add Reward
            </GlassButton>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reward</TableHead>
                <TableHead>Tier Requirement</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Redeemed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{reward.title}</p>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      reward.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-500' :
                      reward.tier === 'Silver' ? 'bg-gray-500/20 text-gray-400' :
                      reward.tier === 'Bronze' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {reward.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {typeof reward.stock === 'number' ? reward.stock : reward.stock}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{reward.redeemed}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <GlassButton variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </GlassButton>
                      <GlassButton variant="ghost" size="sm">
                        <Gift className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>

      {/* Manual Adjustments */}
      <GlassCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Manual Adjustments</h2>
            <GlassButton variant="secondary" size="sm" onClick={() => setShowAdjustmentModal(true)}>
              <Plus className="w-4 h-4" />
              Make Adjustment
            </GlassButton>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users by name or email..." className="pl-10 glass-card border-white/10" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>Battles Won</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ambassadors.map((ambassador) => (
                <TableRow key={ambassador.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{ambassador.name}</p>
                      <p className="text-sm text-muted-foreground">{ambassador.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{ambassador.referrals}</TableCell>
                  <TableCell className="text-foreground">{ambassador.battles}</TableCell>
                  <TableCell className="font-semibold text-primary">{ambassador.total}</TableCell>
                  <TableCell>
                    <Badge className={`${
                      ambassador.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {ambassador.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ambassador.featured ? (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    ) : (
                      <Star className="w-4 h-4 text-muted" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <GlassButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(ambassador);
                          setShowAdjustmentModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </GlassButton>
                      <GlassButton variant="ghost" size="sm">
                        <Award className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>

      {/* Redemption Requests */}
      <GlassCard>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Redemption Requests</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptionRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{request.user}</p>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{request.reward}</TableCell>
                  <TableCell>
                    <Badge className="bg-primary/20 text-primary">{request.tier}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{request.date}</TableCell>
                  <TableCell>
                    <Badge className="bg-warning/20 text-warning">{request.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <GlassButton variant="primary" size="sm">
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </GlassButton>
                      <GlassButton variant="ghost" size="sm">
                        <XCircle className="w-4 h-4" />
                        Deny
                      </GlassButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>

      {/* Add Reward Modal */}
      <Dialog open={showRewardModal} onOpenChange={setShowRewardModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Reward</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reward-title">Reward Title</Label>
              <Input id="reward-title" placeholder="e.g., SCMC T-Shirt" className="glass-card border-white/10" />
            </div>
            <div>
              <Label htmlFor="reward-description">Description</Label>
              <Textarea 
                id="reward-description" 
                placeholder="Brief description of the reward"
                className="glass-card border-white/10"
              />
            </div>
            <div>
              <Label htmlFor="required-tier">Required Tier</Label>
              <Select>
                <SelectTrigger className="glass-card border-white/10">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock-limit">Stock Limit</Label>
              <Input 
                id="stock-limit" 
                type="number" 
                placeholder="Enter number or leave empty for unlimited" 
                className="glass-card border-white/10" 
              />
            </div>
            <div className="flex gap-3 pt-4">
              <GlassButton variant="primary" className="flex-1">
                Add Reward
              </GlassButton>
              <GlassButton variant="ghost" onClick={() => setShowRewardModal(false)}>
                Cancel
              </GlassButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Adjustment Modal */}
      <Dialog open={showAdjustmentModal} onOpenChange={setShowAdjustmentModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedUser ? `Adjust ${selectedUser.name}` : 'Manual Adjustment'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedUser && (
              <div>
                <Label htmlFor="user-search">Search User</Label>
                <Input 
                  id="user-search" 
                  placeholder="Enter user name or email" 
                  className="glass-card border-white/10" 
                />
              </div>
            )}
            
            {selectedUser && (
              <div className="glass p-4 rounded-base">
                <p className="font-medium text-foreground">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{selectedUser.referrals}</p>
                    <p className="text-xs text-muted-foreground">Referrals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{selectedUser.battles}</p>
                    <p className="text-xs text-muted-foreground">Battles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{selectedUser.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="referral-adjust">Referral Count</Label>
                <Input 
                  id="referral-adjust" 
                  type="number" 
                  placeholder={selectedUser ? selectedUser.referrals.toString() : "0"}
                  className="glass-card border-white/10" 
                />
              </div>
              <div>
                <Label htmlFor="battles-adjust">Battles Won</Label>
                <Input 
                  id="battles-adjust" 
                  type="number" 
                  placeholder={selectedUser ? selectedUser.battles.toString() : "0"}
                  className="glass-card border-white/10" 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="adjustment-reason">Reason for Adjustment</Label>
              <Textarea 
                id="adjustment-reason" 
                placeholder="Enter reason for this manual adjustment"
                className="glass-card border-white/10"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <GlassButton variant="primary" className="flex-1">
                Apply Adjustment
              </GlassButton>
              <GlassButton variant="ghost" onClick={() => {
                setShowAdjustmentModal(false);
                setSelectedUser(null);
              }}>
                Cancel
              </GlassButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClubControls;