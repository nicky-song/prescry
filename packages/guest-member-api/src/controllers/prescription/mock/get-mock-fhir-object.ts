// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '../../../models/fhir/address';
import { IBatch } from '../../../models/fhir/batch';
import { ICodeableConcept } from '../../../models/fhir/codeable-concept';
import { ICoding } from '../../../models/fhir/coding';
import { IContactPoint } from '../../../models/fhir/contact-point';
import { IDosage } from '../../../models/fhir/dosage';
import { IDuration } from '../../../models/fhir/duration';
import { IExtension } from '../../../models/fhir/extension';
import { IFhir } from '../../../models/fhir/fhir';
import { IHumanName } from '../../../models/fhir/human-name';
import { Identifier } from '../../../models/fhir/identifier';
import { IMedicationRequestDispenseRequest } from '../../../models/fhir/medication-request/medication-request-dispense-request';
import { IMedicationRequestRequester } from '../../../models/fhir/medication-request/medication-request-requester';
import { IMedicationIngredient } from '../../../models/fhir/medication/medication-ingredient';
import { IMeta } from '../../../models/fhir/meta';
import { IPatientCommunication } from '../../../models/fhir/patient/patient-communication';
import { IQuantity } from '../../../models/fhir/quantity';
import { IRatio } from '../../../models/fhir/ratio';
import { IReference } from '../../../models/fhir/reference';
import { Resource } from '../../../models/fhir/types';

export const prescriptionFhirMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock',
  identifier: {
    value: 'MOCK-RXNUMBER',
  } as Identifier,
  type: 'collection',
  timestamp: '2021-04-29T13:30:20.0834604-07:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'MYRX-ID',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                  display: "Patient's PrimeRx ID",
                } as ICoding,
              ],
            },
            value: 'PRIMERX-ID',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                  display: "Patient's External ID",
                } as ICoding,
              ],
            },
            value: 'MYRX-ID',
          } as Identifier,
        ],
        name: [
          {
            family: 'ALAM',
            given: ['DIAN'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '1111111111',
            use: 'home',
          } as IContactPoint,
          {
            system: 'phone',
            value: '1111111111',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '1111111111',
            use: 'work',
          } as IContactPoint,
        ],
        gender: 'male',
        birthDate: '1980-01-01',
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'HICKSVILLE',
            state: 'NY',
            postalCode: '11753',
          } as IAddress,
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: 'en',
                },
              ],
              text: 'English',
            },
            preferred: true,
          } as IPatientCommunication,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: '02c6b082-04ff-4238-960a-cce5241fcb4b',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '00186077660',
            } as ICoding,
          ],
          text: '00186077660',
        } as ICodeableConcept,
        manufacturer: {
          reference: 'Cyclosporine',
        } as IReference,
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'INJ',
              display: 'INJ',
            } as ICoding,
          ],
          text: 'INJ',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'BRILINTA',
                } as ICoding,
              ],
              text: 'BRILINTA',
            } as ICodeableConcept,
            strength: {
              numerator: {
                value: 60,
                unit: 'MG',
              } as IQuantity,
            } as IRatio,
          } as IMedicationIngredient,
        ],
        batch: {
          lotNumber: '124',
          expirationDate: '2021-05-28',
        } as IBatch,
      },
    },
    {
      resource: {
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
        subject: {
          reference: 'MYRX-ID',
        },
        authoredOn: '2021-04-28',
        requester: {
          reference: 'd367acfa-60a6-4070-a553-01bc894cf179',
        },
        note: [
          {
            text: 'Prescription Note: Test data',
          },
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '1',
            },
          ],
          initialFill: {
            quantity: {
              value: 50.0,
            },
          },
          expectedSupplyDuration: {
            value: 5,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
          numberOfRepeatsAllowed: 2,
        },
        dosageInstruction: [
          { text: 'Take once daily unless it is a leap year' } as IDosage,
        ],
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: 'd367acfa-60a6-4070-a553-01bc894cf179',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                } as ICoding,
              ],
            },
            value: 'Navazo',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MCD',
                  display: 'Practitioner Medicaid number',
                } as ICoding,
              ],
            },
            system: 'https://www.medicaid.gov/',
            value: '10433',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'DEA',
                  display:
                    'Drug Enforcement Administration Registration Number',
                } as ICoding,
              ],
            },
            system: 'https://www.deanumber.com/',
            value: 'BN2998',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'NPI',
                  display: 'National Provider Identifier',
                } as ICoding,
              ],
            },
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: '1043359219',
          } as Identifier,
        ],
        name: [
          {
            use: 'official',
            family: 'Navazo',
            given: ['Luis'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'fax',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
        ],
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'SAN MARCOS1',
            state: 'CA',
            postalCode: '92078',
          } as IAddress,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Task',
        id: 'f85198bd-b2a2-4168-865e-c9c32d7c1ada',
        meta: {
          versionId: '3',
          lastUpdated: '2021-08-23T17:25:26.117+00:00',
        } as IMeta,
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '202108231017',
          } as Identifier,
          {
            type: {
              text: 'Refill Number',
            },
            value: '0',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                } as ICoding,
              ],
              text: "Patient's Client Id",
            },
            value: 'T2626262626201',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                } as ICoding,
              ],
              text: "Patient's PMS Id",
            },
            value: '108108',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'xx',
                } as ICoding,
              ],
              text: "Patient's Internal Id",
            },
            value: 'T2626262626201',
          } as Identifier,
        ],
        status: 'completed',
        businessStatus: {
          text: 'TransferCompleted',
        },
        intent: 'plan',
        authoredOn: '2021-08-23T10:20:55-07:00',
        lastModified: '2021-08-23T17:25:24Z',
      },
    },
  ],
};

export const prescriptionFhirNoBirthdateMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock',
  identifier: {
    value: 'MOCK-RXNUMBER',
  },
  type: 'collection',
  timestamp: '2021-04-29T13:30:20.0834604-07:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'MYRX-ID',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                  display: "Patient's PrimeRx ID",
                },
              ],
            },
            value: 'PRIMERX-ID',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                  display: "Patient's External ID",
                },
              ],
            },
            value: 'MYRX-ID',
          },
        ],
        name: [
          {
            family: 'ALAM',
            given: ['DIAN'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '1111111111',
            use: 'home',
          },
          {
            system: 'phone',
            value: '1111111111',
            use: 'mobile',
          },
          {
            system: 'phone',
            value: '1111111111',
            use: 'work',
          },
        ],
        gender: 'male',
        birthDate: undefined,
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'HICKSVILLE',
            state: 'NY',
            postalCode: '11753',
          },
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: 'en',
                },
              ],
              text: 'English',
            },
            preferred: true,
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: '02c6b082-04ff-4238-960a-cce5241fcb4b',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '00186077660',
            },
          ],
          text: '00186077660',
        },
        manufacturer: {
          reference: 'Cyclosporine',
        },
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'INJ',
              display: 'INJ',
            },
          ],
          text: 'INJ',
        },
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'BRILINTA',
                },
              ],
              text: 'BRILINTA',
            },
            strength: {
              numerator: {
                value: 60,
                unit: 'MG',
              },
            },
          },
        ],
        batch: {
          lotNumber: '124',
          expirationDate: '2021-05-28',
        },
      },
    },
    {
      resource: {
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
        subject: {
          reference: 'MYRX-ID',
        },
        authoredOn: '2021-04-28',
        requester: {
          reference: 'd367acfa-60a6-4070-a553-01bc894cf179',
        },
        note: [
          {
            text: 'Prescription Note: Test data',
          },
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '1',
            },
          ],
          initialFill: {
            quantity: {
              value: 50.0,
            },
          },
          expectedSupplyDuration: {
            value: 5,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
          numberOfRepeatsAllowed: 2,
        },
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: 'd367acfa-60a6-4070-a553-01bc894cf179',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                },
              ],
            },
            value: 'Navazo',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MCD',
                  display: 'Practitioner Medicaid number',
                },
              ],
            },
            system: 'https://www.medicaid.gov/',
            value: '10433',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'DEA',
                  display:
                    'Drug Enforcement Administration Registration Number',
                },
              ],
            },
            system: 'https://www.deanumber.com/',
            value: 'BN2998',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'NPI',
                  display: 'National Provider Identifier',
                },
              ],
            },
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: '1043359219',
          },
        ],
        name: [
          {
            use: 'official',
            family: 'Navazo',
            given: ['Luis'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          },
          {
            system: 'phone',
            value: '5164083999',
            use: 'mobile',
          },
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          },
          {
            system: 'fax',
            value: '5164083999',
            use: 'work',
          },
        ],
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'SAN MARCOS1',
            state: 'CA',
            postalCode: '92078',
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Task',
        id: 'f85198bd-b2a2-4168-865e-c9c32d7c1ada',
        meta: {
          versionId: '3',
          lastUpdated: '2021-08-23T17:25:26.117+00:00',
        },
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '202108231017',
          },
          {
            type: {
              text: 'Refill Number',
            },
            value: '0',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                },
              ],
              text: "Patient's Client Id",
            },
            value: 'T2626262626201',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                },
              ],
              text: "Patient's PMS Id",
            },
            value: '108108',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'xx',
                },
              ],
              text: "Patient's Internal Id",
            },
            value: 'T2626262626201',
          },
        ],
        status: 'completed',
        businessStatus: {
          text: 'TransferCompleted',
        },
        intent: 'plan',
        authoredOn: '2021-08-23T10:20:55-07:00',
        lastModified: '2021-08-23T17:25:24Z',
      },
    },
  ],
};

export const prescriptionFhirNoPatientMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock',
  identifier: {
    value: 'MOCK-RXNUMBER',
  } as Identifier,
  type: 'collection',
  timestamp: '2021-04-29T13:30:20.0834604-07:00',
  entry: [
    {
      resource: {
        resourceType: 'Medication',
        id: '02c6b082-04ff-4238-960a-cce5241fcb4b',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '00186077660',
            } as ICoding,
          ],
          text: '00186077660',
        } as ICodeableConcept,
        manufacturer: {
          reference: 'Cyclosporine',
        } as IReference,
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'INJ',
              display: 'INJ',
            } as ICoding,
          ],
          text: 'INJ',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'BRILINTA',
                } as ICoding,
              ],
              text: 'BRILINTA',
            } as ICodeableConcept,
            strength: {
              numerator: {
                value: 60,
                unit: 'MG',
              } as IQuantity,
            } as IRatio,
          } as IMedicationIngredient,
        ],
        batch: {
          lotNumber: '124',
          expirationDate: '2021-05-28',
        } as IBatch,
      },
    },
    {
      resource: {
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
        subject: {
          reference: 'MYRX-ID',
        },
        authoredOn: '2021-04-28',
        requester: {
          reference: 'd367acfa-60a6-4070-a553-01bc894cf179',
        },
        note: [
          {
            text: 'Prescription Note: Test data',
          },
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '1',
            },
          ],
          initialFill: {
            quantity: {
              value: 50.0,
            },
          },
          expectedSupplyDuration: {
            value: 5,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
          numberOfRepeatsAllowed: 2,
        },
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: 'd367acfa-60a6-4070-a553-01bc894cf179',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                } as ICoding,
              ],
            },
            value: 'Navazo',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MCD',
                  display: 'Practitioner Medicaid number',
                } as ICoding,
              ],
            },
            system: 'https://www.medicaid.gov/',
            value: '10433',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'DEA',
                  display:
                    'Drug Enforcement Administration Registration Number',
                } as ICoding,
              ],
            },
            system: 'https://www.deanumber.com/',
            value: 'BN2998',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'NPI',
                  display: 'National Provider Identifier',
                } as ICoding,
              ],
            },
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: '1043359219',
          } as Identifier,
        ],
        name: [
          {
            use: 'official',
            family: 'Navazo',
            given: ['Luis'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'fax',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
        ],
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'SAN MARCOS1',
            state: 'CA',
            postalCode: '92078',
          } as IAddress,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Task',
        id: 'f85198bd-b2a2-4168-865e-c9c32d7c1ada',
        meta: {
          versionId: '3',
          lastUpdated: '2021-08-23T17:25:26.117+00:00',
        } as IMeta,
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '202108231017',
          } as Identifier,
          {
            type: {
              text: 'Refill Number',
            },
            value: '0',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                } as ICoding,
              ],
              text: "Patient's Client Id",
            },
            value: 'T2626262626201',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                } as ICoding,
              ],
              text: "Patient's PMS Id",
            },
            value: '108108',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'xx',
                } as ICoding,
              ],
              text: "Patient's Internal Id",
            },
            value: 'T2626262626201',
          } as Identifier,
        ],
        status: 'completed',
        businessStatus: {
          text: 'TransferCompleted',
        },
        intent: 'plan',
        authoredOn: '2021-08-23T10:20:55-07:00',
        lastModified: '2021-08-23T17:25:24Z',
      },
    },
  ],
};

export const prescriptionFhirMockNoZip: IFhir = {
  resourceType: 'Bundle',
  id: 'mock-zip',
  identifier: {
    value: 'MOCK-RXNUMBER',
  } as Identifier,
  type: 'collection',
  timestamp: '2021-04-29T13:30:20.0834604-07:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'MYRX-ID',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                  display: "Patient's PrimeRx ID",
                } as ICoding,
              ],
            },
            value: 'PRIMERX-ID',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                  display: "Patient's External ID",
                } as ICoding,
              ],
            },
            value: 'MYRX-ID',
          } as Identifier,
        ],
        name: [
          {
            family: 'ALAM',
            given: ['DIAN'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '1111111111',
            use: 'home',
          } as IContactPoint,
          {
            system: 'phone',
            value: '1111111111',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '1111111111',
            use: 'work',
          } as IContactPoint,
        ],
        gender: 'male',
        birthDate: '1980-01-01',
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'HICKSVILLE',
            state: 'NY',
          } as IAddress,
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: 'en',
                },
              ],
              text: 'English',
            },
            preferred: true,
          } as IPatientCommunication,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: '02c6b082-04ff-4238-960a-cce5241fcb4b',
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                } as ICoding,
              ],
            },
            value: '300',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',

                  display: 'Strength Unit of Measure',
                } as ICoding,
              ],
            },

            value: 'MG',
          } as Identifier,
        ],
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '13913000419',
            } as ICoding,
          ],
          text: '13913000419',
        } as ICodeableConcept,
        manufacturer: {
          reference: 'Cyclosporine',
        } as IReference,
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'TABS',
              display: 'TABS',
            } as ICoding,
          ],
          text: 'TABS',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'GRALISE',
                } as ICoding,
              ],
              text: 'GRALISE',
            } as ICodeableConcept,
            strength: {
              numerator: {
                value: 300,
                unit: 'MG',
              } as IQuantity,
            } as IRatio,
          } as IMedicationIngredient,
        ],
        batch: {
          lotNumber: '124',
          expirationDate: '2021-05-28',
        } as IBatch,
      },
    },
    {
      resource: {
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
        subject: {
          reference: 'MYRX-ID',
        },
        authoredOn: '2021-04-28',
        requester: {
          reference: 'd367acfa-60a6-4070-a553-01bc894cf179',
        },
        note: [
          {
            text: 'Prescription Note: Test data',
          },
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '1',
            },
          ],
          initialFill: {
            quantity: {
              value: 90.0,
            },
          },
          expectedSupplyDuration: {
            value: 90,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
          numberOfRepeatsAllowed: 2,
        },
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: 'd367acfa-60a6-4070-a553-01bc894cf179',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                } as ICoding,
              ],
            },
            value: 'Navazo',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MCD',
                  display: 'Practitioner Medicaid number',
                } as ICoding,
              ],
            },
            system: 'https://www.medicaid.gov/',
            value: '10433',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'DEA',
                  display:
                    'Drug Enforcement Administration Registration Number',
                } as ICoding,
              ],
            },
            system: 'https://www.deanumber.com/',
            value: 'BN2998',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'NPI',
                  display: 'National Provider Identifier',
                } as ICoding,
              ],
            },
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: '1043359219',
          } as Identifier,
        ],
        name: [
          {
            use: 'official',
            family: 'Navazo',
            given: ['Luis'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'fax',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
        ],
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'SAN MARCOS1',
            state: 'CA',
            postalCode: '92078',
          } as IAddress,
        ],
      },
    },
  ],
};

export const prescriptionWithMultiplePharmacyFhirMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock-transfer-request',
  identifier: {
    value: 'MOCK-RXNUMBER',
  } as Identifier,
  type: 'collection',
  timestamp: '2021-04-29T13:30:20.0834604-07:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'MYRX-ID',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                  display: "Patient's PrimeRx ID",
                } as ICoding,
              ],
            },
            value: 'PRIMERX-ID',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                  display: "Patient's External ID",
                } as ICoding,
              ],
            },
            value: 'MYRX-ID',
          } as Identifier,
        ],
        name: [
          {
            family: 'ALAM',
            given: ['DIAN'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '1111111111',
            use: 'home',
          } as IContactPoint,
          {
            system: 'phone',
            value: '1111111111',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '1111111111',
            use: 'work',
          } as IContactPoint,
        ],
        gender: 'male',
        birthDate: '1980-01-01',
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'HICKSVILLE',
            state: 'NY',
            postalCode: '11801',
          } as IAddress,
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: 'en',
                },
              ],
              text: 'English',
            },
            preferred: true,
          } as IPatientCommunication,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: '02c6b082-04ff-4238-960a-cce5241fcb4b',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '80777027310',
            } as ICoding,
          ],
          text: '80777027310',
        } as ICodeableConcept,
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                } as ICoding,
              ],
            },
            value: '2.5-2.5',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',

                  display: 'Strength Unit of Measure',
                } as ICoding,
              ],
            },
            value: 'MG',
          } as Identifier,
        ],
        manufacturer: {
          reference: 'MODERNA US',
        } as IReference,
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'INJ',
              display: 'INJ',
            } as ICoding,
          ],
          text: 'INJ',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'MODERNA COVID-19',
                } as ICoding,
              ],
              text: 'MODERNA COVID-19',
            } as ICodeableConcept,
            strength: {
              numerator: {
                value: 60,
                unit: 'MG',
              } as IQuantity,
            } as IRatio,
          } as IMedicationIngredient,
        ],
        batch: {
          lotNumber: '124',
          expirationDate: '2021-05-28',
        } as IBatch,
      },
    },
    {
      resource: {
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
        subject: {
          reference: 'MYRX-ID',
        },
        authoredOn: '2021-04-28',
        requester: {
          reference: 'd367acfa-60a6-4070-a553-01bc894cf179',
        },
        note: [
          {
            text: 'Prescription Note: Test data',
          },
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '0',
            },
          ],
          initialFill: {
            quantity: {
              value: 20.0,
            },
          },
          expectedSupplyDuration: {
            value: 5,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
          numberOfRepeatsAllowed: 1,
        },
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: 'd367acfa-60a6-4070-a553-01bc894cf179',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                } as ICoding,
              ],
            },
            value: 'Navazo',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MCD',
                  display: 'Practitioner Medicaid number',
                } as ICoding,
              ],
            },
            system: 'https://www.medicaid.gov/',
            value: '10433',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'DEA',
                  display:
                    'Drug Enforcement Administration Registration Number',
                } as ICoding,
              ],
            },
            system: 'https://www.deanumber.com/',
            value: 'BN2998',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'NPI',
                  display: 'National Provider Identifier',
                } as ICoding,
              ],
            },
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: '1043359219',
          } as Identifier,
        ],
        name: [
          {
            use: 'official',
            family: 'Navazo',
            given: ['Luis'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'fax',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
        ],
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'SAN MARCOS1',
            state: 'CA',
            postalCode: '92078',
          } as IAddress,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: '4929432', // ncpdp
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                } as ICoding,
              ],
            },
            value: '4929432',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Source',
                  display: 'Source Pharmacy',
                } as ICoding,
              ],
            },
            value: 'Source',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                } as ICoding,
              ],
            },
            value: 'npi mock value',
          } as Identifier,
        ],
        name: 'Prescryptive Pharmacy',
        alias: ['Selected Pharmacy'],
        address: [
          {
            line: ['line 1', 'line 2'],
            city: 'city',
            state: 'WA',
            postalCode: '92078',
          } as IAddress,
        ],
        telecom: [
          {
            system: 'phone',
            value: '555555555',
          } as IContactPoint,
          {
            system: 'fax',
            value: '888888888',
          } as IContactPoint,
          {
            system: 'email',
            value: 'test@prescryptivepharmacy.com',
          } as IContactPoint,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: '4929433', // ncpdp
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                } as ICoding,
              ],
            },
            value: '4929433',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Destination',
                  display: 'Destination Pharmacy',
                } as ICoding,
              ],
            },
            value: 'Destination',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                } as ICoding,
              ],
            },
            value: 'npi mock value',
          } as Identifier,
        ],
        name: 'Prescryptive Pharmacy',
        alias: ['Selected Pharmacy'],
        address: [
          {
            line: ['line 1', 'line 2'],
            city: 'city',
            state: 'WA',
            postalCode: '92078',
          } as IAddress,
        ],
        telecom: [
          {
            system: 'phone',
            value: '555555555',
          } as IContactPoint,
          {
            system: 'fax',
            value: '888888888',
          } as IContactPoint,
          {
            system: 'email',
            value: 'test@prescryptivepharmacy.com',
          } as IContactPoint,
        ],
      },
    },
  ],
};

export const prescriptionWithPharmacyFhirMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock-pharmacy',
  identifier: {
    value: 'MOCK-RXNUMBER',
  } as Identifier,
  type: 'collection',
  timestamp: '2021-04-29T13:30:20.0834604-07:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'MYRX-ID',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                  display: "Patient's PrimeRx ID",
                } as ICoding,
              ],
            },
            value: 'PRIMERX-ID',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                  display: "Patient's External ID",
                } as ICoding,
              ],
            },
            value: 'MYRX-ID',
          } as Identifier,
        ],
        name: [
          {
            family: 'ALAM',
            given: ['DIAN'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '1111111111',
            use: 'home',
          } as IContactPoint,
          {
            system: 'phone',
            value: '1111111111',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '1111111111',
            use: 'work',
          } as IContactPoint,
        ],
        gender: 'male',
        birthDate: '1980-01-01',
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'HICKSVILLE',
            state: 'NY',
            postalCode: '11801',
          } as IAddress,
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: 'en',
                },
              ],
              text: 'English',
            },
            preferred: true,
          } as IPatientCommunication,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: '02c6b082-04ff-4238-960a-cce5241fcb4b',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '80777027310',
            } as ICoding,
          ],
          text: '80777027310',
        } as ICodeableConcept,
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                } as ICoding,
              ],
            },
            value: '2.5-2.5',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',

                  display: 'Strength Unit of Measure',
                } as ICoding,
              ],
            },

            value: 'MG',
          } as Identifier,
        ],
        manufacturer: {
          reference: 'MODERNA US',
        } as IReference,
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'INJ',
              display: 'INJ',
            } as ICoding,
          ],
          text: 'INJ',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'MODERNA COVID-19',
                } as ICoding,
              ],
              text: 'MODERNA COVID-19',
            } as ICodeableConcept,
            strength: {
              numerator: {
                value: 60,
                unit: 'MG',
              } as IQuantity,
            } as IRatio,
          } as IMedicationIngredient,
        ],
        batch: {
          lotNumber: '124',
          expirationDate: '2021-05-28',
        } as IBatch,
      },
    },
    {
      resource: {
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
        subject: {
          reference: 'MYRX-ID',
        },
        authoredOn: '2021-04-28',
        requester: {
          reference: 'd367acfa-60a6-4070-a553-01bc894cf179',
        },
        note: [
          {
            text: 'Prescription Note: Test data',
          },
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '0',
            },
          ],
          initialFill: {
            quantity: {
              value: 20.0,
            },
          },
          expectedSupplyDuration: {
            value: 5,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
          numberOfRepeatsAllowed: 1,
        },
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: 'd367acfa-60a6-4070-a553-01bc894cf179',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                } as ICoding,
              ],
            },
            value: 'Navazo',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MCD',
                  display: 'Practitioner Medicaid number',
                } as ICoding,
              ],
            },
            system: 'https://www.medicaid.gov/',
            value: '10433',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'DEA',
                  display:
                    'Drug Enforcement Administration Registration Number',
                } as ICoding,
              ],
            },
            system: 'https://www.deanumber.com/',
            value: 'BN2998',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'NPI',
                  display: 'National Provider Identifier',
                } as ICoding,
              ],
            },
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: '1043359219',
          } as Identifier,
        ],
        name: [
          {
            use: 'official',
            family: 'Navazo',
            given: ['Luis'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
          {
            system: 'fax',
            value: '5164083999',
            use: 'work',
          } as IContactPoint,
        ],
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'SAN MARCOS1',
            state: 'CA',
            postalCode: '92078',
          } as IAddress,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: '4929432', // ncpdp
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                } as ICoding,
              ],
            },
            value: '4929432',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                } as ICoding,
              ],
            },
            value: 'npi mock value',
          } as Identifier,
        ],
        name: 'Prescryptive Pharmacy',
        alias: ['Selected Pharmacy'],
        address: [
          {
            line: ['line 1', 'line 2'],
            city: 'city',
            state: 'WA',
            postalCode: '92078',
          } as IAddress,
        ],
        telecom: [
          {
            system: 'phone',
            value: '555555555',
          } as IContactPoint,
          {
            system: 'fax',
            value: '888888888',
          } as IContactPoint,
          {
            system: 'email',
            value: 'test@prescryptivepharmacy.com',
          } as IContactPoint,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Task',
        id: 'f85198bd-b2a2-4168-865e-c9c32d7c1ada',
        meta: {
          versionId: '3',
          lastUpdated: '2021-08-23T17:25:26.117+00:00',
        } as IMeta,
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '202108231017',
          } as Identifier,
          {
            type: {
              text: 'Refill Number',
            },
            value: '0',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                } as ICoding,
              ],
              text: "Patient's Client Id",
            },
            value: 'T2626262626201',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                } as ICoding,
              ],
              text: "Patient's PMS Id",
            },
            value: '108108',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'xx',
                } as ICoding,
              ],
              text: "Patient's Internal Id",
            },
            value: 'T2626262626201',
          } as Identifier,
        ],
        status: 'completed',
        businessStatus: {
          text: 'TransferCompleted',
        },
        intent: 'plan',
        authoredOn: '2021-08-23T10:20:55-07:00',
        lastModified: '2021-08-23T17:25:24Z',
      },
    },
  ],
};

export const prescriptionTransferFhirMock: IFhir = {
  resourceType: 'Bundle',
  id: '12345',
  identifier: {
    type: {
      text: 'Prescription Number',
    },
    value: '60302',
  } as Identifier,
  type: 'collection',
  timestamp: '2021-10-05T00:20:13.8955378+00:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'member-id',
        identifier: [
          {
            use: 'official',
            type: {
              coding: [
                {
                  code: 'DL',
                  display: 'Driver License',
                } as ICoding,
              ],
            },
            value: '12345',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                  display: "Patient's PrimeRx ID",
                } as ICoding,
              ],
            },
            value: '14',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                  display: "Patient's External ID",
                } as ICoding,
              ],
            },
            value: 'id-1',
          } as Identifier,
        ],
        name: [
          {
            family: 'SANDEEP',
            given: ['JAIN'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '5153065487',
            use: 'home',
          } as IContactPoint,
          {
            system: 'phone',
            value: '5153065487',
            use: 'mobile',
          } as IContactPoint,
          {
            system: 'email',
            value: 'sandeep@prescryptive.com',
            use: 'home',
          } as IContactPoint,
        ],
        gender: 'male',
        birthDate: '1990-01-01',
        address: [
          {
            city: 'Syosset',
            state: 'NY',
            postalCode: '11753',
          } as IAddress,
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: '1',
                },
              ],
            },
            preferred: true,
          } as IPatientCommunication,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: 'a93308c2-7ee0-44b0-bf33-cb087ea1a8c6',
        identifier: [
          {
            type: {
              text: 'GPI',
            },
            value: '85158470000315',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                } as ICoding,
              ],
            },
            value: '60',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',
                  display: 'Strength Unit of Measure',
                } as ICoding,
              ],
            },
            value: 'MG',
          } as Identifier,
        ],
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '00023530101',
            } as ICoding,
          ],
          text: '00023530101',
        } as ICodeableConcept,
        manufacturer: {
          reference: 'ASTRAZENEC',
        } as IReference,
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'TAB',
              display: 'TAB',
            } as ICoding,
          ],
          text: 'TAB',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'BRILINTA 60MG TAB',
                } as ICoding,
              ],
              text: 'BRILINTA 60MG TAB',
            } as ICodeableConcept,
          } as IMedicationIngredient,
        ],
      },
    },
    {
      resource: {
        resourceType: 'MedicationRequest',
        id: '8edc7b57-dd61-4600-a973-25e5ed7009c0',
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '60302',
          } as Identifier,
        ],
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: 'a93308c2-7ee0-44b0-bf33-cb087ea1a8c6',
        } as IReference,
        subject: {
          reference: 'T515306548701',
        } as IReference,
        authoredOn: '2021-10-05',
        requester: {
          reference: '2dfcc2c1-d089-49ca-a87b-0190dedcd57c',
        } as IMedicationRequestRequester,
        dosageInstruction: [
          {
            text: 'UD',
          } as IDosage,
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '0',
            } as IExtension,
          ],
          initialFill: {
            quantity: {
              value: 60,
            } as IQuantity,
          },
          numberOfRepeatsAllowed: 0,
          expectedSupplyDuration: {
            value: 30,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          } as IDuration,
          quantity: {
            value: 60,
          } as IQuantity,
        } as IMedicationRequestDispenseRequest,
      },
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: '2dfcc2c1-d089-49ca-a87b-0190dedcd57c',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                } as ICoding,
              ],
            },
            value: 'TEST',
          } as Identifier,
        ],
        name: [
          {
            use: 'official',
            family: 'TEST',
            given: ['DOCTOR'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '516',
            use: 'work',
          } as IContactPoint,
          {
            system: 'fax',
            value: '5164083992',
            use: 'work',
          } as IContactPoint,
        ],
        address: [
          {
            city: 'SYOSSET',
            state: 'NY',
            postalCode: '11791',
          } as IAddress,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Basic',
        id: 'd3dd0dbf-59e8-4b58-a293-dad33ed329fe',
        identifier: [
          {
            type: {
              text: 'TransferInRequest',
            },
            value: 'bc080e93-71ef-4420-9085-2c31d954b236',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                } as ICoding,
              ],
            },
            value: 'T515306548701',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                } as ICoding,
              ],
            },
            value: '14',
          } as Identifier,
        ],
        code: {
          text: 'Custom Mapping of Identifiers',
        },
        subject: {
          reference: 'Bundle/d3dd0dbf-59e8-4b58-a293-dad33ed329fe',
        } as IReference,
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Organization',
        id: 'some-guid',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                } as ICoding,
              ],
            },
            value: 'pharmacy-id',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                } as ICoding,
              ],
            },
            value: 'npi mock value',
          } as Identifier,
        ],
        name: 'Prescryptive Pharmacy',
        alias: ['Selected Pharmacy'],
        address: [
          {
            line: ['line 1', 'line 2'],
            city: 'city',
            state: 'WA',
            postalCode: '92078',
          } as IAddress,
        ],
        telecom: [
          {
            system: 'phone',
            value: '555555555',
          } as IContactPoint,
          {
            system: 'fax',
            value: '888888888',
          } as IContactPoint,
          {
            system: 'email',
            value: 'test@prescryptivepharmacy.com',
          } as IContactPoint,
        ],
      },
    },
  ],
};

export const getAndPublishPrescriptionPriceFhirMock: IFhir = {
  resourceType: 'Bundle',
  id: '69635d89-004f-42c3-af47-afd2459ff711',
  identifier: {
    type: {
      text: 'Prescription Number',
    },
    value: '60394',
  } as Identifier,
  type: 'collection',
  timestamp: '2021-10-27T17:14:33.5825922+00:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'CA7CQV01',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                  display: "Patient's PrimeRx ID",
                } as ICoding,
              ],
            },
            value: '115',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                  display: "Patient's External ID",
                } as ICoding,
              ],
            },
            value: 'CA7CQV01',
          } as Identifier,
        ],
        name: [
          {
            family: 'LASTNAME',
            given: ['FIRSTNAME'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: 'mock-phone',
            use: 'home',
          } as IContactPoint,
          {
            system: 'phone',
            value: 'mock-phone',
            use: 'mobile',
          } as IContactPoint,
        ],
        gender: 'other',
        birthDate: 'mock-birthdate',
        address: [
          {
            city: 'mock-city',
            state: 'mock-state',
            postalCode: 'mock-zip',
          } as IAddress,
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: '1',
                },
              ],
            },
            preferred: true,
          } as IPatientCommunication,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: '56626b51-97a6-465e-a4df-aeb0b80b34db',
        identifier: [
          {
            type: {
              text: 'GPI',
            },
            value: '62540030000330',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                } as ICoding,
              ],
            },
            value: '600',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',
                  display: 'Strength Unit of Measure',
                } as ICoding,
              ],
            },
            value: 'MG',
          } as Identifier,
        ],
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '13913000519',
            } as ICoding,
          ],
          text: '13913000519',
        } as ICodeableConcept,
        manufacturer: {
          reference: 'ALMATICA',
        } as IReference,
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'TAB ER',
              display: 'TAB ER',
            } as ICoding,
          ],
          text: 'TAB ER',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'GRALISE 600MG TAB ER',
                } as ICoding,
              ],
              text: 'GRALISE 600MG TAB ER',
            } as ICodeableConcept,
          } as IMedicationIngredient,
        ],
      },
    },
    {
      resource: {
        resourceType: 'MedicationRequest',
        id: 'acaaa0fa-8e05-4a6f-9745-6a893a15ecaa',
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '60394',
          } as Identifier,
        ],
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: '56626b51-97a6-465e-a4df-aeb0b80b34db',
        } as IReference,
        subject: {
          reference: 'CA7CQV01',
        } as IReference,
        authoredOn: '2021-10-27',
        requester: {
          reference: '3039a567-bde2-484e-9d20-ec6d6da6a100',
        } as IMedicationRequestRequester,
        dosageInstruction: [
          {
            text: 'UD',
          } as IDosage,
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '1',
            } as IExtension,
          ],
          initialFill: {
            quantity: {
              value: 90,
            } as IQuantity,
          },
          numberOfRepeatsAllowed: 1,
          expectedSupplyDuration: {
            value: 1,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          } as IDuration,
        } as IMedicationRequestDispenseRequest,
      },
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: '3039a567-bde2-484e-9d20-ec6d6da6a100',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                } as ICoding,
              ],
            },
            value: 'TEST',
          } as Identifier,
        ],
        name: [
          {
            use: 'official',
            family: 'TEST',
            given: ['DOCTOR'],
          } as IHumanName,
        ],
        telecom: [
          {
            system: 'phone',
            value: '516',
            use: 'work',
          } as IContactPoint,
          {
            system: 'fax',
            value: '5164083992',
            use: 'work',
          } as IContactPoint,
        ],
        address: [
          {
            city: 'SYOSSET',
            state: 'NY',
            postalCode: '11791',
          } as IAddress,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Basic',
        id: '69635d89-004f-42c3-af47-afd2459ff711',
        identifier: [
          {
            type: {
              text: 'TransferInRequest',
            },
            value: '2ac2eef8-0d46-4991-ad27-1e7b4d15f7c2',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                } as ICoding,
              ],
            },
            value: 'CA7CQV01',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                } as ICoding,
              ],
            },
            value: '115',
          } as Identifier,
        ],
        code: {
          text: 'Custom Mapping of Identifiers',
        },
        subject: {
          reference: 'Bundle/69635d89-004f-42c3-af47-afd2459ff711',
        } as IReference,
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Organization',
        id: '63583158-0a69-407d-99da-f1c4af9b2759',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                } as ICoding,
              ],
            },
            value: '5920447',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Destination',
                  display: 'Destination Pharmacy',
                } as ICoding,
              ],
            },
            value: 'Destination',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                } as ICoding,
              ],
            },
            value: '1215472600',
          } as Identifier,
        ],
        name: 'UROLOGY AUSTIN PHARMACY LLC',
        alias: ['UROLOGY AUSTIN PHARMACY LLC'],
        telecom: [
          {
            system: 'phone',
            value: '5124103770',
          } as IContactPoint,
          {
            system: 'fax',
            value: '5124103780',
          } as IContactPoint,
          {
            system: 'email',
            value: 'PHARMACY@UROLOGYAUSTIN.COM',
          } as IContactPoint,
        ],
        address: [
          {
            line: ['16040 PARK VALLEY DR BLDG A # 111'],
            city: 'ROUND ROCK',
            state: 'TX',
            postalCode: '786813578',
          } as IAddress,
        ],
      },
    },
    {
      resource: {
        resourceType: 'Task',
        id: '57a98ead-4f8a-4f5e-bb1b-db3e9fc220e7',
        meta: {
          versionId: '1',
          lastUpdated: '2021-10-27T17:14:37.805+00:00',
        } as IMeta,
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '60394',
          } as Identifier,
          {
            type: {
              text: 'Refill Number',
            },
            value: '0',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'MR',
                } as ICoding,
              ],
              text: "Patient's Client Id",
            },
            value: 'CA7CQV01',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                } as ICoding,
              ],
              text: "Patient's PMS Id",
            },
            value: '115',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'xx',
                } as ICoding,
              ],
              text: "Patient's Internal Id",
            },
            value: 'CA7CQV01',
          } as Identifier,
        ],
        status: 'completed',
        businessStatus: {
          text: 'Received',
        },
        intent: 'plan',
        authoredOn: '2021-10-27T17:14:37Z',
        lastModified: '2021-10-27T17:14:37Z',
      },
    },
  ],
};

export const prescriptionFhirWithoutMemberIdMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock-no-id',
  identifier: {
    type: {
      text: 'Prescription Number',
    },
    value: 'MOCK-RXNUMBER',
  },
  type: 'collection',
  timestamp: '2021-04-29T13:30:20.0834604-07:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                  display: "Patient's PrimeRx ID",
                },
              ],
            },
            value: 'PRIMERX-ID',
          },
        ],
        name: [
          {
            family: 'ALAM',
            given: ['DIAN'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '1111111111',
            use: 'home',
          },
          {
            system: 'phone',
            value: '1111111111',
            use: 'mobile',
          },
          {
            system: 'phone',
            value: '1111111111',
            use: 'work',
          },
        ],
        gender: 'male',
        birthDate: '1980-01-01',
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'HICKSVILLE',
            state: 'NY',
            postalCode: '11753',
          },
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: 'en',
                },
              ],
              text: 'English',
            },
            preferred: true,
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: '02c6b082-04ff-4238-960a-cce5241fcb4b',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '00186077660',
            },
          ],
          text: '00186077660',
        },
        manufacturer: {
          reference: 'Cyclosporine',
        },
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'INJ',
              display: 'INJ',
            },
          ],
          text: 'INJ',
        },
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'BRILINTA',
                },
              ],
              text: 'BRILINTA',
            },
            strength: {
              numerator: {
                value: 60,
                unit: 'MG',
              },
            },
          },
        ],
        batch: {
          lotNumber: '124',
          expirationDate: '2021-05-28',
        },
      },
    },
    {
      resource: {
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
        subject: {
          reference: 'MYRX-ID',
        },
        authoredOn: '2021-04-28',
        requester: {
          reference: 'd367acfa-60a6-4070-a553-01bc894cf179',
        },
        note: [
          {
            text: 'Prescription Note: Test data',
          },
        ],
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '1',
            },
          ],
          initialFill: {
            quantity: {
              value: 50.0,
            },
          },
          expectedSupplyDuration: {
            value: 5,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
          numberOfRepeatsAllowed: 2,
        },
      } as Resource,
    },
    {
      resource: {
        resourceType: 'Practitioner',
        id: 'd367acfa-60a6-4070-a553-01bc894cf179',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MD',
                  display: 'Medical License Number',
                },
              ],
            },
            value: 'Navazo',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'MCD',
                  display: 'Practitioner Medicaid number',
                },
              ],
            },
            system: 'https://www.medicaid.gov/',
            value: '10433',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'DEA',
                  display:
                    'Drug Enforcement Administration Registration Number',
                },
              ],
            },
            system: 'https://www.deanumber.com/',
            value: 'BN2998',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'NPI',
                  display: 'National Provider Identifier',
                },
              ],
            },
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: '1043359219',
          },
        ],
        name: [
          {
            use: 'official',
            family: 'Navazo',
            given: ['Luis'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          },
          {
            system: 'phone',
            value: '5164083999',
            use: 'mobile',
          },
          {
            system: 'phone',
            value: '5164083999',
            use: 'work',
          },
          {
            system: 'fax',
            value: '5164083999',
            use: 'work',
          },
        ],
        address: [
          {
            line: ['6800 Jericho Turnpike'],
            city: 'SAN MARCOS1',
            state: 'CA',
            postalCode: '92078',
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Basic',
        id: 'beb0aef6-6a00-4c96-aabd-6b28e2e63b75',
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'PT',
                },
              ],
            },
            value: '379',
          },
        ],
        code: {
          text: 'Custom Mapping of Identifiers',
        },
        subject: {
          reference: 'Bundle/beb0aef6-6a00-4c96-aabd-6b28e2e63b75',
        },
      },
    },
  ],
};

export const prescriptionBlockchainFhirMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock-blockchain',
  identifier: {
    value: 'MOCK-RXNUMBER',
  } as Identifier,
  entry: [
    {
      resource: {
        resourceType: 'Medication',
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                } as ICoding,
              ],
            },
            value: '5',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',
                  display: 'Strength Unit of Measure',
                } as ICoding,
              ],
            },
            value: 'mg',
          } as Identifier,
        ],
        code: {
          coding: [
            {
              system: 'National Drug Code (NDC)',
              code: '59746017210',
            },
          ],
          text: 'MedicationCodes',
        } as ICodeableConcept,
        status: 'active',
        form: {
          coding: [
            {
              code: 'TAB',
            },
          ],
          text: 'Prescribed medication form',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'Prednisone 5 mg tablet',
                },
              ],
              text: 'Prednisone 5 mg tablet',
            } as ICodeableConcept,
          } as IMedicationIngredient,
        ],
      } as Resource,
    },
    {
      resource: {
        resourceType: 'MedicationRequest',
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'PrescriberOrderNumber',
                } as ICoding,
              ],
              text: 'Prescriber order number',
            },
            value: 'CORE NEWRX 3',
          } as Identifier,
        ],
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: 'c61b35401293459fabad7987700c1111',
        },
        authoredOn: '2019-01-01',
        subject: {
          reference: 'MYRX-ID',
        },
        requester: {
          reference: '1000192975',
        },
        dosageInstruction: [
          {
            text: 'Take 6 tablets by mouth once daily for 2 days, then take 4 tablets by mouth once daily for 2 days, then take 2 tablets by mouth once daily for 2 days',
          } as IDosage,
        ],
        dispenseRequest: {
          numberOfRepeatsAllowed: 1,
          quantity: {
            value: 24,
            system: 'NCI',
          },
          expectedSupplyDuration: {
            value: 6,
            unit: 'days',
          },
        },
      } as Resource,
    },
  ],
};

export const prescriptionBlockchainNoMasterIdFhirMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock-blockchain',
  identifier: {
    value: 'MOCK-RXNUMBER',
  } as Identifier,
  entry: [
    {
      resource: {
        resourceType: 'Medication',
        code: {
          coding: [
            {
              code: '00186077660',
            } as ICoding,
          ],
          text: '00186077660',
        } as ICodeableConcept,
        form: {
          coding: [
            {
              code: 'INJ',
              display: 'INJ',
            } as ICoding,
          ],
          text: 'INJ',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'BRILINTA',
                } as ICoding,
              ],
              text: 'BRILINTA',
            } as ICodeableConcept,
            strength: {
              numerator: {
                value: 60,
                unit: 'MG',
              } as IQuantity,
            } as IRatio,
          } as IMedicationIngredient,
        ],
      },
    },
    {
      resource: {
        resourceType: 'MedicationRequest',
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: 'MOCK-RXNUMBER',
          },
        ],
        authoredOn: '2021-04-28',
        requester: {
          reference: 'd367acfa-60a6-4070-a553-01bc894cf179',
        },
        dispenseRequest: {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining',
              valueString: '1',
            },
          ],
          initialFill: {
            quantity: {
              value: 50.0,
            },
          },
          expectedSupplyDuration: {
            value: 5,
          },
          numberOfRepeatsAllowed: 2,
          performer: {
            reference: '5920447',
          },
        },
        dosageInstruction: [
          { text: 'Take once daily unless it is a leap year' } as IDosage,
        ],
      } as Resource,
    },
  ],
};

export const prescriptionBlockchainWithPharmacyIdFhirMock: IFhir = {
  resourceType: 'Bundle',
  id: 'mock-blockchain',
  identifier: {
    value: 'MOCK-RXNUMBER',
  } as Identifier,
  entry: [
    {
      resource: {
        resourceType: 'Medication',
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                } as ICoding,
              ],
            },
            value: '5',
          } as Identifier,
          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',
                  display: 'Strength Unit of Measure',
                } as ICoding,
              ],
            },
            value: 'mg',
          } as Identifier,
        ],
        code: {
          coding: [
            {
              system: 'National Drug Code (NDC)',
              code: '59746017210',
            },
          ],
          text: 'MedicationCodes',
        } as ICodeableConcept,
        status: 'active',
        form: {
          coding: [
            {
              code: 'TAB',
            },
          ],
          text: 'Prescribed medication form',
        } as ICodeableConcept,
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'Prednisone 5 mg tablet',
                },
              ],
              text: 'Prednisone 5 mg tablet',
            } as ICodeableConcept,
          } as IMedicationIngredient,
        ],
      } as Resource,
    },
    {
      resource: {
        resourceType: 'MedicationRequest',
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'PrescriberOrderNumber',
                } as ICoding,
              ],
              text: 'Prescriber order number',
            },
            value: 'CORE NEWRX 3',
          } as Identifier,
        ],
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: 'c61b35401293459fabad7987700c1111',
        },
        authoredOn: '2019-01-01',
        subject: {
          reference: '101010110',
        },
        requester: {
          reference: '1000192975',
        },
        dosageInstruction: [
          {
            text: 'Take 6 tablets by mouth once daily for 2 days, then take 4 tablets by mouth once daily for 2 days, then take 2 tablets by mouth once daily for 2 days',
          } as IDosage,
        ],
        dispenseRequest: {
          numberOfRepeatsAllowed: 1,
          quantity: {
            value: 24,
            system: 'NCI',
          },
          expectedSupplyDuration: {
            value: 6,
            unit: 'days',
          },
          performer: {
            reference: '5920447',
          },
        },
      } as Resource,
    },
  ],
};
