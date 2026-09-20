export interface ApiResponse<T = unknown> {
  status: string;
  message: string;
  data: T;
}

export type ErrorCode =
  | 'bad_request'
  | 'invalid_email'
  | 'invalid_token'
  | 'invalid_code'
  | 'invalid_provider'
  | 'user_not_found'
  | 'customer_profile_not_found'
  | 'unauthenticated'
  | 'internal_error'
  | string;

export interface ApiErrorResponse {
  status: string;
  message: string;
  data: ErrorCode;
}
