// Copyright 2020 Prescryptive Health, Inc.

import { getStripeContext } from './stripe-context';
import { IConfiguration } from '../../configuration';
import Stripe from 'stripe';
import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';
import { getCheckoutSession } from './get-checkout-session';

jest.mock('./stripe-context', () => ({
  getStripeContext: jest.fn(),
}));

const getStripeContextMock = getStripeContext as jest.Mock;

beforeEach(() => {
  getStripeContextMock.mockReset();
});

describe('getCheckoutSession', () => {
  const config = {
    paymentsKeyPrivate: 'mockprivate',
    paymentsKeyPublic: 'mockpublic',
    testPaymentsKeyPrivate: 'mockprivatetest',
    testPaymentsKeyPublic: 'mockpublictest',
  } as IConfiguration;

  const expected: ICheckoutSessionInfo = {
    clientReferenceId: 'test_ordernumber1234',
    isPriceActive: true,
    paymentStatus: 'unpaid',
    productPriceId: 'mock product',
    publicKey: 'mockpublic',
    sessionId: 'session id',
    unitAmount: 6543,
    unitAmountDecimal: '65.43',
    orderNumber: 'ordernumber1234',
    isTestPayment: undefined,
  };

  const price = {
    active: expected.isPriceActive,
    id: expected.productPriceId,
    unit_amount: expected.unitAmount,
    unit_amount_decimal: expected.unitAmountDecimal,
  } as Stripe.Price;

  const stripe = {
    checkout: {
      sessions: {} as Stripe.Checkout.SessionsResource,
    },
  } as Stripe;

  it('should get existing checkout session', async () => {
    const session = {
      client_reference_id: expected.clientReferenceId,
      id: expected.sessionId,
      line_items: {
        data: [{ price }],
      },
      payment_status: expected.paymentStatus,
    } as Stripe.Response<Stripe.Checkout.Session>;

    stripe.checkout.sessions.retrieve = jest.fn().mockResolvedValue(session);
    getStripeContextMock.mockReturnValue(stripe);

    const result = await getCheckoutSession(expected.sessionId, config);
    expect(result).toMatchObject(expected);
    expect(getStripeContextMock).toHaveBeenNthCalledWith(1, config, undefined);
    expect(stripe.checkout.sessions.retrieve).toHaveBeenNthCalledWith(
      1,
      expected.sessionId
    );
  });

  it('should fail because session.line_items is undefined', async () => {
    const session = {
      line_items: undefined,
    } as Stripe.Response<Stripe.Checkout.Session>;

    stripe.checkout.sessions.retrieve = jest.fn().mockResolvedValue(session);
    getStripeContextMock.mockReturnValue(stripe);

    await expect(() =>
      getCheckoutSession(expected.sessionId, config)
    ).rejects.toThrow('PaymentCheckoutSessionIsInvalid');
  });

  it('should fail because session.line_items.data is undefined', async () => {
    const session = {
      line_items: undefined,
    } as Stripe.Response<Stripe.Checkout.Session>;
    stripe.checkout.sessions.retrieve = jest.fn().mockResolvedValue(session);
    getStripeContextMock.mockReturnValue(stripe);

    session.line_items = {
      data: [] as Stripe.LineItem[],
    } as Stripe.ApiList<Stripe.LineItem>;

    await expect(() =>
      getCheckoutSession(expected.sessionId, config)
    ).rejects.toThrow('PaymentCheckoutSessionIsInvalid');
  });

  it('should fail because line_items.data[0].price is null', async () => {
    const session = {
      line_items: {
        data: [] as Stripe.LineItem[],
      } as Stripe.ApiList<Stripe.LineItem>,
    } as Stripe.Response<Stripe.Checkout.Session>;
    stripe.checkout.sessions.retrieve = jest.fn().mockResolvedValue(session);
    getStripeContextMock.mockReturnValue(stripe);

    await expect(() =>
      getCheckoutSession(expected.sessionId, config)
    ).rejects.toThrow('PaymentCheckoutSessionIsInvalid');
  });

  it('should fail because session.client_reference_id is undefined', async () => {
    const session = {
      line_items: {
        data: [
          {
            price: {
              active: expected.isPriceActive,
              id: expected.productPriceId,
            } as Stripe.Price | null,
          },
        ] as Stripe.LineItem[],
      } as Stripe.ApiList<Stripe.LineItem>,
    } as Stripe.Response<Stripe.Checkout.Session>;
    stripe.checkout.sessions.retrieve = jest.fn().mockResolvedValue(session);
    getStripeContextMock.mockReturnValue(stripe);

    await expect(() =>
      getCheckoutSession(expected.sessionId, config)
    ).rejects.toThrow('PaymentCheckoutSessionIsInvalid');
  });

  it('should call getStripeContext with useTestPayment as true if provided', async () => {
    const expectedTestPayment: ICheckoutSessionInfo = {
      clientReferenceId: 'ordernumber1234',
      isPriceActive: true,
      paymentStatus: 'unpaid',
      productPriceId: 'mock product',
      publicKey: 'mockpublictest',
      sessionId: 'session id',
      unitAmount: 6543,
      unitAmountDecimal: '65.43',
      orderNumber: 'ordernumber1234',
      isTestPayment: true,
    };
    const session = {
      client_reference_id: expectedTestPayment.clientReferenceId,
      id: expectedTestPayment.sessionId,
      line_items: {
        data: [{ price }],
      },
      payment_status: expectedTestPayment.paymentStatus,
    } as Stripe.Response<Stripe.Checkout.Session>;

    stripe.checkout.sessions.retrieve = jest.fn().mockResolvedValue(session);
    getStripeContextMock.mockReturnValue(stripe);

    const result = await getCheckoutSession(
      expectedTestPayment.sessionId,
      config,
      true
    );
    expect(result).toMatchObject(expectedTestPayment);
    expect(getStripeContextMock).toHaveBeenNthCalledWith(1, config, true);
    expect(stripe.checkout.sessions.retrieve).toHaveBeenNthCalledWith(
      1,
      expectedTestPayment.sessionId
    );
  });
});
