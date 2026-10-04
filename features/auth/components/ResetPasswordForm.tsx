'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button } from '@/components/ui';
import { FormInput } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useResetPassword } from '../hooks/useResetPassword';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const { control, handleSubmit, register } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword({
      token: values.token || token,
      password: values.password,
    });
  };

  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || (error ? 'Failed to reset password. The link may have expired.' : null);

  if (!token) {
    return (
      <AuthCardWrapper
        title="Invalid Reset Link"
        description="The password reset link is missing a valid token."
        footerText="Need a new link?"
        footerLinkText="Request reset"
        footerLinkHref={ROUTES.AUTH.FORGOT_PASSWORD}
      >
        <Alert variant="destructive">
          <AlertDescription>
            No reset token was found in the URL. Please request a new password reset link.
          </AlertDescription>
        </Alert>
      </AuthCardWrapper>
    );
  }

  return (
    <AuthCardWrapper
      title="Reset Password"
      description="Create a strong, unique new password for your account"
      footerText="Back to"
      footerLinkText="Sign in"
      footerLinkHref={ROUTES.AUTH.LOGIN}
    >
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden token field - not rendered as a visible form control */}
        <input type="hidden" {...register('token')} value={token} />

        <FormInput
          control={control}
          name="password"
          label="New Password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 special..."
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your new password"
          disabled={isPending}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Updating password...' : 'Reset Password'}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}
