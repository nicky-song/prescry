// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { pharmacyMock5 } from '../mock-data/pharmacy.mock';
import { prescriptionPharmacyMock1 } from '../mock-data/prescription-pharmacy.mock';
import { IPrescriptionPharmacy } from '../models/platform/pharmacy-lookup.response';
import { convertPrescriptionPharmacyToPharmacy } from './convert-prescription-pharmacy-to-pharmacy';

describe('convertPrescriptionPharmacyToPharmacy', () => {
  it('should convert types correctly', () => {
    const convertedPharmacy = convertPrescriptionPharmacyToPharmacy(
      prescriptionPharmacyMock1
    );

    expect(convertedPharmacy).toEqual(pharmacyMock5);
  });

  it('should remove whitespace correctly', () => {
    const prescriptionPharmacyMock: IPrescriptionPharmacy = {
      address: {
        lineOne: '  123 E Main   ',
        lineTwo: '   Apt 123    ',
        city: '  Seattle ',
        state: '\nWA\n',
        zip: ' 12345 ',
      },
      hours: [],
      name: '          test-name                        ',
      phone: '    test-phone   ',
      ncpdp: 'test',
      type: 'retail',
      fax: '1112223344',
      email: 'test@test.co',
      brand: 'brand-mock',
      chainId: 777,
    };
    const expectedPharmacyMock: IPharmacy = {
      address: {
        lineOne: '123 E Main',
        lineTwo: 'Apt 123',
        city: 'Seattle',
        state: 'WA',
        zip: '12345',
      },
      hours: [],
      name: 'test-name',
      phoneNumber: 'test-phone',
      ncpdp: 'test',
      type: 'retail',
      isMailOrderOnly: false,
      twentyFourHours: false,
      fax: '1112223344',
      email: 'test@test.co',
      brand: 'brand-mock',
      chainId: 777,
    };
    const pharmacyMock = convertPrescriptionPharmacyToPharmacy(
      prescriptionPharmacyMock
    );

    expect(pharmacyMock).toEqual(expectedPharmacyMock);
  });
});
