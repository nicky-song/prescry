// Copyright 2018 Prescryptive Health, Inc.

import { GuestExperiencePayments } from './guest-experience-payments';
import { ICheckoutSessionInfo } from '../../models/api-response/create-booking-response';

describe('GuestExperiencePayments', () => {
  it('if not implemented during web app initialization, then it should return error', async () => {
    await expect(() =>
      GuestExperiencePayments.redirectToCheckout({
        sessionId: 'session',
        publicKey: 'xx',
      } as ICheckoutSessionInfo)
    ).rejects.toThrow('<MISSING>');
  });
});
