import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type {
  AuthTokens,
  ForgotPasswordRequest,
  OutboundRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  SocialProvider,
  VerifyOtpRequest,
  ResendVerificationRequest,
} from '../types/authTypes';

export const authService = {
  signIn: async (payload: SignInRequest): Promise<AuthTokens> => {
    const response = await httpRequest.post<ApiResponse<AuthTokens>>(
      '/auth/public/sign-in',
      payload
    );
    return response.data.data;
  },

  signUp: async (payload: SignUpRequest): Promise<void> => {
    await httpRequest.post<ApiResponse<null>>('/auth/public/sign-up', payload);
  },

  verifyEmail: async (payload: VerifyOtpRequest): Promise<void> => {
    await httpRequest.post<ApiResponse<null>>('/auth/verify', payload);
  },

  resendVerification: async (payload: ResendVerificationRequest): Promise<void> => {
    await httpRequest.post<ApiResponse<null>>('/auth/send-verification', payload);
  },

  getSocialAuthUrl: async (provider: SocialProvider): Promise<string> => {
    const response = await httpRequest.get<ApiResponse<string>>(
      `/auth/public/social-login/${provider}`
    );
    return response.data.data;
  },

  completeOutboundAuth: async (payload: OutboundRequest): Promise<AuthTokens> => {
    const response = await httpRequest.post<ApiResponse<AuthTokens>>(
      '/auth/public/outbound',
      payload
    );
    return response.data.data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<void> => {
    await httpRequest.post<ApiResponse<null>>('/auth/public/forgot-password', {
      ...payload,
      console: payload.console || 'STOREFRONT',
    });
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    await httpRequest.post<ApiResponse<null>>('/auth/public/reset-password', payload);
  },

  refreshToken: async (): Promise<string> => {
    const response = await httpRequest.post<ApiResponse<string | { accessToken?: string }>>(
      '/auth/public/refresh'
    );

    if (response.data.status !== '200') {
      throw new Error(response.data.message || 'Refresh token failed');
    }

    const data = response.data.data;
    let token = '';

    if (typeof data === 'string' && (data.includes('.') || data.length > 30)) {
      token = data;
    } else if (data && typeof data === 'object' && 'accessToken' in data && data.accessToken) {
      token = data.accessToken;
    }

    if (!token) {
      throw new Error('Refresh token response missing access token');
    }

    return token;
  },


  signOut: async (): Promise<void> => {
    await httpRequest.post<ApiResponse<null>>('/auth/sign-out');
  },
};
