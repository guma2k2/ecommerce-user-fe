'use client';

import React from 'react';
import Link from 'next/link';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { useCustomerProfile } from '@/features/auth';

export default function ProfilePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const { data: profile, isLoading, error } = useCustomerProfile();

  if (isInitializing || (isAuthenticated && isLoading)) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="animate-pulse p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-muted rounded" />
              <div className="h-4 w-60 bg-muted rounded" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view and manage your customer profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button className="w-full">Sign In to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Profile Error</CardTitle>
            <CardDescription>
              Unable to load your profile at this time. Please try refreshing.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>
        <p className="text-muted-foreground text-sm">
          View your personal information and account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Overview</CardTitle>
          <CardDescription>Details retrieved securely from your customer record</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar
              src={profile?.avatar}
              alt={profile?.name || 'Customer'}
              fallback={profile?.name?.[0] || 'U'}
              className="size-20 border-2 border-primary/20"
            />
            <div>
              <h2 className="text-xl font-bold text-foreground">{profile?.name}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <span className="inline-flex items-center mt-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Customer Account
              </span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">User ID</span>
              <p className="font-mono text-xs text-foreground truncate">{profile?.userId}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Email</span>
              <p className="font-medium text-foreground">{profile?.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Full Name</span>
              <p className="font-medium text-foreground">{profile?.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Gender</span>
              <p className="font-medium text-foreground capitalize">
                {profile?.gender ? profile.gender.toLowerCase() : 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
