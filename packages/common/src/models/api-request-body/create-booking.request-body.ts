// Copyright 2020 Prescryptive Health, Inc.

import { IInsuranceInformation } from '../insurance-card';
import { IQuestionAnswer } from '../question-answer';

export interface ICreateBookingRequestBody {
  bookingId: string;
  locationId: string;
  serviceType: string;
  start: string;
  questions: IQuestionAnswer[];
  experienceBaseUrl: string;
  memberAddress?: IMemberAddress;
  dependentInfo?: IDependentInformation;
  inviteCode?: string;
  insuranceInformation?: IInsuranceInformation;
}

export interface IDependentInformation {
  identifier?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: IMemberAddress;
  addressSameAsParent?: boolean;
  masterId?: string;
}

export interface IMemberAddress {
  address1: string;
  address2?: string;
  county?: string;
  city: string;
  state: string;
  zip: string;
}
