// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IFhir } from '../../../models/fhir/fhir';
import { IPatient } from '../../../models/fhir/patient/patient';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import {
  buildFirstName,
  getHumanName,
} from '../../../utils/fhir/human-name.helper';
import { IUpdatePrescriptionParams } from './update-prescriptions-with-member-id';

export function buildUpdatePrescriptionParams(
  prescription: IFhir,
  personList?: IPerson[]
) {
  const rxNo = prescription.identifier?.value;
  const patientResource = prescription.entry.find(
    (r: ResourceWrapper) => r.resource.resourceType === 'Patient'
  );
  const patient = patientResource?.resource as IPatient | undefined;
  const primeRxId = patient?.identifier?.find((x) =>
    x.type?.coding?.find((y) => y.code === 'PT')
  )?.value;
  const params: IUpdatePrescriptionParams = {
    clientPatientId: '',
    rxNo: rxNo ?? '',
    pharmacyManagementSystemPatientId: primeRxId ?? '',
    refillNo: 0 /* for now, we will hardcode it but will put logic once platform team figure out the formula */,
  };

  if (personList && patient) {
    const officialName = getHumanName(patient?.name, 'official');
    const prescriptionFirstName = buildFirstName(officialName);

    const personProfiles = personList?.filter(
      (x) =>
        x.firstName.toUpperCase() === prescriptionFirstName?.toUpperCase() &&
        x.dateOfBirth === patient.birthDate
    );
    if (personProfiles.length > 0) {
      const sieProfile = personProfiles.find((x) => x.rxGroupType === 'SIE');
      const highPriorityProfile = sieProfile ?? personProfiles[0];

      params.clientPatientId = highPriorityProfile.primaryMemberRxId;
    }
  }

  return params;
}
