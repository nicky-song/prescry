// Copyright 2020 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { getStripeContext } from './stripe-context';
import { IProductPaymentInfo } from '@phx/common/src/models/api-response/create-booking-response';

export async function getCheckoutProductPaymentInfo(
  productPriceId: string,
  configuration: IConfiguration,
  useTestPayment?: boolean
): Promise<IProductPaymentInfo> {
  const stripe = getStripeContext(configuration, useTestPayment);
  const price = await stripe.prices.retrieve(productPriceId);
  const productPrice: IProductPaymentInfo = {
    isPriceActive: price.active,
    productPriceId,
    publicKey: useTestPayment
      ? configuration.testPaymentsKeyPublic
      : configuration.paymentsKeyPublic,
    unitAmount: price.unit_amount,
    unitAmountDecimal: price.unit_amount_decimal,
    isTestPayment: useTestPayment,
  };
  return productPrice;
}
