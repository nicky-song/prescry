// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '@phx/common/src/models/address';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';

export const sourcePharmacyDetailsResponseMock = {
  address: {
    city: 'BELLEVUE',
    lineOne: '2636 BELLEVUE WAY NE',
    lineTwo: '',
    state: 'WA',
    zip: '98004',
  } as IAddress,
  email: 'RXLICENSING@KROGER.COM',
  hasDriveThru: false,
  inNetwork: false,
  name: 'QFC PHARMACY',
  nationalProviderIdentifier: 'mock-npi',
  ncpdp: '4929432',
  phone: '4545769222',
  fax: '123-456',
  twentyFourHours: true,
  type: 'retail',
} as IPrescriptionPharmacy;

export const destinationPharmacyDetailsResponseMock = {
  address: {
    city: 'REDMOND',
    lineOne: '1234 BEL RED RD',
    lineTwo: '',
    state: 'WA',
    zip: '98054',
  } as IAddress,
  email: 'RXTEST@GMAIL.COM',
  hasDriveThru: false,
  inNetwork: false,
  name: 'WALGREENS PHARMACY',
  nationalProviderIdentifier: 'mock-npi',
  ncpdp: '1234567',
  phone: '6524896512',
  fax: '652-456-2134',
  twentyFourHours: true,
  type: 'retail',
} as IPrescriptionPharmacy;

export const presPayloadWithOutPrescriptionNumber = {
  resourceType: 'Bundle',
  id: 'BundleId',
  type: 'collection',
  timestamp: '2000-01-01T00:00:00.000Z',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'CAJY01',
        identifier: [
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
            value: 'CAJY01',
          },
        ],
        name: [
          {
            family: 'last-name',
            given: ['first-name'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '1234567890',
            use: 'mobile',
          },
        ],
        birthDate: '2000-01-01',
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
        address: [],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: 'medicationId',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '69665061001',
            },
          ],
          text: '69665061001',
        },
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                },
              ],
            },
            value: '2.5-2.5',
          },

          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',

                  display: 'Strength Unit of Measure',
                },
              ],
            },

            value: '%',
          },
        ],
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'KIT',
              display: 'KIT',
            },
          ],
          text: 'KIT',
        },
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'LiProZonePak',
                },
              ],
              text: 'LiProZonePak',
            },
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'MedicationRequest',
        id: 'MedicationRequestId',
        identifier: [],
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: 'medicationId',
        },
        subject: {
          reference: 'CAJY01',
        },
        dispenseRequest: {
          quantity: {
            value: 5,
          },
          expectedSupplyDuration: {
            value: 30,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
        },
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: sourcePharmacyDetailsResponseMock.ncpdp,
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                },
              ],
            },
            value: sourcePharmacyDetailsResponseMock.ncpdp,
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Source',
                  display: 'Source Pharmacy',
                },
              ],
            },
            value: 'Source',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                },
              ],
            },
            value: sourcePharmacyDetailsResponseMock.nationalProviderIdentifier,
          },
        ],
        name: sourcePharmacyDetailsResponseMock.name,
        alias: [sourcePharmacyDetailsResponseMock.name],
        address: [
          {
            line: [
              sourcePharmacyDetailsResponseMock.address.lineOne,
              sourcePharmacyDetailsResponseMock.address.lineTwo,
            ],
            city: sourcePharmacyDetailsResponseMock.address.city,
            state: sourcePharmacyDetailsResponseMock.address.state,
            postalCode: sourcePharmacyDetailsResponseMock.address.zip,
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: sourcePharmacyDetailsResponseMock.phone,
          },
          {
            system: 'fax',
            value: sourcePharmacyDetailsResponseMock.fax,
          },
          {
            system: 'email',
            value: sourcePharmacyDetailsResponseMock.email,
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: destinationPharmacyDetailsResponseMock.ncpdp,
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                },
              ],
            },
            value: destinationPharmacyDetailsResponseMock.ncpdp,
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Destination',
                  display: 'Destination Pharmacy',
                },
              ],
            },
            value: 'Destination',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                },
              ],
            },
            value:
              destinationPharmacyDetailsResponseMock.nationalProviderIdentifier,
          },
        ],
        name: destinationPharmacyDetailsResponseMock.name,
        alias: [destinationPharmacyDetailsResponseMock.name],
        address: [
          {
            line: [
              destinationPharmacyDetailsResponseMock.address.lineOne,
              destinationPharmacyDetailsResponseMock.address.lineTwo,
            ],
            city: destinationPharmacyDetailsResponseMock.address.city,
            state: destinationPharmacyDetailsResponseMock.address.state,
            postalCode: destinationPharmacyDetailsResponseMock.address.zip,
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: destinationPharmacyDetailsResponseMock.phone,
          },
          {
            system: 'fax',
            value: destinationPharmacyDetailsResponseMock.fax,
          },
          {
            system: 'email',
            value: destinationPharmacyDetailsResponseMock.email,
          },
        ],
      },
    },
  ],
};

export const presPayloadWithPrescriptionNumber = {
  resourceType: 'Bundle',
  id: 'BundleId',
  type: 'collection',
  timestamp: '2000-01-01T00:00:00.000Z',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'CAJY01',
        identifier: [
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
            value: 'CAJY01',
          },
        ],
        name: [
          {
            family: 'last-name',
            given: ['first-name'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '1234567890',
            use: 'mobile',
          },
        ],
        birthDate: '2000-01-01',
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
        address: [],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: 'medicationId',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '69665061001',
            },
          ],
          text: '69665061001',
        },
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                },
              ],
            },
            value: '2.5-2.5',
          },

          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',

                  display: 'Strength Unit of Measure',
                },
              ],
            },

            value: '%',
          },
        ],
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'KIT',
              display: 'KIT',
            },
          ],
          text: 'KIT',
        },
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'LiProZonePak',
                },
              ],
              text: 'LiProZonePak',
            },
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'MedicationRequest',
        id: 'MedicationRequestId',
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '123456',
          },
        ],
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: 'medicationId',
        },
        subject: {
          reference: 'CAJY01',
        },
        dispenseRequest: {
          quantity: {
            value: 5,
          },
          expectedSupplyDuration: {
            value: 30,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
        },
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: sourcePharmacyDetailsResponseMock.ncpdp,
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                },
              ],
            },
            value: sourcePharmacyDetailsResponseMock.ncpdp,
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Source',
                  display: 'Source Pharmacy',
                },
              ],
            },
            value: 'Source',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                },
              ],
            },
            value: sourcePharmacyDetailsResponseMock.nationalProviderIdentifier,
          },
        ],
        name: sourcePharmacyDetailsResponseMock.name,
        alias: [sourcePharmacyDetailsResponseMock.name],
        address: [
          {
            line: [
              sourcePharmacyDetailsResponseMock.address.lineOne,
              sourcePharmacyDetailsResponseMock.address.lineTwo,
            ],
            city: sourcePharmacyDetailsResponseMock.address.city,
            state: sourcePharmacyDetailsResponseMock.address.state,
            postalCode: sourcePharmacyDetailsResponseMock.address.zip,
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: sourcePharmacyDetailsResponseMock.phone,
          },
          {
            system: 'fax',
            value: sourcePharmacyDetailsResponseMock.fax,
          },
          {
            system: 'email',
            value: sourcePharmacyDetailsResponseMock.email,
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: destinationPharmacyDetailsResponseMock.ncpdp,
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                },
              ],
            },
            value: destinationPharmacyDetailsResponseMock.ncpdp,
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Destination',
                  display: 'Destination Pharmacy',
                },
              ],
            },
            value: 'Destination',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                },
              ],
            },
            value:
              destinationPharmacyDetailsResponseMock.nationalProviderIdentifier,
          },
        ],
        name: destinationPharmacyDetailsResponseMock.name,
        alias: [destinationPharmacyDetailsResponseMock.name],
        address: [
          {
            line: [
              destinationPharmacyDetailsResponseMock.address.lineOne,
              destinationPharmacyDetailsResponseMock.address.lineTwo,
            ],
            city: destinationPharmacyDetailsResponseMock.address.city,
            state: destinationPharmacyDetailsResponseMock.address.state,
            postalCode: destinationPharmacyDetailsResponseMock.address.zip,
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: destinationPharmacyDetailsResponseMock.phone,
          },
          {
            system: 'fax',
            value: destinationPharmacyDetailsResponseMock.fax,
          },
          {
            system: 'email',
            value: destinationPharmacyDetailsResponseMock.email,
          },
        ],
      },
    },
  ],
};

export const presPayloadWithMemberAddress = {
  resourceType: 'Bundle',
  id: 'BundleId',
  type: 'collection',
  timestamp: '2000-01-01T00:00:00.000Z',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'CAJY01',
        identifier: [
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
            value: 'CAJY01',
          },
        ],
        name: [
          {
            family: 'last-name',
            given: ['first-name'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '1234567890',
            use: 'mobile',
          },
        ],
        birthDate: '2000-01-01',
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
        address: [
          {
            line: ['address-line1'],

            city: 'city',

            state: 'state',

            postalCode: '12345',
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Medication',
        id: 'medicationId',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: '69665061001',
            },
          ],
          text: '69665061001',
        },
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'Strength',
                  display: 'Strength',
                },
              ],
            },
            value: '2.5-2.5',
          },

          {
            type: {
              coding: [
                {
                  code: 'StrengthUM',

                  display: 'Strength Unit of Measure',
                },
              ],
            },

            value: '%',
          },
        ],
        form: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: 'KIT',
              display: 'KIT',
            },
          ],
          text: 'KIT',
        },
        ingredient: [
          {
            itemCodeableConcept: {
              coding: [
                {
                  display: 'LiProZonePak',
                },
              ],
              text: 'LiProZonePak',
            },
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'MedicationRequest',
        id: 'MedicationRequestId',
        identifier: [
          {
            type: {
              text: 'Prescription Number',
            },
            value: '123456',
          },
        ],
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: 'medicationId',
        },
        subject: {
          reference: 'CAJY01',
        },
        dispenseRequest: {
          quantity: {
            value: 5,
          },
          expectedSupplyDuration: {
            value: 30,
            system: 'http://unitsofmeasure.org/',
            code: 'd',
          },
        },
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: sourcePharmacyDetailsResponseMock.ncpdp,
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                },
              ],
            },
            value: sourcePharmacyDetailsResponseMock.ncpdp,
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Source',
                  display: 'Source Pharmacy',
                },
              ],
            },
            value: 'Source',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                },
              ],
            },
            value: sourcePharmacyDetailsResponseMock.nationalProviderIdentifier,
          },
        ],
        name: sourcePharmacyDetailsResponseMock.name,
        alias: [sourcePharmacyDetailsResponseMock.name],
        address: [
          {
            line: [
              sourcePharmacyDetailsResponseMock.address.lineOne,
              sourcePharmacyDetailsResponseMock.address.lineTwo,
            ],
            city: sourcePharmacyDetailsResponseMock.address.city,
            state: sourcePharmacyDetailsResponseMock.address.state,
            postalCode: sourcePharmacyDetailsResponseMock.address.zip,
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: sourcePharmacyDetailsResponseMock.phone,
          },
          {
            system: 'fax',
            value: sourcePharmacyDetailsResponseMock.fax,
          },
          {
            system: 'email',
            value: sourcePharmacyDetailsResponseMock.email,
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Organization',
        id: destinationPharmacyDetailsResponseMock.ncpdp,
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                },
              ],
            },
            value: destinationPharmacyDetailsResponseMock.ncpdp,
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                  code: 'Destination',
                  display: 'Destination Pharmacy',
                },
              ],
            },
            value: 'Destination',
          },
          {
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  code: 'NPI',
                  display: "Pharmacy's NPI",
                },
              ],
            },
            value:
              destinationPharmacyDetailsResponseMock.nationalProviderIdentifier,
          },
        ],
        name: destinationPharmacyDetailsResponseMock.name,
        alias: [destinationPharmacyDetailsResponseMock.name],
        address: [
          {
            line: [
              destinationPharmacyDetailsResponseMock.address.lineOne,
              destinationPharmacyDetailsResponseMock.address.lineTwo,
            ],
            city: destinationPharmacyDetailsResponseMock.address.city,
            state: destinationPharmacyDetailsResponseMock.address.state,
            postalCode: destinationPharmacyDetailsResponseMock.address.zip,
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: destinationPharmacyDetailsResponseMock.phone,
          },
          {
            system: 'fax',
            value: destinationPharmacyDetailsResponseMock.fax,
          },
          {
            system: 'email',
            value: destinationPharmacyDetailsResponseMock.email,
          },
        ],
      },
    },
  ],
};
