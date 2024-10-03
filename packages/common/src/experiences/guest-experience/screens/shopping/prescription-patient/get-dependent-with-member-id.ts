// Copyright 2023 Prescryptive Health, Inc.

import { ILimitedPatient } from '../../../../../models/patient-profile/limited-patient';
import { IPatientDependentsResponse } from '../../../../../models/patient-profile/patient-profile';

export function getDependentWithMemberId(
  dependents: IPatientDependentsResponse[] | undefined,
  memberId: string | undefined
) {
  if (!dependents || !memberId) {
    return undefined;
  }
  for (const patient of dependents) {
    const foundAdult = getPatientFromList(
      patient?.adultMembers?.activePatients,
      memberId
    );
    const foundChild = getPatientFromList(
      patient?.childMembers?.activePatients,
      memberId
    );

    if (foundAdult ?? foundChild) {
      return foundAdult ?? foundChild;
    }
  }
  return undefined;
}

function getPatientFromList(
  patients: ILimitedPatient[] | undefined,
  memberId: string
) {
  return patients?.find((x) => x.memberId === memberId);
}
