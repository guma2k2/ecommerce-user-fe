import { z } from 'zod';
import type { TFunction } from 'i18next';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const getSignInSchema = (t?: TFunction<'auth'>) =>
  z.object({
    email: z
      .string()
      .min(1, t ? t('validation.emailRequired') : 'Email is required')
      .email(t ? t('validation.emailInvalid') : 'Invalid email address'),
    password: z
      .string()
      .min(1, t ? t('validation.passwordRequired') : 'Password is required'),
  });

export const getSignUpSchema = (t?: TFunction<'auth'>) =>
  z
    .object({
      name: z
        .string()
        .min(1, t ? t('validation.nameRequired') : 'Full name is required')
        .max(100, t ? t('validation.nameMax') : 'Name cannot exceed 100 characters'),
      email: z
        .string()
        .min(1, t ? t('validation.emailRequired') : 'Email is required')
        .email(t ? t('validation.emailInvalid') : 'Invalid email address'),
      password: z
        .string()
        .min(8, t ? t('validation.passwordMin') : 'Password must be at least 8 characters')
        .regex(
          passwordRegex,
          t
            ? t('validation.passwordRegex')
            : 'Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character'
        ),
      confirmPassword: z
        .string()
        .min(1, t ? t('validation.confirmPasswordRequired') : 'Please confirm your password'),
      language: z.enum(['EN', 'VI'], {
        message: t ? t('validation.languageInvalid') : 'Please select a valid language (EN or VI)',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t ? t('validation.passwordMismatch') : 'Passwords do not match',
      path: ['confirmPassword'],
    });

export const getVerifyOtpSchema = (t?: TFunction<'auth'>) =>
  z.object({
    code: z
      .string()
      .min(6, t ? t('validation.otpLength') : 'Verification code must be 6 digits')
      .max(6, t ? t('validation.otpLength') : 'Verification code must be 6 digits')
      .regex(/^\d{6}$/, t ? t('validation.otpDigitsOnly') : 'Code must contain only numbers'),
  });

export const getForgotPasswordSchema = (t?: TFunction<'auth'>) =>
  z.object({
    email: z
      .string()
      .min(1, t ? t('validation.emailRequired') : 'Email is required')
      .email(t ? t('validation.emailInvalid') : 'Invalid email address'),
  });

export const getResetPasswordSchema = (t?: TFunction<'auth'>) =>
  z
    .object({
      token: z.string().min(1, 'Reset token is required'),
      password: z
        .string()
        .min(8, t ? t('validation.passwordMin') : 'Password must be at least 8 characters')
        .regex(
          passwordRegex,
          t
            ? t('validation.passwordRegex')
            : 'Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character'
        ),
      confirmPassword: z
        .string()
        .min(1, t ? t('validation.confirmPasswordRequired') : 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t ? t('validation.passwordMismatch') : 'Passwords do not match',
      path: ['confirmPassword'],
    });

export const signInSchema = getSignInSchema();
export const signUpSchema = getSignUpSchema();
export const verifyOtpSchema = getVerifyOtpSchema();
export const forgotPasswordSchema = getForgotPasswordSchema();
export const resetPasswordSchema = getResetPasswordSchema();

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
