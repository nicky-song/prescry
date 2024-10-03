// Copyright 2021 Prescryptive Health, Inc.

import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import { Resource } from '../../../models/fhir/types';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';

export const buildPharmacyResource = (
  pharmacyDetails: IPrescriptionPharmacy
) => {
  const ncpdp = pharmacyDetails.ncpdp && pharmacyDetails.ncpdp;
  const pharmacyName = pharmacyDetails.name;
  const phoneNumber = pharmacyDetails.phone;
  const faxNumber = pharmacyDetails.fax;
  const email = pharmacyDetails.email;
  const address1 = pharmacyDetails.address.lineOne;
  const address2 = pharmacyDetails.address.lineTwo;
  const pharmacyCity = pharmacyDetails.address.city;
  const pharmacyState = pharmacyDetails.address.state;
  const pharmacyZip = pharmacyDetails.address.zip;
  return {
    resource: {
      resourceType: 'Organization',
      id: ncpdp,
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
          value: ncpdp,
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
          value: pharmacyDetails.nationalProviderIdentifier,
        },
      ],
      name: pharmacyName,
      alias: [pharmacyName],
      address: [
        {
          line: [address1, address2],
          city: pharmacyCity,
          state: pharmacyState,
          postalCode: pharmacyZip,
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: phoneNumber,
        },
        { system: 'email', value: email },
        { system: 'fax', value: faxNumber },
      ],
    } as Resource,
  } as ResourceWrapper;
};
