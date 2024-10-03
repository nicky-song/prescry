// Copyright 2022 Prescryptive Health, Inc.

import { sign } from 'jsonwebtoken';

interface IAutomationTokenPayload {
  phoneNumber: string;
  code: string;
  name: string;
}

export const generateAutomationToken = (
  automationTokenPayload: IAutomationTokenPayload
) => {
  const jwtTokenSecretKey = process.env.JWT_TOKEN_SECRET_KEY;

  if (jwtTokenSecretKey === undefined) return;

  return sign(automationTokenPayload, jwtTokenSecretKey, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES_IN || 36000,
  });
};
