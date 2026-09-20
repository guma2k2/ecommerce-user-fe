import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Reset Password | Storefront',
  description: 'Enter your new password to regain access to your account.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading password reset...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
