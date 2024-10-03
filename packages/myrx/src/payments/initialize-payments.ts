// Copyright 2022 Prescryptive Health, Inc.

import { GuestExperiencePayments } from '@phx/common/src/experiences/guest-experience/guest-experience-payments';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';
import { IPaymentsConfig } from '@phx/common/src/experiences/guest-experience/guest-experience-config';

export const environments = new Map<string, Promise<Stripe | null>>();

export const initializePayments = (config: IPaymentsConfig) => {
  environments.set(config.publicKey, loadStripe(config.publicKey));
  environments.set(config.testPublicKey, loadStripe(config.testPublicKey));

  GuestExperiencePayments.redirectToCheckout = async (
    options: ICheckoutSessionInfo
  ): Promise<void> => {
    const stripe = await environments.get(options.publicKey);
    if (!stripe) {
      throw Error(`Unable to initialize payments: ${options.publicKey}`);
    }
    const redirect = await stripe.redirectToCheckout({
      sessionId: options.sessionId,
    });
    if (redirect?.error) {
      throw Error(redirect?.error.message || 'Payment error');
    }
  };
};
