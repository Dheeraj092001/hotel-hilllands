import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useAuthStore } from "../stores/authStore";
import { apiClient } from "../lib/api";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FormField } from "../components/ui/FormField";
import { toast } from "sonner";
import { Sparkles, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Register — Hotel Newlands Shimla";
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!agreed) {
      setError("Please accept the terms and privacy policy to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      await updateProfile(fbUser, { displayName: name });

      try {
        const res = await apiClient.post("/auth/register", {
          email,
          name,
          phone,
          firebaseUid: fbUser.uid,
        });

        if (res.data?.data?.user) {
          setUser(res.data.data.user);
        } else {
          setUser({
            id: fbUser.uid,
            firebaseUid: fbUser.uid,
            name,
            email,
            phone,
            role: "GUEST",
            permissions: [],
            isEmailVerified: fbUser.emailVerified,
          });
        }
      } catch {
        setUser({
          id: fbUser.uid,
          firebaseUid: fbUser.uid,
          name,
          email,
          phone,
          role: "GUEST",
          permissions: [],
          isEmailVerified: fbUser.emailVerified,
        });
      }

      toast.success("Account created successfully. Welcome to Hotel Newlands!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      let message = "Failed to create account. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "An account with this email already exists. Please sign in.";
      } else if (err.code === "auth/invalid-email") {
        message = "The email address is not valid.";
      } else if (err.code === "auth/weak-password") {
        message = "The password is too weak. Please use a stronger combination.";
      }
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      try {
        const idToken = await fbUser.getIdToken();
        const res = await apiClient.post("/auth/google", { idToken });
        if (res.data?.data?.user) {
          setUser(res.data.data.user);
        } else {
          setUser({
            id: fbUser.uid,
            firebaseUid: fbUser.uid,
            name: fbUser.displayName || "Valued Guest",
            email: fbUser.email || "",
            role: "GUEST",
            permissions: [],
            isEmailVerified: true,
          });
        }
      } catch {
        setUser({
          id: fbUser.uid,
          firebaseUid: fbUser.uid,
          name: fbUser.displayName || "Valued Guest",
          email: fbUser.email || "",
          role: "GUEST",
          permissions: [],
          isEmailVerified: true,
        });
      }

      toast.success("Signed in with Google successfully");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google authentication was not completed.");
        toast.error("Google registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-ivory flex items-center justify-center text-charcoal">
      <Container size="sm">
        <div className="bg-white p-8 sm:p-12 rounded-sm border border-black/8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/30 text-[#6B5A33] text-[10px] font-semibold tracking-widest uppercase mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Join The Newlands Circle</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
              Create Your Resident Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-stone mt-2 font-light">
              Enjoy members-only rates, seasonal previews, and personalized mountain itineraries.
            </p>
          </div>

          {error && (
            <div className="p-3.5 mb-6 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <FormField label="Full Name" required>
              <Input
                placeholder="e.g. Vikram Malhotra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Phone Number" required>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Confirm Password" required>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-muted-stone cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded text-deep-forest focus:ring-deep-forest mt-0.5"
                  required
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="text-deep-forest underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-deep-forest underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Register Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10" />
            </div>
            <span className="relative bg-white px-3 text-xs text-muted-stone uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-black/15 rounded-sm hover:bg-black/5 text-sm font-medium text-charcoal transition-colors focus:outline-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Sign In Link */}
          <p className="text-center text-xs text-muted-stone mt-8 pt-6 border-t border-black/8">
            Already have an account?{" "}
            <Link to="/login" className="text-deep-forest font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
