// Copyright 2020 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { getStripeContext } from './stripe-context';
import {
  IProductPaymentInfo,
  ICheckoutSessionInfo,
} from '@phx/common/src/models/api-response/create-booking-response';

export async function getCheckoutSession(
  sessionId: string,
  configuration: IConfiguration,
  useTestPayment?: boolean
): Promise<ICheckoutSessionInfo> {
  const stripe = getStripeContext(configuration, useTestPayment);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const price = session.line_items?.data[0]?.price;
  if (price) {
    const productPrice: IProductPaymentInfo = {
      isPriceActive: price.active,
      productPriceId: price.id,
      publicKey: useTestPayment
        ? configuration.testPaymentsKeyPublic
        : configuration.paymentsKeyPublic,
      unitAmountDecimal: price.unit_amount_decimal,
      unitAmount: price.unit_amount,
      isTestPayment: useTestPayment,
    };
    if (session.client_reference_id) {
      const clientReferenceInfo = session.client_reference_id.split('_');
      const checkoutSession: ICheckoutSessionInfo = {
        ...productPrice,
        clientReferenceId: session.client_reference_id,
        sessionId: session.id,
        paymentStatus: session.payment_status,
        orderNumber:
          clientReferenceInfo.length > 1
            ? clientReferenceInfo[1]
            : clientReferenceInfo[0],
      };
      return checkoutSession;
    }
  }
  throw Error('PaymentCheckoutSessionIsInvalid');
}
