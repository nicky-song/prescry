// Copyright 2022 Prescryptive Health, Inc.

import { ILimitedPatient } from './limited-patient';

export interface IPatientProfileResponse {
  rxGroupType: string;
  primary: ILimitedPatient;
}

export interface IPatientDependentsResponse {
  rxGroupType: string;
  childMembers?: IActiveExpiredPatientsResponse;
  adultMembers?: IActiveExpiredPatientsResponse;
}

export interface IActiveExpiredPatientsResponse {
  activePatients: ILimitedPatient[];
  expiredPatients?: ILimitedPatient[];
}
