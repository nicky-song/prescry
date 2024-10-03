// Copyright 2020 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { IAppointmentItem } from './appointment.response';

export type PaymentStatus =
  | 'no_payment_required'
  | 'paid'
  | 'unpaid'
  | 'refunded';

export interface IProductPaymentInfo {
  isPriceActive: boolean;
  productPriceId: string;
  publicKey: string;
  unitAmount?: number | null;
  unitAmountDecimal?: string | null;
  isTestPayment?: boolean;
}

export interface ICheckoutSessionInfo extends IProductPaymentInfo {
  clientReferenceId: string;
  paymentStatus: PaymentStatus;
  sessionId: string;
  orderNumber: string;
}

export type ICreateBookingResponse =
  IApiDataResponse<ICreateBookingResponseData>;

export interface ICreateBookingResponseData {
  payment?: ICheckoutSessionInfo;
  appointment: IAppointmentItem;
}
