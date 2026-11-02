'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, Button } from '@/components/ui';
import { FormInput } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { useResendVerification } from '../hooks/useResendVerification';
import { getVerifyOtpSchema, type VerifyOtpFormValues } from '../validator';
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
    resolver: zodResolver(getVerifyOtpSchema(t)),
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

  const onSubmit = (values: VerifyOtpFormValues) => {
    verifyEmail({ code: values.code });
  };

  const handleResend = () => {
    if (!email || resendCooldown > 0 || isResending) return;

    setResendSuccess(false);
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

  const errorMessage =
    (verifyError as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || (verifyError ? t('verifyEmail.errorFallback') : null);

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
          <AlertDescription>
            {t('verifyEmail.resendSuccess')}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={control}
          name="code"
          label={t('fields.otpCode')}
          placeholder="000000"
          maxLength={6}
          disabled={isVerifying}
        />

        <Button type="submit" className="w-full" disabled={isVerifying}>
          {isVerifying
            ? t('verifyEmail.submitting')
            : t('verifyEmail.submit')}
        </Button>
      </form>

      {email && (
        <div className="text-center text-xs text-muted-foreground pt-2">
          <span>{t('verifyEmail.didNotReceive')} </span>
          <Button
            type="button"
            variant="link"
            size="unstyled"
            disabled={resendCooldown > 0 || isResending}
            onClick={handleResend}
            className="text-primary hover:underline font-medium text-xs disabled:opacity-50"
          >
            {isResending
              ? t('verifyEmail.sending')
              : resendCooldown > 0
                ? t('verifyEmail.resendIn', { seconds: resendCooldown })
                : t('verifyEmail.resendCode')}
          </Button>
        </div>
      )}
    </AuthCardWrapper>
  );
}
