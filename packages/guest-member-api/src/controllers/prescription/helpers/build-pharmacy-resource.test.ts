// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '@phx/common/src/models/address';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { buildPharmacyResource } from './build-pharmacy-resource';

describe('buildPharmacyResource', () => {
  it('should build pharmacy request from the pharmacyId and pharmacy object', () => {
    const pharmacyDetailsMock = {
      address: {
        city: 'BELLEVUE',
        lineOne: '2636 BELLEVUE WAY NE',
        lineTwo: '',
        state: 'WA',
        zip: '98004',
      } as IAddress,
      email: 'RXLICENSING@KROGER.COM',
      hasDriveThru: false,
      hours: [
        {
          closes: {
            hours: 6,
            minutes: 0,
            pm: true,
          },
          day: 'Sun',
          opens: {
            hours: 11,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 8,
            minutes: 0,
            pm: true,
          },
          day: 'Mon',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 8,
            minutes: 0,
            pm: true,
          },
          day: 'Tue',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 8,
            minutes: 0,
            pm: true,
          },
          day: 'Wed',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 8,
            minutes: 0,
            pm: true,
          },
          day: 'Thu',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 8,
            minutes: 0,
            pm: true,
          },
          day: 'Fri',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 6,
            minutes: 0,
            pm: true,
          },
          day: 'Sat',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
      ],
      inNetwork: false,
      name: 'QFC PHARMACY',
      nationalProviderIdentifier: 'mock-npi',
      ncpdp: '4929432',
      phone: '4545769222',
      fax: '123-456',
      twentyFourHours: true,
      type: 'retail',
    } as IPrescriptionPharmacy;
    const expectedResponse = {
      resource: {
        alias: ['QFC PHARMACY'],
        address: [
          {
            city: 'BELLEVUE',
            line: ['2636 BELLEVUE WAY NE', ''],
            postalCode: '98004',
            state: 'WA',
          },
        ],
        telecom: [
          { system: 'phone', value: '4545769222' },
          { system: 'email', value: 'RXLICENSING@KROGER.COM' },
          { system: 'fax', value: '123-456' },
        ],
        id: '4929432',
        identifier: [
          {
            type: {
              coding: [
                {
                  code: 'NCPDP',
                  display: "Pharmacy's NCPDP",
                  system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                },
              ],
            },
            value: '4929432',
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
            value: 'mock-npi',
          },
        ],
        name: 'QFC PHARMACY',
        resourceType: 'Organization',
      },
    };
    expect(buildPharmacyResource(pharmacyDetailsMock)).toEqual(
      expectedResponse
    );
  });
});
