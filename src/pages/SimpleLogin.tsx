import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

const SimpleLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-16 px-4 min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <GlassButton type="submit" className="w-full" variant="primary">
              Sign In
            </GlassButton>
          </form>
        </GlassCard>
      </div>
      <Footer />
    </div>
  );
};

export default SimpleLogin;