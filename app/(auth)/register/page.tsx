import type { Metadata } from 'next';
import { SignUpForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Create Account | Storefront',
  description: 'Register a new Storefront customer account.',
};

export default function RegisterPage() {
  return <SignUpForm />;
}
