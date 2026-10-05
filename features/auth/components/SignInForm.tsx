'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('auth');
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
    (error ? t('login.errorFallback') : null);

  return (
    <AuthCardWrapper
      title={t('login.title')}
      description={t('login.subtitle')}
      footerText={t('login.noAccount')}
      footerLinkText={t('login.registerLink')}
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
          label={t('fields.email')}
          type="email"
          placeholder={t('fields.emailPlaceholder')}
          autoComplete="email"
          disabled={isPending}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('fields.password')}</span>
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-xs text-primary hover:underline"
            >
              {t('login.forgotPassword')}
            </Link>
          </div>
          <FormInput
            control={control}
            name="password"
            type="password"
            placeholder={t('fields.passwordPlaceholder')}
            autoComplete="current-password"
            disabled={isPending}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t('login.submitting') : t('login.submit')}
        </Button>
      </form>

      <SocialLoginButtons />
    </AuthCardWrapper>
  );
}
