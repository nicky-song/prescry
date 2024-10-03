// Copyright 2020 Prescryptive Health, Inc.

import { IRefreshTokenResponse } from '../../experiences/guest-experience/api/with-refresh-token';
import { IApiDataResponse } from '../api-response';
import { PaymentStatus } from './create-booking-response';

export interface IAppointmentItem {
  serviceName: string;
  customerName: string;
  customerDateOfBirth: string;
  status: string;
  orderNumber: string;
  locationName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  additionalInfo?: string;
  date: string;
  time: string;
  providerTaxId: string;
  totalCost?: string;
  providerLegalName?: string;
  providerNpi?: string;
  diagnosticCode?: string;
  paymentStatus: PaymentStatus;
  procedureCode: string;
  serviceDescription: string;
  bookingStatus: BookingStatus;
  startInUtc: Date;
  serviceType: string;
  confirmationDescription?: string;
  cancellationPolicy?: string;
  contractFee?: number;
  pdfBase64?: string;
  providerPhoneNumber?: string;
  providerClia?: string;
  appointmentLink: string;
}

export declare type BookingStatus =
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Requested';

export interface IAppointmentListItem {
  customerName: string;
  orderNumber: string;
  locationName: string;
  date: string;
  time: string;
  serviceDescription: string;
  bookingStatus: BookingStatus;
  startInUtc: Date;
  serviceType: string;
  appointmentLink: string;
}
export interface IAppointmentsResponseData {
  appointments: IAppointmentListItem[];
}

export type IAppointmentsResponse =
  IApiDataResponse<IAppointmentsResponseData> & IRefreshTokenResponse;
export interface IAppointmentResponseData {
  appointment?: IAppointmentItem;
}

export type IAppointmentResponse = IApiDataResponse<IAppointmentResponseData> &
  IRefreshTokenResponse;
