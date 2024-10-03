// Copyright 2020 Prescryptive Health, Inc.

import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';
import { SchemaDefinition } from 'mongoose';

export const CheckoutSessionDefinition =
  (): SchemaDefinition<ICheckoutSessionInfo> => ({
    sessionId: { type: String, required: true },
    clientReferenceId: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    isPriceActive: { type: Boolean, required: true },
    publicKey: { type: String, required: true },
    productPriceId: { type: String, required: true },
    unitAmount: { type: Number, required: false },
    unitAmountDecimal: { type: String, required: false },
    orderNumber: { type: String, required: true },
    isTestPayment: { type: Boolean, required: false },
  });
