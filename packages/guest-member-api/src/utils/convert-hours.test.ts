// Copyright 2022 Prescryptive Health, Inc.

import { pharmacyMock5 } from '../mock-data/pharmacy.mock';
import { prescriptionPharmacyMock1 } from '../mock-data/prescription-pharmacy.mock';
import { convertHours } from './convert-hours';

describe('convertHours', () => {
  it('should convert types correctly', () => {
    const convertedHours = convertHours(prescriptionPharmacyMock1.hours);

    expect(convertedHours).toEqual(pharmacyMock5.hours);
  });
});
