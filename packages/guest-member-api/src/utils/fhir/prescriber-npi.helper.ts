// Copyright 2023 Prescryptive Health, Inc.

import { IFhir } from '../../models/fhir/fhir';
import { findFhirMedicationRequestResource } from './fhir-resource.helper';

export const findPrescriberNPIForPrescriptionFhir = (fhir: IFhir) => {
  const medicationResource = findFhirMedicationRequestResource(fhir);
  const medicationRequester = medicationResource?.requester;
  return medicationRequester?.reference;
};
