// Copyright 2022 Prescryptive Health, Inc.

import { IFhir } from '../../models/fhir/fhir';
import { IMedicationRequest } from '../../models/fhir/medication-request/medication-request';
import { IOrganization } from '../../models/fhir/organization/organization';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { IPatient } from '../../models/fhir/patient/patient';
import { IPractitioner } from '../../models/fhir/practitioner/practitioner';
import {
  findFhirCoverageResources,
  findFhirMedicationRequestResource,
  findFhirOrganizationResource,
  findFhirPatientResource,
  findFhirPatientResources,
  findFhirPractitionerResource,
} from './fhir-resource.helper';

describe('fhirResourceHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findFhirOrganizationResource', () => {
    it('returns resource if it exists in FHIR object', () => {
      const resourceMock: Partial<IOrganization> = {
        resourceType: 'Organization',
        id: '4929432',
        name: 'Prescryptive Pharmacy',
      };
      const fhirMock: Partial<IFhir> = {
        entry: [
          {
            resource: resourceMock,
          },
        ],
      };

      expect(findFhirOrganizationResource(fhirMock as IFhir)).toEqual(
        resourceMock
      );
    });

    it('returns undefined if resource does not exist in FHIR object', () => {
      const fhirMock: Partial<IFhir> = {
        entry: [],
      };

      expect(findFhirOrganizationResource(fhirMock as IFhir)).toBeUndefined();
    });
  });

  describe('findFhirMedicationRequestResource', () => {
    it('returns resource if it exists in FHIR object', () => {
      const resourceMock: Partial<IMedicationRequest> = {
        resourceType: 'MedicationRequest',
        id: '8257321d-3ada-4846-ae48-e947d2c3d231',
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: 'MOCK-RXNUMBER',
          },
        ],
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: '02c6b082-04ff-4238-960a-cce5241fcb4b',
        },
      };
      const fhirMock: Partial<IFhir> = {
        entry: [
          {
            resource: resourceMock,
          },
        ],
      };

      expect(findFhirMedicationRequestResource(fhirMock as IFhir)).toEqual(
        resourceMock
      );
    });

    it('returns undefined if resource does not exist in FHIR object', () => {
      const fhirMock: Partial<IFhir> = {
        entry: [],
      };

      expect(
        findFhirMedicationRequestResource(fhirMock as IFhir)
      ).toBeUndefined();
    });
  });

  describe('findFhirPatientResource', () => {
    it('returns resource if it exists in FHIR object', () => {
      const resourceMock: Partial<IPatient> = {
        resourceType: 'Patient',
        id: 'MYRX-ID',
        name: [{ family: 'ALAM', given: ['DIAN'] }],
        birthDate: '1980-01-01',
        telecom: [
          {
            system: 'phone',
            use: 'mobile',
            value: '+11111111111',
          },
        ],
      };
      const fhirMock: Partial<IFhir> = {
        entry: [
          {
            resource: resourceMock,
          },
        ],
      };

      expect(findFhirPatientResource(fhirMock as IFhir)).toEqual(resourceMock);
    });

    it('returns undefined if resource does not exist in FHIR object', () => {
      const fhirMock: Partial<IFhir> = {
        entry: [],
      };

      expect(findFhirPatientResource(fhirMock as IFhir)).toBeUndefined();
    });
  });

  describe('findFhirPractitionerResource', () => {
    it('returns resource if it exists in FHIR object', () => {
      const resourceMock: Partial<IPractitioner> = {
        resourceType: 'Practitioner',
      };
      const fhirMock: Partial<IFhir> = {
        entry: [
          {
            resource: resourceMock,
          },
        ],
      };

      expect(findFhirPractitionerResource(fhirMock as IFhir)).toEqual(
        resourceMock
      );
    });

    it('returns undefined if resource does not exist in FHIR object', () => {
      const fhirMock: Partial<IFhir> = {
        entry: [],
      };

      expect(findFhirPractitionerResource(fhirMock as IFhir)).toBeUndefined();
    });
  });

  describe('findFhirCoverageResources', () => {
    it('returns resource if it exists in FHIR object', () => {
      const resourceMock: Partial<ICoverage> = {
        resourceType: 'Coverage',
        id: 'MOCK-ID',
        status: 'active',
      };
      const fhirMock: Partial<IFhir> = {
        entry: [
          {
            resource: resourceMock,
          },
        ],
      };

      const expectedResult: Partial<ICoverage>[] = [resourceMock];

      expect(findFhirCoverageResources(fhirMock as IFhir)).toEqual(
        expectedResult
      );
    });

    it('returns empty array if entry bundle does not exist in FHIR object', () => {
      const fhirMock: Partial<IFhir> = {
        resourceType: 'Bundle',
        id: 'some-guid',
        type: 'searchset',
      };

      expect(findFhirCoverageResources(fhirMock as IFhir)).toEqual([]);
    });

    it('returns undefined if resource does not exist in FHIR object', () => {
      const fhirMock: Partial<IFhir> = {
        entry: [],
      };

      expect(findFhirCoverageResources(fhirMock as IFhir)).toEqual([]);
    });
  });

  describe('findFhirPatientResources', () => {
    it('returns resource if it exists in FHIR object', () => {
      const resourceMock: Partial<IPatient> = {
        resourceType: 'Patient',
        id: 'MYRX-ID',
        name: [{ family: 'ALAM', given: ['DIAN'] }],
        birthDate: '1980-01-01',
        telecom: [
          {
            system: 'phone',
            use: 'mobile',
            value: '+11111111111',
          },
        ],
      };
      const fhirMock: Partial<IFhir> = {
        entry: [
          {
            resource: resourceMock,
          },
        ],
      };

      const expectedResult: Partial<IPatient>[] = [resourceMock];

      expect(findFhirPatientResources(fhirMock as IFhir)).toEqual(
        expectedResult
      );
    });

    it('returns empty array if entry bundle does not exist in FHIR object', () => {
      const fhirMock: Partial<IFhir> = {
        resourceType: 'Bundle',
        id: 'some-guid',
        type: 'searchset',
      };

      expect(findFhirPatientResources(fhirMock as IFhir)).toEqual([]);
    });

    it('returns undefined if resource does not exist in FHIR object', () => {
      const fhirMock: Partial<IFhir> = {
        entry: [],
      };

      expect(findFhirPatientResources(fhirMock as IFhir)).toEqual([]);
    });
  });
});
