// Copyright 2018 Prescryptive Health, Inc.

export interface IJwtTokenPayload {
  identifier: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isPhoneNumberVerified: boolean;
  exp?: number;
  isTokenAuthenticated: boolean;
}
