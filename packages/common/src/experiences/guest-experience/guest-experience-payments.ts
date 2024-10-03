// Copyright 2018 Prescryptive Health, Inc.

import { ICheckoutSessionInfo } from '../../models/api-response/create-booking-response';

export interface IGuestExperiencePayments {
  redirectToCheckout(session: ICheckoutSessionInfo): Promise<void>;
}

export const GuestExperiencePayments: IGuestExperiencePayments = {
  // eslint-disable-next-line require-await
  redirectToCheckout: async (_session: ICheckoutSessionInfo): Promise<void> => {
    throw new Error('<MISSING>');
  },
};
