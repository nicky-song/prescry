// Copyright 2021 Prescryptive Health, Inc.

import {
  pharmacyMock1,
  pharmacyMock2,
  pharmacyMock3,
  pharmacyMock4,
} from '../../../mock-data/pharmacy.mock';
import {
  prescriptionPharmacyMock1,
  prescriptionPharmacyMock2,
  prescriptionPharmacyMock3,
  prescriptionPharmacyMock4,
} from '../../../mock-data/prescription-pharmacy.mock';
import { buildPharmacySearchResponse } from './build-pharmacy-search-response';

describe('buildPharmacyResponse', () => {
  it('should build pharmacy response from the pharmacy lookup response ', () => {
    const mockPrescriptionPharmacies = [
      prescriptionPharmacyMock1,
      prescriptionPharmacyMock2,
    ];
    const mockPharmacies = [pharmacyMock1, pharmacyMock2];
    expect(buildPharmacySearchResponse(mockPrescriptionPharmacies)).toEqual(
      mockPharmacies
    );
  });
  it('should build pharmacy response from the pharmacy lookup response and format distance', () => {
    const mockPrescriptionPharmacies = [
      prescriptionPharmacyMock3,
      prescriptionPharmacyMock4,
    ];
    const mockPharmacies = [pharmacyMock3, pharmacyMock4];
    expect(buildPharmacySearchResponse(mockPrescriptionPharmacies)).toEqual(
      mockPharmacies
    );
  });
});
