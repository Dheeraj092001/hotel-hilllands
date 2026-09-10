import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FormField } from "../components/ui/FormField";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Reset Password — Hotel Newlands Shimla";
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
      toast.success("Password reset instructions dispatched to your email");
    } catch (err: any) {
      console.error("Password reset error:", err);
      let message = "Unable to process password reset. Please try again.";
      if (err.code === "auth/user-not-found") {
        message = "No account found with this email address.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-warm-ivory flex items-center justify-center text-charcoal">
      <Container size="sm">
        <div className="bg-white p-8 sm:p-12 rounded-sm border border-black/8 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-deep-forest/5 flex items-center justify-center text-deep-forest mx-auto mb-4">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-muted-stone mt-2 font-light">
              Enter your registered email address to receive a secure recovery link.
            </p>
          </div>

          {error && (
            <div className="p-3.5 mb-6 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-sm">
              {error}
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center p-6 bg-emerald-50 rounded-sm border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-display text-xl text-emerald-950 mb-2">Instructions Sent</h3>
              <p className="text-xs text-emerald-800 mb-6">
                Please check <strong className="font-semibold">{email}</strong> for instructions to reset your password.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <FormField label="Registered Email" required>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-stone hover:text-charcoal"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
