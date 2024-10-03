// Copyright 2022 Prescryptive Health, Inc.

import { RxGroupTypes } from '@phx/common/src/models/member-profile/member-profile-info';
import { IPatient } from './fhir/patient/patient';

export interface IPatientProfile {
  rxGroupType: RxGroupTypes;
  primary: IPatient;
}

export interface IPatientDependents {
  rxGroupType: string;
  childMembers?: IActiveExpiredPatients;
  adultMembers?: IActiveExpiredPatients;
}

export interface IActiveExpiredPatients {
  activePatients: IPatient[];
  expiredPatients?: IPatient[];
}
