import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type { CustomerProfileResponse } from '../types/customerTypes';

export const customerProfileService = {
  getMyProfile: async (): Promise<CustomerProfileResponse> => {
    const response = await httpRequest.get<ApiResponse<CustomerProfileResponse>>(
      '/customer-profile/my-profile'
    );
    return response.data.data;
  },
};
