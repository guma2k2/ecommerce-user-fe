import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyOtpForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Verify Email | Storefront',
  description: 'Enter your 6-digit verification code to complete your registration.',
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading verification...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
