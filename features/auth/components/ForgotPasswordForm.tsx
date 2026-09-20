'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button, Input, Label } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { mutate: sendResetLink, isPending, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    sendResetLink(
      { email: values.email, console: 'STOREFRONT' },
      {
        onSuccess: () => {
          setSubmittedEmail(values.email);
        },
      }
    );
  };

  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || (error ? 'Failed to send reset link. User may not exist.' : null);

  if (submittedEmail) {
    return (
      <AuthCardWrapper
        title="Check Your Inbox"
        description={`We've dispatched a password reset link to ${submittedEmail}`}
        footerText="Remembered your password?"
        footerLinkText="Sign in"
        footerLinkHref={ROUTES.AUTH.LOGIN}
      >
        <Alert variant="success">
          <AlertDescription>
            Please check your email and click the link to reset your password. The link is valid for 5 minutes.
          </AlertDescription>
        </Alert>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setSubmittedEmail(null)}
        >
          Try another email
        </Button>
      </AuthCardWrapper>
    );
  }

  return (
    <AuthCardWrapper
      title="Forgot Password?"
      description="Enter your registered email address and we'll send you a password reset link"
      footerText="Remembered your password?"
      footerLinkText="Sign in"
      footerLinkHref={ROUTES.AUTH.LOGIN}
    >
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="customer@example.com"
            disabled={isPending}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Sending link...' : 'Send Reset Link'}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}
