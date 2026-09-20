'use client';

import React, { useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { useSocialLogin, type SocialProvider } from '@/features/auth';

interface CallbackPageProps {
  params: Promise<{ provider: string }>;
}

export default function OAuthCallbackPage({ params }: CallbackPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const provider = resolvedParams.provider as SocialProvider;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const { completeOutboundAuth, isCompleting, outboundError } = useSocialLogin();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (code && state && provider && !hasTriggered.current) {
      hasTriggered.current = true;
      completeOutboundAuth({
        code,
        state,
        registrationId: provider,
      });
    }
  }, [code, state, provider, completeOutboundAuth]);

  const errorMessage =
    (outboundError as { response?: { data?: { message?: string } } })?.response
      ?.data?.message ||
    (outboundError
      ? 'Social authentication failed. Please try signing in with your email.'
      : null);

  if (errorMessage) {
    return (
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-xl text-destructive font-semibold">
            Authentication Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button className="w-full">Return to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg text-center p-6">
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <div>
          <h2 className="text-lg font-semibold">Completing Social Sign In</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your account with{' '}
            <span className="capitalize font-medium text-foreground">{provider}</span>...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
