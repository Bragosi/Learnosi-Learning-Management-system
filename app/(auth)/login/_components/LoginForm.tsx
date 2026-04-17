"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import googleLogo from "@/public/google.svg"
export function LoginForm() {
  const router = useRouter();
  const [googlePending, startGoogleTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google, you will be redirected...");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Error sending email");
          },
        },
      });
    });
  }

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Google Button */}
          <Button
            disabled={googlePending}
            onClick={signInWithGoogle}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            {googlePending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Image src={googleLogo} alt="Google" width={20} height={20} />
                <span> Continue with Google </span>
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative text-center text-sm">
            <div className="absolute inset-0 top-1/2 border-t border-muted" />
            <span className="relative bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Email Form */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="m@example.com"
                className="focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            <Button
              onClick={signInWithEmail}
               disabled={emailPending || !email.trim()}
              className="w-full"
            >
              {emailPending ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Continue with Email</span>
                </>
              )}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <span className="underline cursor-pointer hover:text-primary">
              Sign up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
