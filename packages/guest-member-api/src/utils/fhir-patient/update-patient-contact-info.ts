// Copyright 2022 Prescryptive Health, Inc.

import { IContactPoint } from '../../models/fhir/contact-point';
import { IPatient } from '../../models/fhir/patient/patient';
import { ContactPointSystem, ContactPointUse } from '../../models/fhir/types';

export function updatePatientContactInfo(
  patient: IPatient,
  contactPurpose: ContactPointUse,
  system: ContactPointSystem,
  value: string
) {
  const telecom = patient.telecom ? [...patient.telecom] : [];
  const newContactPoint: IContactPoint = {
    system,
    use: contactPurpose,
    value,
  };
  const existingContactIndex = telecom.findIndex(
    (contact) => contact.system === system && contact.use === contactPurpose
  );
  if (existingContactIndex >= 0) {
    telecom.splice(existingContactIndex, 1);
  }
  telecom.push(newContactPoint);

  return { ...patient, telecom };
}
