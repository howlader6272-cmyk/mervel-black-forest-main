import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

const emailSchema = z.string().trim().email("সঠিক ইমেইল দিন");
const passwordSchema = z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast.error(emailResult.error.errors[0].message);
      return;
    }
    const passResult = passwordSchema.safeParse(password);
    if (!passResult.success) {
      toast.error(passResult.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
          } else if (error.message.includes("Email not confirmed")) {
            toast.error("আগে আপনার ইমেইল verify করুন");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("লগইন সফল!");
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("অ্যাকাউন্ট তৈরি হয়েছে! ইমেইল verify করুন।");
          setIsLogin(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-accent tracking-wider">MERVEL</h1>
          <p className="text-muted-foreground text-sm mt-2 tracking-wider uppercase">
            {isLogin ? "Welcome Back" : "Create Account"}
          </p>
        </div>

        <div className="bg-card/60 border border-accent/15 rounded-sm p-6 sm:p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input border border-accent/10 rounded-sm px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-shimmer w-full bg-accent text-accent-foreground py-3 text-sm uppercase tracking-[0.2em] font-bold hover:bg-accent/90 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground hover:text-accent transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-accent transition-colors text-xs uppercase tracking-wider"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
