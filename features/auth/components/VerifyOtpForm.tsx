'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button } from '@/components/ui';
import { FormInput } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { useResendVerification } from '../hooks/useResendVerification';
import { verifyOtpSchema, type VerifyOtpFormValues } from '../validator';
import { AuthCardWrapper } from './AuthCardWrapper';

export function VerifyOtpForm() {
  const { t } = useTranslation('auth');
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { mutate: verifyEmail, isPending: isVerifying, error: verifyError } = useVerifyEmail();
  const { mutate: resendCode, isPending: isResending } = useResendVerification();

  const { control, handleSubmit } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = () => {
    if (!email || resendCooldown > 0 || isResending) return;
    resendCode(
      { email },
      {
        onSuccess: () => {
          setResendSuccess(true);
          setResendCooldown(60);
        },
      }
    );
  };

  const onSubmit = (values: VerifyOtpFormValues) => {
    verifyEmail({ code: values.code });
  };

  const errorMessage =
    (verifyError as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || (verifyError ? t('verifyEmail.errorFallback') : null);

  const resendLabel = resendCooldown > 0
    ? t('verifyEmail.resendIn', { seconds: resendCooldown })
    : isResending
      ? t('verifyEmail.sending')
      : t('verifyEmail.resendCode');

  return (
    <AuthCardWrapper
      title={t('verifyEmail.title')}
      description={
        email
          ? t('verifyEmail.subtitle', { email })
          : t('verifyEmail.subtitleFallback')
      }
      footerText={t('verifyEmail.backTo')}
      footerLinkText={t('verifyEmail.backLink')}
      footerLinkHref={ROUTES.AUTH.LOGIN}
    >
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {resendSuccess && (
        <Alert variant="success">
          <AlertDescription>{t('verifyEmail.resendSuccess')}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={control}
          name="code"
          label={t('fields.otpCode')}
          placeholder="123456"
          maxLength={6}
          className="text-center text-xl tracking-widest font-mono"
          disabled={isVerifying}
        />

        <Button type="submit" disabled={isVerifying} className="w-full">
          {isVerifying ? t('verifyEmail.submitting') : t('verifyEmail.submit')}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          {t('verifyEmail.didNotReceive')}{' '}
          <Button
            type="button"
            variant="link"
            size="sm"
            disabled={resendCooldown > 0 || isResending}
            onClick={handleResend}
            className="p-0 h-auto text-xs font-semibold text-primary"
          >
            {resendLabel}
          </Button>
        </p>
      </div>
    </AuthCardWrapper>
  );
}
