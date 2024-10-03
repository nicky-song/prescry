// Copyright 2020 Prescryptive Health, Inc.

import { IService } from '@phx/common/src/models/provider-location';
import { IConfiguration } from '../../../configuration';
import { createBookingPaymentCheckoutSessionIfNecessary } from './create-booking-checkout-session-info';
import * as CheckoutHelper from '../../../utils/payments/create-checkout-session';
import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';

const createCheckoutSession = jest.spyOn(
  CheckoutHelper,
  'createCheckoutSession'
);

beforeEach(() => {
  createCheckoutSession.mockReset();
});

describe('createBookingCheckoutSessionInfo', () => {
  it('no payment is returned/necessary when customer is covid', async () => {
    const service = {} as IService;
    const orderNumber = '123456';
    const experienceBaseUrl = 'https://myrx.io';
    const configuration = {} as IConfiguration;
    const switches = 'f=test:1';
    const operationId = 'operation-id';

    const actual = await createBookingPaymentCheckoutSessionIfNecessary(
      service,
      orderNumber,
      experienceBaseUrl,
      configuration,
      false,
      operationId,
      switches
    );

    expect(actual).toBeUndefined();
  });

  it('should throw exception if payment is necessary but service is not configured for payment', async () => {
    const service = {} as IService;
    const orderNumber = '123456';
    const experienceBaseUrl = 'https://myrx.io';
    const configuration = {} as IConfiguration;
    const switches = '?f=test:1';
    const operationId = 'operation-id';

    const actual = await createBookingPaymentCheckoutSessionIfNecessary(
      service,
      orderNumber,
      experienceBaseUrl,
      configuration,
      false,
      operationId,
      switches
    );
    expect(actual).toBeUndefined();
  });

  it('should return ICheckoutSessionInfo', async () => {
    const service = {
      payment: {
        productKey: 'product-key',
      },
    } as IService;
    const orderNumber = '123456';
    const experienceBaseUrl = 'https://myrx.io';
    const configuration = {} as IConfiguration;
    const switches = 'f=test:1';
    const operationId = 'operation-id';

    const checkoutSession = {} as ICheckoutSessionInfo;
    createCheckoutSession.mockResolvedValue(checkoutSession);

    const result = await createBookingPaymentCheckoutSessionIfNecessary(
      service,
      orderNumber,
      experienceBaseUrl,
      configuration,
      false,
      operationId,
      switches
    );

    expect(result).toBe(checkoutSession);
    expect(createCheckoutSession).toHaveBeenNthCalledWith(
      1,
      'product-key',
      'appointment',
      orderNumber,
      experienceBaseUrl,
      configuration,
      false,
      operationId,
      switches
    );
  });
});
