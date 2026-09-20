'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button, Input, Label } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { useResetPassword } from '../hooks/useResetPassword';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
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
        <input type="hidden" {...register('token')} value={token} />

        <div className="space-y-1.5">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 special..."
            disabled={isPending}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your new password"
            disabled={isPending}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Updating password...' : 'Reset Password'}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}
