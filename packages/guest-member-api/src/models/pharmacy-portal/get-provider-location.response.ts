// Copyright 2021 Prescryptive Health, Inc.

import {
  IProviderLocation,
  IServiceQuestion,
} from '@phx/common/src/models/provider-location';
import { IServices } from '../services';

export interface ICoordinates {
  latitude: number;
  longitude: number;
}
export interface IProviderLocationAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  timezone?: string;
  coordinates?: ICoordinates;
}

export interface IClientText {
  serviceName: string;
  screenTitle: string;
  screenDescription: string;
  cancellationPolicy: string;
  aboutQuestionsDescription: string;
  aboutDependentDescription: string;
  confirmationDescription: string;
  confirmationAdditionalInfo?: string;
}

export interface IPaymentInfoService {
  priceCents: string;
  priceKey: string;
}
export interface IProviderLocationInfo {
  name: string;
  taxId: string;
  cliaNumber: string;
  npiNumber: string;
}

export interface IProviderLocationService {
  id: string;
  name: string;
  description: string;
  clientText: IClientText;
  schedulerMinimumAge: number;
  minimumAge: number;
  payment?: IPaymentInfoService;
  questions: IServiceQuestion[];
  duration: number;
  minLeadDuration: string;
  maxLeadDuration: string;
  scheduleMode: string;
  isTestService?: boolean;
  procedureCode?: string;
}

export interface IProviderLocationEndpointResponse {
  id: string;
  providerInfo: IProviderLocationInfo;
  name: string;
  address: IProviderLocationAddress;
  phoneNumber: string;
  isEnabled: boolean;
  isTest: boolean;
  services: IProviderLocationService[];
}

export interface IProviderLocationListItem {
  id: string;
  providerName: string;
  locationName: string;
  address: IProviderLocationAddress;
  phoneNumber: string;
  distanceMiles?: number;
  priceCents?: string;
}

export interface IProviderLocationListEndpointResponse {
  locations: IProviderLocationListItem[];
}

export interface IProviderLocationResponse {
  location?: IProviderLocation;
  service?: IServices;
  errorCode?: number;
  message: string;
}

export interface IProviderLocationListResponse {
  locations?: IProviderLocationListItem[];
  service?: IServices;
  errorCode?: number;
  message: string;
}
