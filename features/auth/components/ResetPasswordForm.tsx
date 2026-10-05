'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('auth');
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
      ?.message || (error ? t('resetPassword.errorFallback') : null);

  if (!token) {
    return (
      <AuthCardWrapper
        title={t('resetPassword.invalidTitle')}
        description={t('resetPassword.invalidSubtitle')}
        footerText={t('resetPassword.needNewLink')}
        footerLinkText={t('resetPassword.requestReset')}
        footerLinkHref={ROUTES.AUTH.FORGOT_PASSWORD}
      >
        <Alert variant="destructive">
          <AlertDescription>{t('resetPassword.invalidMessage')}</AlertDescription>
        </Alert>
      </AuthCardWrapper>
    );
  }

  return (
    <AuthCardWrapper
      title={t('resetPassword.title')}
      description={t('resetPassword.subtitle')}
      footerText={t('resetPassword.backTo')}
      footerLinkText={t('resetPassword.backLink')}
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
          label={t('fields.newPassword')}
          type="password"
          placeholder={t('fields.newPasswordPlaceholder')}
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="confirmPassword"
          label={t('fields.confirmPassword')}
          type="password"
          placeholder={t('fields.confirmNewPasswordPlaceholder')}
          disabled={isPending}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t('resetPassword.submitting') : t('resetPassword.submit')}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}
