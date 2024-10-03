// Copyright 2020 Prescryptive Health, Inc.

import { IAccount } from '@phx/common/src/models/account';
import { IPerson } from '@phx/common/src/models/person';
import { IJwtTokenPayload } from './token-payload';
import { IPhoneDevice } from '../middlewares/device-token.middleware';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { IPatientAccount } from './platform/patient-account/patient-account';
import { IPatient } from './fhir/patient/patient';
import { IPatientDependents, IPatientProfile } from './patient-profile';

export type IAppLocalsKeys = keyof IAppLocals;

export interface IAppLocals {
  accountIdentifier?: string;
  account?: IAccount & Document;
  personInfo?: IPerson;
  verifiedPayload?: IJwtTokenPayload;
  device?: IPhoneDevice;
  deviceKeyRedis?: string;
  features: IFeaturesState;
  dependents?: IPerson[];
  code?: string;
  personList?: IPerson[];
  masterIds?: string[];
  patientAccount?: IPatientAccount;
  patientAccountId?: string;
  patient?: IPatient;
  patientDependents?: IPatientDependents[];
  dependentMasterIds?: string[];
  patientProfiles?: IPatientProfile[];
}
