// Copyright 2020 Prescryptive Health, Inc.

import { getStripeContext } from './stripe-context';
import { IConfiguration } from '../../configuration';
import Stripe from 'stripe';

jest.genMockFromModule('stripe');
jest.mock('stripe', () => jest.fn());

const StripeMock = Stripe as unknown as jest.Mock;

beforeEach(() => {
  StripeMock.mockReset();
});

describe('getStripeContext', () => {
  const config = {
    paymentsKeyPrivate: 'mockprivate',
    paymentsKeyPublic: 'mockpublic',
    testPaymentsKeyPrivate: 'mockprivatetest',
    testPaymentsKeyPublic: 'mockpublictest',
  } as IConfiguration;

  it('should create new instance of Stripe', () => {
    const stripeMock = {} as Stripe;
    StripeMock.mockImplementation(() => stripeMock);

    const stripe = getStripeContext(config);
    expect(stripe).toBe(stripeMock);
    expect(StripeMock).toHaveBeenNthCalledWith(1, config.paymentsKeyPrivate, {
      apiVersion: '2020-08-27',
    });
  });
  it('should create new instance of Stripe using testKey if useTestPayment is true', () => {
    const stripeMock = {} as Stripe;
    StripeMock.mockImplementation(() => stripeMock);

    const stripe = getStripeContext(config, true);
    expect(stripe).toBe(stripeMock);
    expect(StripeMock).toHaveBeenNthCalledWith(
      1,
      config.testPaymentsKeyPrivate,
      {
        apiVersion: '2020-08-27',
      }
    );
  });
});
