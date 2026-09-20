export type SupportedLanguage = 'EN' | 'VI';

export type SocialProvider = 'google' | 'facebook' | 'github';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  language: SupportedLanguage;
}

export interface VerifyOtpRequest {
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
  console?: 'STOREFRONT';
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface OutboundRequest {
  code: string;
  state: string;
  registrationId: SocialProvider;
}

export interface AuthTokens {
  accessToken: string;
}
