import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignInForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign In | Storefront',
  description: 'Sign in to access your Storefront account, orders, and wishlist.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading sign in...</div>}>
      <SignInForm />
    </Suspense>
  );
}
