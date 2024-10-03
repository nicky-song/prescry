// Copyright 2020 Prescryptive Health, Inc.

import { getStripeContext } from './stripe-context';
import { IConfiguration } from '../../configuration';
import Stripe from 'stripe';
import {
  createCheckoutSession,
  ICheckoutSessionRedirectUrls,
} from './create-checkout-session';
import {
  ICheckoutSessionInfo,
  IProductPaymentInfo,
} from '@phx/common/src/models/api-response/create-booking-response';

import { getCheckoutProductPaymentInfo } from './get-checkout-product-payment-info';
import { getCheckoutSessionRedirectUrls } from './get-checkout-session-redirect-urls';
import { CheckoutProductType } from '@phx/common/src/models/checkout/checkout-product-type';

jest.mock('./get-checkout-product-payment-info', () => ({
  getCheckoutProductPaymentInfo: jest.fn(),
}));
jest.mock('./get-checkout-session-redirect-urls', () => ({
  getCheckoutSessionRedirectUrls: jest.fn(),
}));

jest.mock('./stripe-context', () => ({
  getStripeContext: jest.fn(),
}));

const getStripeContextMock = getStripeContext as jest.Mock;
const getCheckoutProductPaymentInfoMock =
  getCheckoutProductPaymentInfo as jest.Mock;
const getCheckoutSessionRedirectUrlsMock =
  getCheckoutSessionRedirectUrls as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

const baseUrl = 'https://myrx.io';

interface ITestInput {
  isTestPharmacy: boolean;
  switches: string;
  productType: CheckoutProductType;
  operationId: string;
}

describe('createCheckoutSession', () => {
  it.each<ITestInput>([
    {
      isTestPharmacy: true,
      productType: 'appointment',
      operationId: 'operation-id',
      switches: 'f=test:1,test2:0',
    },
    {
      isTestPharmacy: false,
      productType: 'appointment',
      operationId: 'operation-id',
      switches: 'f=test:0,test2:2',
    },
  ])('should create checkout session', async (input: ITestInput) => {
    const expectedProductInfo: IProductPaymentInfo = {
      isPriceActive: true,
      productPriceId: 'mock product',
      publicKey: 'mockpublic',
      unitAmount: 6543,
      unitAmountDecimal: '65.43',
    };
    const expectedSessionInfo: ICheckoutSessionInfo = {
      ...expectedProductInfo,
      clientReferenceId: 'test_order_number_1234',
      paymentStatus: 'unpaid',
      sessionId: 'session id',
      orderNumber: 'order_number_1234',
    };

    const config = {
      environment: 'test',
      paymentsKeyPrivate: 'mockprivate',
      paymentsKeyPublic: 'mockpublic',
      testPaymentsKeyPrivate: 'mockprivatetest',
      testPaymentsKeyPublic: 'mockpublictest',
    } as IConfiguration;

    const stripe = {
      checkout: {
        sessions: {},
      },
      prices: {},
    } as Stripe;

    const session = {
      id: expectedSessionInfo.sessionId,
      payment_status: expectedSessionInfo.paymentStatus,
      client_reference_id: expectedSessionInfo.clientReferenceId,
    } as Stripe.Checkout.Session;

    const redirectUrls: ICheckoutSessionRedirectUrls = {
      success_url: 'https://mock_session_url',
      cancel_url: 'https://mock_cancel_url',
    };

    stripe.checkout.sessions.create = jest.fn().mockResolvedValue(session);

    getStripeContextMock.mockReturnValue(stripe);
    getCheckoutSessionRedirectUrlsMock.mockReturnValue(redirectUrls);
    getCheckoutProductPaymentInfoMock.mockResolvedValue(expectedProductInfo);

    const actualSessionInfo = await createCheckoutSession(
      expectedSessionInfo.productPriceId,
      input.productType,
      expectedSessionInfo.orderNumber,
      baseUrl,
      config,
      input.isTestPharmacy,
      input.operationId,
      input.switches
    );
    const expectedCreateParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      submit_type: 'book',
      line_items: [
        {
          price: expectedSessionInfo.productPriceId,
          quantity: 1,
        },
      ],
      client_reference_id: expectedSessionInfo.clientReferenceId,
      ...redirectUrls,
    };

    expect(getCheckoutSessionRedirectUrlsMock).toHaveBeenNthCalledWith(
      1,
      baseUrl,
      input.productType,
      expectedSessionInfo.orderNumber,
      input.operationId,
      input.switches
    );
    expect(getCheckoutProductPaymentInfoMock).toHaveBeenNthCalledWith(
      1,
      expectedProductInfo.productPriceId,
      config,
      input.isTestPharmacy
    );

    expect(getStripeContextMock).toHaveBeenNthCalledWith(
      1,
      config,
      input.isTestPharmacy
    );
    expect(actualSessionInfo).toEqual(expectedSessionInfo);
    expect(stripe.checkout.sessions.create).toHaveBeenNthCalledWith(
      1,
      expectedCreateParams
    );
  });
});
