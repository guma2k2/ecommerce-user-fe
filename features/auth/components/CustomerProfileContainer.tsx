'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Typography,
} from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { useCustomerProfile } from '../hooks';

export function CustomerProfileContainer() {
  const { t } = useTranslation('auth');
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
            <CardTitle>{t('profile.signInRequiredTitle')}</CardTitle>
            <CardDescription>{t('profile.signInRequiredDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button className="w-full">{t('profile.signInBtn')}</Button>
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
            <CardTitle className="text-destructive">{t('profile.errorTitle')}</CardTitle>
            <CardDescription>{t('profile.errorDesc')}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Typography.H1 className="text-3xl font-bold">{t('profile.title')}</Typography.H1>
        <Typography.Muted className="text-sm">
          {t('profile.subtitle')}
        </Typography.Muted>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('profile.personalInfo')}</CardTitle>
          <CardDescription>{t('profile.personalInfoDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar
              src={profile?.avatar}
              alt={profile?.name || t('profile.customerRole')}
              fallback={profile?.name?.[0] || 'U'}
              className="size-20 border-2 border-primary/20"
            />
            <div>
              <Typography.H2 className="text-xl font-bold">{profile?.name}</Typography.H2>
              <Typography.Muted className="text-sm">{profile?.email}</Typography.Muted>
              <span className="inline-flex items-center mt-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {t('profile.customerRole')}
              </span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                {t('profile.userId')}
              </span>
              <p className="font-mono text-xs text-foreground truncate">{profile?.userId}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                {t('profile.emailAddress')}
              </span>
              <p className="font-medium text-foreground">{profile?.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                {t('profile.fullName')}
              </span>
              <p className="font-medium text-foreground">{profile?.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                {t('profile.gender')}
              </span>
              <p className="font-medium text-foreground capitalize">
                {profile?.gender ? profile.gender.toLowerCase() : t('profile.notSet')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

