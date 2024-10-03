// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import {
  ILimitedAccount,
  IProfile,
} from '../member-profile/member-profile-info';
import {
  IPatientDependentsResponse,
  IPatientProfileResponse,
} from '../patient-profile/patient-profile';

export type IMemberInfoResponse = IApiDataResponse<IMemberInfoResponseData>;

export interface IMemberInfoResponseData {
  account: ILimitedAccount;
  profileList: IProfile[];
  patientDependents?: IPatientDependentsResponse[];
  patientList?: IPatientProfileResponse[];
}
