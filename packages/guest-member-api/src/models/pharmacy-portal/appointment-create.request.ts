// Copyright 2020 Prescryptive Health, Inc.

import { IQuestionAnswer } from '@phx/common/src/models/question-answer';

export interface ICreateAppointmentRequest {
  memberFamilyId?: string;
  memberPersonCode: string;
  accountIdentifier: string;
  orderNumber: string;
  tags: string[];
  customerName: string;
  customerPhone: string;
  bookingId: string;
  acceptMessageText: string;
  memberRxId: string;
  questions: IQuestionAnswer[];
  serviceType: string;
  isTestAppointment: boolean;
  isDependentAppointment: boolean;
  sessionId: string;
  productPriceId?: string;
  unitAmount?: number | null;
  isTestPayment?: boolean;
  stripeSessionId?: string;
  stripeClientReferenceId?: string;
  providerLocationId: string;
  inviteCode?: string;
}
