// Copyright 2022 Prescryptive Health, Inc.

import { PaymentStatus } from '@phx/common/src/models/api-response/create-booking-response';
import { getPaymentStatusDescription } from './get-payment-status-description';

describe('GetPaymentStatusDescription', () => {
  it.each([
    ['no_payment_required', 'Billed to event sponsor'],
    ['paid', 'Paid'],
    ['unpaid', 'Unpaid'],
    ['refunded', 'Refunded'],
  ])(
    'should return expected string for %p',
    (paymentStatus: string, expected: string) => {
      const result = getPaymentStatusDescription(
        paymentStatus as PaymentStatus
      );
      expect(result).toEqual(expected);
    }
  );
});
