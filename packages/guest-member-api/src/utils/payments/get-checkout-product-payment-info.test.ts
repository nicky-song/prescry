// Copyright 2020 Prescryptive Health, Inc.

import { getStripeContext } from './stripe-context';
import { IConfiguration } from '../../configuration';
import Stripe from 'stripe';
import { IProductPaymentInfo } from '@phx/common/src/models/api-response/create-booking-response';
import { getCheckoutProductPaymentInfo } from './get-checkout-product-payment-info';

jest.mock('./stripe-context', () => ({
  getStripeContext: jest.fn(),
}));

const getStripeContextMock = getStripeContext as jest.Mock;

beforeEach(() => {
  getStripeContextMock.mockReset();
});

describe('getProductPaymentInfo', () => {
  it('should get product price configuration', async () => {
    const expected: IProductPaymentInfo = {
      isPriceActive: true,
      productPriceId: 'mock product',
      publicKey: 'mockpublic',
      unitAmount: 6543,
      unitAmountDecimal: '65.43',
      isTestPayment: undefined,
    };

    const config = {
      paymentsKeyPrivate: 'mockprivate',
      paymentsKeyPublic: 'mockpublic',
      testPaymentsKeyPrivate: 'mockprivatetest',
      testPaymentsKeyPublic: 'mockpublictest',
    } as IConfiguration;
    const price = {
      active: expected.isPriceActive,
      unit_amount: expected.unitAmount,
      unit_amount_decimal: expected.unitAmountDecimal,
    } as Stripe.Response<Stripe.Price>;
    const stripe = {
      prices: {} as Stripe.PricesResource,
    } as Stripe;

    stripe.prices.retrieve = jest.fn().mockResolvedValue(price);
    getStripeContextMock.mockReturnValue(stripe);

    const result = await getCheckoutProductPaymentInfo(
      expected.productPriceId,
      config
    );
    expect(result).toMatchObject(expected);
    expect(getStripeContextMock).toHaveBeenNthCalledWith(1, config, undefined);
    expect(stripe.prices.retrieve).toHaveBeenNthCalledWith(
      1,
      expected.productPriceId
    );
  });
  it('should get product price configuration and pass usetestPayment flag if needed', async () => {
    const expected: IProductPaymentInfo = {
      isPriceActive: true,
      productPriceId: 'mock product',
      publicKey: 'mockpublictest',
      unitAmount: 6543,
      unitAmountDecimal: '65.43',
      isTestPayment: true,
    };

    const config = {
      paymentsKeyPrivate: 'mockprivate',
      paymentsKeyPublic: 'mockpublic',
      testPaymentsKeyPrivate: 'mockprivatetest',
      testPaymentsKeyPublic: 'mockpublictest',
    } as IConfiguration;
    const price = {
      active: expected.isPriceActive,
      unit_amount: expected.unitAmount,
      unit_amount_decimal: expected.unitAmountDecimal,
    } as Stripe.Response<Stripe.Price>;
    const stripe = {
      prices: {} as Stripe.PricesResource,
    } as Stripe;

    stripe.prices.retrieve = jest.fn().mockResolvedValue(price);
    getStripeContextMock.mockReturnValue(stripe);

    const result = await getCheckoutProductPaymentInfo(
      expected.productPriceId,
      config,
      true
    );
    expect(result).toMatchObject(expected);
    expect(getStripeContextMock).toHaveBeenNthCalledWith(1, config, true);
    expect(stripe.prices.retrieve).toHaveBeenNthCalledWith(
      1,
      expected.productPriceId
    );
  });
});
