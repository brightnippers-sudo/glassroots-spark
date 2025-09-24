import { useState } from "react";
import { Trophy, Users, Share2, Star, Target, Gift, Crown, Medal, Award } from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Club = () => {
  const [showShareModal, setShowShareModal] = useState(false);

  // Mock data
  const userStats = {
    referrals: 12,
    battles: 38,
    currentTier: "Bronze",
    totalPoints: 50,
    nextTier: "Silver",
    nextTierThreshold: 100
  };

  const tiers = [
    {
      name: "Starter",
      threshold: 20,
      color: "from-gray-400/20 to-gray-500/20",
      icon: Target,
      rewards: ["Digital Certificate", "Welcome Kit", "Basic Resources"]
    },
    {
      name: "Bronze", 
      threshold: 50,
      color: "from-amber-600/20 to-amber-700/20",
      icon: Medal,
      rewards: ["Free Competition Entry", "Bronze Badge", "Exclusive Webinars"]
    },
    {
      name: "Silver",
      threshold: 100, 
      color: "from-gray-300/20 to-gray-400/20",
      icon: Award,
      rewards: ["SCMC T-shirt", "Silver Badge", "Priority Support", "Mentorship Access"]
    },
    {
      name: "Gold",
      threshold: 200,
      color: "from-yellow-400/20 to-yellow-500/20", 
      icon: Crown,
      rewards: ["Gold Badge", "Ambassador Role", "Annual Gala Invitation", "Scholarship Opportunities"]
    }
  ];

  const topAmbassadors = [
    {
      rank: 1,
      name: "Adaeze Okonkwo",
      points: 245,
      tier: "Gold",
      photo: "/placeholder.svg"
    },
    {
      rank: 2,
      name: "Ibrahim Yusuf", 
      points: 198,
      tier: "Gold",
      photo: "/placeholder.svg"
    },
    {
      rank: 3,
      name: "Chioma Nwafor",
      points: 176,
      tier: "Silver", 
      photo: "/placeholder.svg"
    }
  ];

  const rewards = [
    {
      title: "Free Competition Entry",
      description: "Waive registration fees for any competition",
      tier: "Bronze",
      available: true
    },
    {
      title: "SCMC T-shirt",
      description: "Official merchandise with your name",
      tier: "Silver", 
      available: false
    },
    {
      title: "Exclusive Masterclass",
      description: "Access to advanced learning sessions",
      tier: "Silver",
      available: false
    },
    {
      title: "Ambassador Role",
      description: "Represent SCMC in your region",
      tier: "Gold",
      available: false
    }
  ];

  const currentTierIndex = tiers.findIndex(tier => tier.name === userStats.currentTier);
  const progressPercentage = (userStats.totalPoints / userStats.nextTierThreshold) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="w-12 h-12 text-secondary-orange" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Smarter Than 20 Club
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Earn membership by winning 1v1 battles and/or referring users using your quiz-engine referral code.
          </p>
          
          <div className="glass-card p-6 rounded-base max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span>Win 1v1 battles in quiz engine</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Refer friends using your code</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Earn points for each achievement</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary" />
                <span>Unlock exclusive rewards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-8">
        {/* User Progress */}
        <section>
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <Badge className={`mb-4 bg-gradient-to-r ${tiers[currentTierIndex]?.color} text-foreground text-lg px-4 py-2`}>
                {userStats.currentTier} Member
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Progress</h2>
              <p className="text-muted-foreground">Keep going to unlock the next tier!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass p-6 rounded-base text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{userStats.referrals}</div>
                <div className="text-sm text-muted-foreground">Referrals Made</div>
              </div>
              <div className="glass p-6 rounded-base text-center">
                <Trophy className="w-8 h-8 text-secondary-orange mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{userStats.battles}</div>
                <div className="text-sm text-muted-foreground">Battles Won</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progress to {userStats.nextTier}</span>
                <span className="text-sm text-foreground font-medium">
                  {userStats.totalPoints}/{userStats.nextTierThreshold} points
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            <div className="flex gap-3 justify-center">
              <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                <DialogTrigger asChild>
                  <GlassButton variant="primary">
                    <Share2 className="w-4 h-4" />
                    Share Referral Link
                  </GlassButton>
                </DialogTrigger>
                <DialogContent className="glass-card border border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Share Your Referral Link</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Your Referral Code</label>
                      <div className="glass-card border border-white/10 rounded-base p-3 bg-primary/10">
                        <code className="text-primary font-mono">SCMC-REF-{userStats.referrals.toString().padStart(4, '0')}</code>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Share via WhatsApp</label>
                      <div className="glass-card border border-white/10 rounded-base p-3">
                        <p className="text-sm text-muted-foreground mb-3">
                          🎯 Join me in the Scholars Cambridge Competition! Use my referral code SCMC-REF-{userStats.referrals.toString().padStart(4, '0')} to get started.
                        </p>
                        <GlassButton variant="secondary" className="w-full">
                          Share on WhatsApp
                        </GlassButton>
                      </div>
                    </div>
                    <GlassButton variant="ghost" className="w-full" onClick={() => setShowShareModal(false)}>
                      Close
                    </GlassButton>
                  </div>
                </DialogContent>
              </Dialog>
              <GlassButton variant="secondary">
                Practice Battles
              </GlassButton>
            </div>
          </GlassCard>
        </section>

        {/* Tier System */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Membership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <GlassCard key={tier.name} className={`p-6 ${index <= currentTierIndex ? 'ring-2 ring-primary/50' : ''}`}>
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center mx-auto mb-4`}>
                    <tier.icon className="w-8 h-8 text-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tier.threshold} points required</p>
                  
                  <div className="space-y-2">
                    {tier.rewards.map((reward, rewardIndex) => (
                      <div key={rewardIndex} className="text-xs text-muted-foreground bg-white/5 rounded-base p-2">
                        {reward}
                      </div>
                    ))}
                  </div>
                  
                  {index <= currentTierIndex && (
                    <Badge className="mt-4 bg-success/20 text-success">
                      Unlocked
                    </Badge>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Top Ambassadors */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Top Ambassadors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topAmbassadors.map((ambassador) => (
              <GlassCard key={ambassador.rank} className="p-6">
                <div className="text-center">
                  <div className="relative mb-4">
                    <img 
                      src={ambassador.photo} 
                      alt={ambassador.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-white/20"
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{ambassador.rank}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{ambassador.name}</h3>
                  <Badge className="mb-3 bg-secondary-orange/20 text-secondary-orange">
                    {ambassador.tier} Member
                  </Badge>
                  <div className="text-2xl font-bold text-primary">{ambassador.points}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Rewards Catalog */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Rewards Catalog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                    <Badge className={`${reward.available ? 'bg-success/20 text-success' : 'bg-muted/20 text-muted-foreground'}`}>
                      {reward.tier} Tier
                    </Badge>
                  </div>
                  <div className="ml-4">
                    <GlassButton 
                      variant={reward.available ? "primary" : "ghost"} 
                      size="sm"
                      disabled={!reward.available}
                    >
                      {reward.available ? "Claim" : "Locked"}
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Club;