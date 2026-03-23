"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { insforge } from "@/lib/insforge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: verifyError } = await insforge.auth.verifyEmail({
      email,
      otp: code
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Account</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to your email. Please enter it below to complete signup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
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
            <label className="text-sm font-medium">Verification Code</label>
            <Input
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center flex-col gap-2">
        <Button variant="link" onClick={() => router.push("/")} className="text-sm text-muted-foreground">
          Back to login
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-background">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          CodeCapture
        </h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyPageContent />
      </Suspense>
    </div>
  );
}
