'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button } from '@/components/ui';
import { FormInput } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useSignIn } from '../hooks/useSignIn';
import { signInSchema, type SignInFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';
import { SocialLoginButtons } from './SocialLoginButtons';

export function SignInForm() {
  const { mutate: signIn, isPending, error } = useSignIn();

  const { control, handleSubmit } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    signIn(values);
  };

  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    (error ? 'Sign in failed. Please check your credentials.' : null);

  return (
    <AuthCardWrapper
      title="Welcome Back"
      description="Enter your email and password to access your account"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref={ROUTES.AUTH.REGISTER}
    >
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={control}
          name="email"
          label="Email address"
          type="email"
          placeholder="customer@example.com"
          autoComplete="email"
          disabled={isPending}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Password</span>
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <FormInput
            control={control}
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isPending}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <SocialLoginButtons />
    </AuthCardWrapper>
  );
}
