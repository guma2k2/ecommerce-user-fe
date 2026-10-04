'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button, SelectItem } from '@/components/ui';
import { FormInput, FormSelect } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useSignUp } from '../hooks/useSignUp';
import { signUpSchema, type SignUpFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';
import { SocialLoginButtons } from './SocialLoginButtons';

export function SignUpForm() {
  const { mutate: signUp, isPending, error } = useSignUp();

  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      language: 'EN',
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    signUp({
      name: values.name,
      email: values.email,
      password: values.password,
      language: values.language,
    });
  };

  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    (error ? 'Registration failed. Please check your information.' : null);

  return (
    <AuthCardWrapper
      title="Create an Account"
      description="Join our marketplace to discover exclusive products and deals"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref={ROUTES.AUTH.LOGIN}
    >
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <FormInput
          control={control}
          name="name"
          label="Full Name"
          placeholder="Jane Doe"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="email"
          label="Email address"
          type="email"
          placeholder="customer@example.com"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 special..."
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          disabled={isPending}
        />

        <FormSelect
          control={control}
          name="language"
          label="Preferred Language"
          disabled={isPending}
        >
          <SelectItem value="EN">English (EN)</SelectItem>
          <SelectItem value="VI">Tiếng Việt (VI)</SelectItem>
        </FormSelect>

        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <SocialLoginButtons />
    </AuthCardWrapper>
  );
}
