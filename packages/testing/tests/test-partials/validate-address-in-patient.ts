// Copyright 2023 Prescryptive Health, Inc.

import { IFhir } from '../../../guest-member-api/src/models/fhir/fhir';

export const validateAddressInPatient = (patientObject: IFhir) => {
  let result = false;

  if (patientObject && patientObject.entry && patientObject.entry[0].resource) {
    const patient = patientObject.entry[0].resource[0];
    if (
      patient.address &&
      patient.address[0].line &&
      patient.address[0].line.length > 0
    ) {
      result = true;
    }
  }
  return result;
};
