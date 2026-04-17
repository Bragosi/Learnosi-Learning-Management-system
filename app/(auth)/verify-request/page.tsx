"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VerifyRequest() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const [otp, setOtp] = useState("");
  const [otpPending, startOtpTransition] = useTransition();
  const isOtpComplete = otp.length === 6;
  
  async function handleVerifyOtp() {
    startOtpTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification successful");
            router.push("/");
          },
          onError: () => {
            toast.error("Error verifying OTP");
          },
        },
      });
    });
  }

  return (
<Card className="w-full max-w-md mx-auto shadow-xl border rounded-2xl">
  <CardHeader className="text-center space-y-2">
    <CardTitle className="text-2xl font-semibold tracking-tight">
      Check your email
    </CardTitle>

    <CardDescription className="text-sm text-muted-foreground leading-relaxed">
      We’ve sent a 6-digit verification code to your email.  
      Enter it below to continue.
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-8">
    {/* OTP Section */}
    <div className="flex flex-col items-center space-y-3">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        className="gap-"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0}  />
          <InputOTPSlot index={1}  />
          <InputOTPSlot index={2} />
        </InputOTPGroup>

        <InputOTPGroup>
          <InputOTPSlot index={3}  />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5}  />
        </InputOTPGroup>
      </InputOTP>

      <p className="text-xs text-muted-foreground">
        Enter the 6-digit code sent to your inbox
      </p>
    </div>

    {/* Button */}
    <Button
      disabled={otpPending || !isOtpComplete}
      onClick={handleVerifyOtp}
      className="w-full h-11 text-base font-medium transition-all"
    >
      {otpPending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span>Verifying...</span>
        </div>
      ) : (
        "Verify OTP"
      )}
    </Button>
  </CardContent>
</Card>
  );
}
