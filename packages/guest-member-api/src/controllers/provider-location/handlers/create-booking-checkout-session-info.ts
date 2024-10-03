// Copyright 2020 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { IService } from '@phx/common/src/models/provider-location';
import { createCheckoutSession } from '../../../utils/payments/create-checkout-session';
import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';
export interface IServiceEntitlements {
  remaining: number;
}

export async function createBookingPaymentCheckoutSessionIfNecessary(
  service: IService,
  orderNumber: string,
  experienceBaseUrl: string,
  configuration: IConfiguration,
  isTestPharmacy: boolean,
  operationId: string,
  switches?: string
): Promise<ICheckoutSessionInfo | undefined> {
  if (!service.payment) {
    return undefined;
  }
  const checkout = await createCheckoutSession(
    service.payment.productKey,
    'appointment',
    orderNumber,
    experienceBaseUrl,
    configuration,
    isTestPharmacy,
    operationId,
    switches
  );
  return checkout;
}
