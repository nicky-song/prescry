// Copyright 2022 Prescryptive Health, Inc.

import {
  IPatientDependents,
  IPatientProfile,
} from '../../models/patient-profile';

export const getMasterIdsFromPrimaryPatientList = (
  patientProfiles: IPatientProfile[]
): string[] => {
  const loggedInMasterIds: string[] = [];

  for (const patientProfile of patientProfiles) {
    if (patientProfile.primary.id)
      loggedInMasterIds.push(patientProfile.primary.id);
  }

  return [...new Set(loggedInMasterIds)];
};

export const getMasterIdsFromDependentPatientList = (
  patientDependents: IPatientDependents[]
): string[] => {
  const DependentMasterIds: string[] = [];

  for (const patient of patientDependents) {
    if (patient.childMembers) {
      for (const dep of patient.childMembers.activePatients) {
        if (dep?.id) DependentMasterIds.push(dep.id);
      }
    }
    if (patient.adultMembers) {
      for (const dep of patient.adultMembers.activePatients) {
        if (dep?.id) DependentMasterIds.push(dep.id);
      }
    }
  }

  return [...new Set(DependentMasterIds)];
};
