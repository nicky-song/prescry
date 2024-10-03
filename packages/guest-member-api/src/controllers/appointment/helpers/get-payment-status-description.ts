// Copyright 2022 Prescryptive Health, Inc.

import { PaymentStatus } from '@phx/common/src/models/api-response/create-booking-response';

export const getPaymentStatusDescription = (
  paymentStatus: PaymentStatus
): string => {
  switch (paymentStatus) {
    case 'no_payment_required':
      return 'Billed to event sponsor';
    case 'paid':
      return 'Paid';
    case 'unpaid':
      return 'Unpaid';
    case 'refunded':
      return 'Refunded';
    default:
      return paymentStatus;
  }
};
