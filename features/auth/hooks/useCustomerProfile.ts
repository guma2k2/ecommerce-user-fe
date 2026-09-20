'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { customerProfileService } from '../services/customerProfileService';
import type { CustomerProfileResponse } from '../types/customerTypes';

export function useCustomerProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  const query = useQuery<CustomerProfileResponse>({
    queryKey: queryKeys.customer.profile(),
    queryFn: customerProfileService.getMyProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: (failureCount, error) => {
      // Don't retry on 401 or 400
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 400) return false;
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (query.data) {
      setUserProfile(query.data);
    }
  }, [query.data, setUserProfile]);

  return query;
}
