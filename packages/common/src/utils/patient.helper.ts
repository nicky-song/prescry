// Copyright 2022 Prescryptive Health, Inc.

import { assertIsDefined } from '../assertions/assert-is-defined';
import { RxGroupTypesEnum } from '../models/member-profile/member-profile-info';
import { ILimitedPatient } from '../models/patient-profile/limited-patient';
import { IPatientProfileResponse } from '../models/patient-profile/patient-profile';
import { ErrorConstants } from '../theming/constants';

export const getPatientInfoByRxGroupType = (
  patientList: IPatientProfileResponse[],
  rxGroupType: RxGroupTypesEnum
): ILimitedPatient => {
  const filteredPatient = patientList.find(
    (patient) => patient.rxGroupType === rxGroupType
  )?.primary;

  assertIsDefined(filteredPatient, ErrorConstants.errorUndefinedPatient);

  return filteredPatient;
};
