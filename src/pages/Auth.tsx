
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { getCurrentEnvironment } from "@/config/environment-config";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [envInfo, setEnvInfo] = useState({ env: '', url: '' });
  const navigate = useNavigate();

  // Get environment info for debugging
  useEffect(() => {
    const env = getCurrentEnvironment();
    const config = supabase.auth.getSession();
    
    setEnvInfo({
      env: env,
      url: window.location.hostname
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Auth attempt in environment:", envInfo.env);
      
      if (isSignUp) {
        console.log("Starting sign up with email:", email);
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Adding a redirect to to ensure proper URL handling in production
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Please check your email to verify your account",
        });
      } else {
        console.log("Starting sign in with email:", email);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        navigate("/");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085)', 
          filter: 'grayscale(30%) brightness(50%)' 
        }}
      />
      
      <div className="relative z-10 w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Software Obsolescence Manager
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your software lifecycle effectively
        </p>
      </div>
      
      <Card className="relative z-10 w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-white/70 dark:bg-black/70">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your email and create a password to get started"
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </div>
            
            {/* Small environment indicator for debugging - only visible in development */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="text-xs text-muted-foreground pt-4 border-t mt-4">
                <p>Environment: {envInfo.env}</p>
                <p>Host: {envInfo.url}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
