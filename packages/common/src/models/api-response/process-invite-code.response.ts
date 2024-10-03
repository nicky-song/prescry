// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { IAvailableSlotsData } from './available-slots-response';
import { ILocation } from './provider-location-details-response';
import { IServiceInfo } from './provider-location-details-response';

export interface IProcessInviteCodeResponseData {
  availableSlots: IAvailableSlotsData;
  location: ILocation;
  service: IServiceInfo;
  inviteCode: string;
  minDate: string;
  maxDate: string;
  serviceNameMyRx: string;
  minimumAge: number;
  aboutQuestionsDescriptionMyRx: string;
  aboutDependentDescriptionMyRx: string;
  cancellationPolicyMyRx?: string;
}

export type IProcessInviteCodeResponse =
  IApiDataResponse<IProcessInviteCodeResponseData>;
