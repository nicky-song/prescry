// Copyright 2020 Prescryptive Health, Inc.

import { IHealthRecordEvent } from './health-record-event';
import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';
import { IQuestionAnswer } from '@phx/common/src/models/question-answer';

export interface IAppointment {
  appointment: IAppointmentInfo;
  questions: IQuestionAnswer[];
  sessionId: string;
  serviceType: string;
  payment?: ICheckoutSessionInfo;
  claimInformation?: IClaimInformation;
  orderNumber: string;
  bookingStatus: BookingStatus;
  isTestAppointment: boolean;
  isDependentAppointment?: boolean;
  inviteCode?: string;
  contractFee?: number;
}
export declare type AppointmentStatus = 'Accepted' | 'Declined' | 'None';
export declare type BookingStatus =
  | 'Confirmed'
  | 'Cancelled'
  | 'Requested'
  | 'Completed';
export interface IAppointmentInfo {
  serviceId?: string;
  serviceName: string;
  start: Date;
  startInUtc: Date;
  timezone: string;
  customerName: string;
  customerPhone: string;
  bookingId: string;
  locationId: string;
  resource: string;
  acceptMessageText: string;
  declineMessageText: string;
  memberRxId: string;
  memberFamilyId?: string;
  memberPersonCode: string;
  status?: AppointmentStatus;
  procedureCode: string;
  serviceDescription: string;
}

export interface IClaimInformation {
  prescriberNationalProviderId: string;
  productOrServiceId: string;
  providerLegalName: string;
}

export type IAppointmentEvent = IHealthRecordEvent<IAppointment>;
