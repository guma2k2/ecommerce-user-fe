'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button } from '@/components/ui';
import { FormInput } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';

export function ForgotPasswordForm() {
  const { t } = useTranslation('auth');
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { mutate: sendResetLink, isPending, error } = useForgotPassword();

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
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
      ?.message || (error ? t('forgotPassword.errorFallback') : null);

  if (submittedEmail) {
    return (
      <AuthCardWrapper
        title={t('forgotPassword.inboxTitle')}
        description={t('forgotPassword.inboxSubtitle', { email: submittedEmail })}
        footerText={t('forgotPassword.backTo')}
        footerLinkText={t('forgotPassword.backLink')}
        footerLinkHref={ROUTES.AUTH.LOGIN}
      >
        <Alert variant="success">
          <AlertDescription>{t('forgotPassword.inboxMessage')}</AlertDescription>
        </Alert>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setSubmittedEmail(null)}
        >
          {t('forgotPassword.tryAnother')}
        </Button>
      </AuthCardWrapper>
    );
  }

  return (
    <AuthCardWrapper
      title={t('forgotPassword.title')}
      description={t('forgotPassword.subtitle')}
      footerText={t('forgotPassword.backTo')}
      footerLinkText={t('forgotPassword.backLink')}
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
          name="email"
          label={t('fields.email')}
          type="email"
          placeholder={t('fields.emailPlaceholder')}
          disabled={isPending}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}
