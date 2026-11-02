import type { Metadata } from 'next';
import { CustomerProfileContainer } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Customer Profile | Storefront',
  description: 'View and manage your customer account settings and personal details.',
};

export default function ProfilePage() {
  return <CustomerProfileContainer />;
}
