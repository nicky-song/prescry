// Copyright 2018 Prescryptive Health, Inc.

import { IPendingPrescriptionsList } from '../models/pending-prescription';
import { IMemberContactInfo } from './member-info/member-contact-info';
import { IRefreshTokenResponse } from '../experiences/guest-experience/api/with-refresh-token';

export interface IApiResponse extends IRefreshTokenResponse {
  message: string;
  status: string;
  prescriptionInfoRequestId?: string;
  memberInfoRequestId?: string;
  responseCode?: number;
}

export interface IApiDataResponse<TData> extends IApiResponse {
  data: TData;
}

export type ILoginResponse = IApiDataResponse<{
  token: string;
}>;

export type IVerifyOneTimePassword = IApiDataResponse<{
  token: string;
  recoveryEmailExists?: boolean;
}>;

export type IVerifyOneTimePasswordV2 = IApiDataResponse<{
  deviceToken: string;
  recoveryEmailExists?: boolean;
}>;

export type IMembersApiResponse = IApiDataResponse<{
  memberDetails: IMemberDetails;
}>;

export interface IMemberDetails {
  loggedInMember: IMemberContactInfo;
  childMembers: IMemberContactInfo[];
  adultMembers: IMemberContactInfo[];
  isMember: boolean;
}

export type IGetPendingPrescriptionResponse = IApiDataResponse<{
  pendingPrescriptionList: IPendingPrescriptionsList;
  memberIdentifier: string;
}>;

export type IAddPinResponse = IApiDataResponse<{
  accountToken: string;
}>;

export type IVerifyPinResponse = IApiDataResponse<{
  accountToken: string;
}>;

export interface IFailureResponse extends IApiResponse {
  code: number;
}

export interface IPinVerificationFailureResponse extends IFailureResponse {
  details: {
    pinVerificationAttempt: number;
  };
}

export type IVerifySsoResponse = IApiDataResponse<{
  accountToken?: string;
  deviceToken: string;
  recoveryEmailExists?: boolean;
}>;
