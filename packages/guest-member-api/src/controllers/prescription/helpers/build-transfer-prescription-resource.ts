// Copyright 2021 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { ApiConstants } from '../../../constants/api-constants';
import { IFhir } from '../../../models/fhir/fhir';
import { Resource } from '../../../models/fhir/types';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { IDrugInfoResponse } from './get-prescription-drug-info-by-ndc';

export const buildTransferPrescriptionResource = (
  sourcePharmacyDetails: IPrescriptionPharmacy,
  destinationPharmacyDetails: IPrescriptionPharmacy,
  patientInfo: IPerson,
  drugInfo: IDrugInfoResponse,
  daysSupply: number,
  quantity: number,
  prescriptionNumber: string | undefined = undefined
): IFhir => {
  return {
    resourceType: 'Bundle',
    id: 'BundleId',
    type: 'collection',
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: patientInfo.primaryMemberRxId,
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
              value: patientInfo.primaryMemberRxId,
            },
          ],
          name: [
            {
              family: patientInfo.lastName,
              given: [patientInfo.firstName],
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: patientInfo.phoneNumber,
              use: 'mobile',
            },
          ],
          birthDate: patientInfo.dateOfBirth,
          communication: [
            {
              language: {
                coding: [
                  {
                    system: ApiConstants.LANGUAGE_SYSTEM,
                    code: 'en',
                  },
                ],
                text: 'English',
              },
              preferred: true,
            },
          ],
          address:
            patientInfo.address1 &&
            patientInfo.city &&
            patientInfo.state &&
            patientInfo.zip
              ? [
                  {
                    line: [patientInfo.address1],

                    city: patientInfo.city,

                    state: patientInfo.state,

                    postalCode: patientInfo.zip,
                  },
                ]
              : [],
        } as Resource,
      },
      {
        resource: {
          resourceType: 'Medication',
          id: 'medicationId',
          code: {
            coding: [
              {
                system: 'http://hl7.org/fhir/sid/ndc',
                code: drugInfo.ndc,
              },
            ],
            text: drugInfo.ndc,
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
              value: drugInfo.strength,
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

              value: drugInfo.strengthUnit,
            },
          ],
          form: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: drugInfo.formCode,
                display: drugInfo.formCode,
              },
            ],
            text: drugInfo.formCode,
          },
          ingredient: [
            {
              itemCodeableConcept: {
                coding: [
                  {
                    display: drugInfo.name,
                  },
                ],
                text: drugInfo.name,
              },
            },
          ],
        } as Resource,
      },
      {
        resource: {
          resourceType: 'MedicationRequest',
          id: 'MedicationRequestId',
          identifier: prescriptionNumber
            ? [
                {
                  type: {
                    text: 'Prescription Number',
                  },
                  value: prescriptionNumber,
                },
              ]
            : [],
          status: 'active',
          intent: 'order',
          medicationReference: {
            reference: 'medicationId',
          },
          subject: {
            reference: patientInfo.primaryMemberRxId,
          },
          dispenseRequest: {
            quantity: {
              value: quantity,
            },
            expectedSupplyDuration: {
              value: daysSupply,
              system: 'http://unitsofmeasure.org/',
              code: 'd',
            },
          },
        } as Resource,
      },
      {
        resource: {
          resourceType: 'Organization',
          id: sourcePharmacyDetails.ncpdp,
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
              value: sourcePharmacyDetails.ncpdp,
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
              value: sourcePharmacyDetails.nationalProviderIdentifier,
            },
          ],
          name: sourcePharmacyDetails.name,
          alias: [sourcePharmacyDetails.name],
          address: [
            {
              line: [
                sourcePharmacyDetails.address.lineOne,
                sourcePharmacyDetails.address.lineTwo,
              ],
              city: sourcePharmacyDetails.address.city,
              state: sourcePharmacyDetails.address.state,
              postalCode: sourcePharmacyDetails.address.zip,
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: sourcePharmacyDetails.phone,
            },
            {
              system: 'fax',
              value: sourcePharmacyDetails.fax,
            },
            {
              system: 'email',
              value: sourcePharmacyDetails.email,
            },
          ],
        } as Resource,
      },
      {
        resource: {
          resourceType: 'Organization',
          id: destinationPharmacyDetails.ncpdp,
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
              value: destinationPharmacyDetails.ncpdp,
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
              value: destinationPharmacyDetails.nationalProviderIdentifier,
            },
          ],
          name: destinationPharmacyDetails.name,
          alias: [destinationPharmacyDetails.name],
          address: [
            {
              line: [
                destinationPharmacyDetails.address.lineOne,
                destinationPharmacyDetails.address.lineTwo,
              ],
              city: destinationPharmacyDetails.address.city,
              state: destinationPharmacyDetails.address.state,
              postalCode: destinationPharmacyDetails.address.zip,
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: destinationPharmacyDetails.phone,
            },
            {
              system: 'fax',
              value: destinationPharmacyDetails.fax,
            },
            {
              system: 'email',
              value: destinationPharmacyDetails.email,
            },
          ],
        } as Resource,
      },
    ],
  };
};
