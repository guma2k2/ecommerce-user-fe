'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button, Input, Label } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { useResendVerification } from '../hooks/useResendVerification';
import { verifyOtpSchema, type VerifyOtpFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { mutate: verifyEmail, isPending: isVerifying, error: verifyError } = useVerifyEmail();
  const { mutate: resendCode, isPending: isResending } = useResendVerification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = () => {
    if (!email || resendCooldown > 0 || isResending) return;
    resendCode(
      { email },
      {
        onSuccess: () => {
          setResendSuccess(true);
          setResendCooldown(60);
        },
      }
    );
  };

  const onSubmit = (values: VerifyOtpFormValues) => {
    verifyEmail({ code: values.code });
  };

  const errorMessage =
    (verifyError as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || (verifyError ? 'Invalid or expired verification code.' : null);

  return (
    <AuthCardWrapper
      title="Verify Your Email"
      description={`Enter the 6-digit OTP code sent to ${email || 'your email'}`}
      footerText="Back to"
      footerLinkText="Sign in"
      footerLinkHref={ROUTES.AUTH.LOGIN}
    >
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {resendSuccess && (
        <Alert variant="success">
          <AlertDescription>A new verification code has been dispatched to your email.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="code">6-Digit Verification Code</Label>
          <Input
            id="code"
            placeholder="123456"
            maxLength={6}
            className="text-center text-xl tracking-widest font-mono"
            disabled={isVerifying}
            {...register('code')}
          />
          {errors.code && (
            <p className="text-xs text-destructive text-center">{errors.code.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isVerifying} className="w-full">
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive the email?{' '}
          <Button
            type="button"
            variant="link"
            size="sm"
            disabled={resendCooldown > 0 || isResending}
            onClick={handleResend}
            className="p-0 h-auto text-xs font-semibold text-primary"
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : isResending
                ? 'Sending...'
                : 'Resend Code'}
          </Button>
        </p>
      </div>
    </AuthCardWrapper>
  );
}
