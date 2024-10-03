// Copyright 2020 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { getStripeContext } from './stripe-context';
import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';
import { getCheckoutProductPaymentInfo } from './get-checkout-product-payment-info';
import { getCheckoutSessionRedirectUrls } from './get-checkout-session-redirect-urls';
import { CheckoutProductType } from '@phx/common/src/models/checkout/checkout-product-type';

export interface ICheckoutSessionRedirectUrls {
  success_url: string;
  cancel_url: string;
}

export async function createCheckoutSession(
  productId: string,
  productType: CheckoutProductType,
  orderNumber: string,
  baseUrl: string,
  configuration: IConfiguration,
  isTestPharmacy: boolean,
  operationId: string,
  switches?: string
): Promise<ICheckoutSessionInfo> {
  const stripe = getStripeContext(configuration, isTestPharmacy);
  const clientReferenceId = `${configuration.environment}_${orderNumber}`;
  const urls = getCheckoutSessionRedirectUrls(
    baseUrl,
    productType,
    orderNumber,
    operationId,
    switches
  );
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    submit_type: 'book',
    line_items: [
      {
        price: productId,
        quantity: 1,
      },
    ],
    client_reference_id: clientReferenceId,
    ...urls,
  });

  const productPayment = await getCheckoutProductPaymentInfo(
    productId,
    configuration,
    isTestPharmacy
  );

  return {
    ...productPayment,
    sessionId: session.id,
    paymentStatus: session.payment_status,
    clientReferenceId,
    orderNumber,
  };
}
