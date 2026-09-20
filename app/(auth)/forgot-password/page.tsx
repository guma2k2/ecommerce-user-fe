import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Forgot Password | Storefront',
  description: 'Reset your Storefront password using your registered email.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
