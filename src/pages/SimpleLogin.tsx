import { useState, FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { authService } from "@/services/authService";
import { useAuth } from "@/stores/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { UserType } from "@/types/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state (added userType)
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    userType: 'participant' as UserType // explicitly type as UserType
  });

  const { login, register, loginWithGoogle, loginWithMicrosoft, isLoading, error, clearError } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(loginData.email, loginData.password, rememberMe);
      
      if (!response || !response.user) {
        throw new Error('Login failed');
      }
      
      // Get status from user object
      const status = response.user?.status ?? 'active';

      // If the account is pending approval
      if (status !== 'active') {
        toast({
          title: "Account Pending",
          description: "Your account is pending approval. We'll notify you when it's active.",
          variant: "default"
        });
        navigate('/account/pending');
        return;
      }

      // Navigate to dashboard by default for now
      navigate('/dashboard');
    } catch (err) {
      const msg = (err as Error)?.message ?? 'Login failed';
      toast({
        title: "Login Failed",
        description: msg,
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match",
        variant: "destructive"
      });
      return;
    }

    if (!signupData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms of Service and Privacy Policy",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await authService.register({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone,
        userType: signupData.userType
      });

      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }

      toast({
        title: "Account Created",
        description: "Your account has been created successfully. Please log in.",
        variant: "default"
      });

      // Clear form data
      setSignupData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        userType: 'participant'
      });

      // Switch to login tab
      (document.querySelector('[data-value="login"]') as HTMLButtonElement)?.click();
    } catch (err) {
      console.error('Registration error:', err);
      const msg = (err as any)?.message ?? 'Failed to create account';
      toast({
        title: "Registration Failed",
        description: msg,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to SCMC</h1>
              <p className="text-muted-foreground">Access your account or create a new one</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-card mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary/20">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary/20">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your.email@example.com"
                        className="pl-10 glass-card border-white/10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 glass-card border-white/10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm">
                      <input 
                        type="checkbox" 
                        className="rounded border-white/20 bg-transparent"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <GlassButton 
                    type="submit" 
                    className="w-full" 
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </GlassButton>

                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button 
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => {
                          clearError();
                          (document.querySelector('[data-value="signup"]') as HTMLButtonElement)?.click();
                        }}
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="firstName" 
                          placeholder="John"
                          className="pl-10 glass-card border-white/10"
                          value={signupData.firstName}
                          onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe"
                        className="glass-card border-white/10"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* User Type Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="userType">I am a</Label>
                    <select
                      id="userType"
                      value={signupData.userType}
                      onChange={(e) => setSignupData({ ...signupData, userType: e.target.value as UserType })}
                      className="w-full p-2 rounded glass-card border-white/10"
                      required
                    >
                      <option value="participant">Student / Participant</option>
                      <option value="coach">Coach / Teacher</option>
                      <option value="sponsor">Sponsor / Partner</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Choose the account type. Coaches and Sponsors will be reviewed before getting access.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signupEmail" 
                        type="email" 
                        placeholder="your.email@example.com"
                        className="pl-10 glass-card border-white/10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+234 xxx xxx xxxx"
                        className="pl-10 glass-card border-white/10"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signupPassword" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 glass-card border-white/10"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 glass-card border-white/10"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/20 bg-transparent"
                      checked={signupData.acceptTerms}
                      onChange={(e) => setSignupData({ ...signupData, acceptTerms: e.target.checked })}
                      required
                    />
                    <span className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <button type="button" className="text-primary hover:underline" onClick={() => window.open('/terms', '_blank')}>
                        Terms of Service
                      </button>
                      {" "}and{" "}
                      <button type="button" className="text-primary hover:underline" onClick={() => window.open('/privacy', '_blank')}>
                        Privacy Policy
                      </button>
                    </span>
                  </div>

                  <GlassButton 
                    type="submit" 
                    className="w-full" 
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </GlassButton>

                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button 
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => {
                          clearError();
                          (document.querySelector('[data-value="login"]') as HTMLButtonElement)?.click();
                        }}
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-4">Or continue with</p>
                <div className="grid grid-cols-2 gap-3">
                  <GlassButton 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const response = await authService.googleLogin('YOUR-GOOGLE-TOKEN');
                        if (response.success) {
                          navigate('/dashboard');
                        }
                      } catch (error) {
                        toast({
                          title: "Google Login Failed",
                          description: (error as Error)?.message ?? 'Failed to login with Google',
                          variant: "destructive"
                        });
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Google'
                    )}
                  </GlassButton>
                  <GlassButton 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const response = await authService.microsoftLogin('YOUR-MICROSOFT-TOKEN');
                        if (response.success) {
                          navigate('/dashboard');
                        }
                      } catch (error) {
                        toast({
                          title: "Microsoft Login Failed",
                          description: (error as Error)?.message ?? 'Failed to login with Microsoft',
                          variant: "destructive"
                        });
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Microsoft'
                    )}
                  </GlassButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
