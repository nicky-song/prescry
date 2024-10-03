// Copyright 2020 Prescryptive Health, Inc.

import Stripe from 'stripe';
import { IConfiguration } from '../../configuration';

export interface IPaymentsContext {
  instance?: Stripe;
}

export function getStripeContext(
  config: IConfiguration,
  useTestPayment?: boolean
) {
  const paymentsKeyPrivate = useTestPayment
    ? config.testPaymentsKeyPrivate
    : config.paymentsKeyPrivate;
  return new Stripe(paymentsKeyPrivate, {
    apiVersion: '2020-08-27',
  });
}
