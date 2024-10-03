// Copyright 2022 Prescryptive Health, Inc.

import { IFhir } from '../../models/fhir/fhir';
import { IMedicationRequest } from '../../models/fhir/medication-request/medication-request';
import { IOrganization } from '../../models/fhir/organization/organization';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { IPatient } from '../../models/fhir/patient/patient';
import { IPractitioner } from '../../models/fhir/practitioner/practitioner';
import { ResourceType } from '../../models/fhir/types';

export const findFhirCoverageResources = (fhir: IFhir) =>
  findFhirResources<ICoverage>('Coverage', fhir);

export const findFhirMedicationRequestResource = (fhir: IFhir) =>
  findFhirResource<IMedicationRequest>('MedicationRequest', fhir);

export const findFhirOrganizationResource = (fhir: IFhir) =>
  findFhirResource<IOrganization>('Organization', fhir);

export const findFhirPatientResource = (fhir: IFhir) =>
  findFhirResource<IPatient>('Patient', fhir);

export const findFhirPatientResources = (fhir: IFhir) =>
  findFhirResources<IPatient>('Patient', fhir);

export const findFhirPractitionerResource = (fhir: IFhir) =>
  findFhirResource<IPractitioner>('Practitioner', fhir);

const findFhirResource = <TResource>(
  resourceType: ResourceType,
  fhir: IFhir
): TResource | undefined => {
  const resourceWrapper = fhir.entry?.find(
    (r) => r.resource.resourceType === resourceType
  );
  return resourceWrapper?.resource as TResource | undefined;
};

const findFhirResources = <TResource>(
  resourceType: ResourceType,
  fhir: IFhir
): TResource[] => {
  const resourceWrapper = fhir.entry
    ? fhir.entry?.filter((r) => r.resource.resourceType === resourceType)
    : [];

  const resourceList: TResource[] = [];

  for (const resource of resourceWrapper) {
    if (resource?.resource) {
      resourceList.push(resource?.resource as TResource);
    }
  }

  return resourceList;
};
