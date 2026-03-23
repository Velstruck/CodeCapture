"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge";
import { useUser } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (isLogin) {
      const { data, error } = await insforge.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      const { data, error } = await insforge.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (data?.requireEmailVerification) {
        window.location.href = `/verify?email=${encodeURIComponent(email)}`;
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  if (loading) return null; // or a spinner

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-background">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          CodeCapture
        </h1>
        <p className="text-lg text-muted-foreground w-[90%] md:w-[600px] mx-auto">
          Your personal, AI-enhanced Stack Overflow. Store, search, and understand your reusable code seamlessly.
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Sign in to access your snippets." : "Sign up to start saving snippets."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full">
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
