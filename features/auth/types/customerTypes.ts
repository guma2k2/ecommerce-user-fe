export type Gender = 'MALE' | 'FEMALE';

export interface CustomerProfile {
  userId: string;
  email: string;
  name: string;
  gender: Gender | null;
  avatar: string | null;
}

export type CustomerProfileResponse = CustomerProfile;
