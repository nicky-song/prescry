// Copyright 2020 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { IServiceQuestion } from '../provider-location';

export type IProviderLocationDetailsResponse =
  IApiDataResponse<IProviderLocationDetailsResponseData>;

export interface IProviderLocationDetailsResponseData {
  location: ILocation;
  serviceNameMyRx: string;
  minimumAge: number;
  aboutQuestionsDescriptionMyRx: string;
  aboutDependentDescriptionMyRx: string;
  cancellationPolicyMyRx?: string;
}

export interface ILocation {
  id: string;
  providerName: string;
  locationName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  distance?: number;
  phoneNumber?: string;
  serviceInfo: IServiceInfo[];
  timezone: string;
}

export interface IServiceInfo {
  serviceName: string;
  serviceType: string;
  screenTitle: string;
  screenDescription: string;
  confirmationAdditionalInfo?: string;
  questions: IServiceQuestion[];
  minLeadDays: string;
  maxLeadDays: string;
  paymentRequired?: boolean;
}
