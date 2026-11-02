'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button, SelectItem } from '@/components/ui';
import { FormInput, FormSelect } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useSignUp } from '../hooks/useSignUp';
import { getSignUpSchema, type SignUpFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';
import { SocialLoginButtons } from './SocialLoginButtons';

export function SignUpForm() {
  const { t } = useTranslation('auth');
  const { mutate: signUp, isPending, error } = useSignUp();

  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(getSignUpSchema(t)),
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
    (error ? t('register.errorFallback') : null);

  return (
    <AuthCardWrapper
      title={t('register.title')}
      description={t('register.subtitle')}
      footerText={t('register.hasAccount')}
      footerLinkText={t('register.loginLink')}
      footerLinkHref={ROUTES.AUTH.LOGIN}
    >
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={control}
          name="name"
          label={t('fields.fullName')}
          placeholder={t('fields.fullNamePlaceholder')}
          autoComplete="name"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="email"
          label={t('fields.email')}
          type="email"
          placeholder={t('fields.emailPlaceholder')}
          autoComplete="email"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="password"
          label={t('fields.password')}
          type="password"
          placeholder={t('fields.passwordPlaceholder')}
          autoComplete="new-password"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="confirmPassword"
          label={t('fields.confirmPassword')}
          type="password"
          placeholder={t('fields.confirmPasswordPlaceholder')}
          autoComplete="new-password"
          disabled={isPending}
        />

        <FormSelect
          control={control}
          name="language"
          label={t('fields.preferredLanguage')}
          disabled={isPending}
        >
          <SelectItem value="EN">English</SelectItem>
          <SelectItem value="VI">Tiếng Việt</SelectItem>
        </FormSelect>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('register.submitting') : t('register.submit')}
        </Button>
      </form>

      <SocialLoginButtons />
    </AuthCardWrapper>
  );
}
