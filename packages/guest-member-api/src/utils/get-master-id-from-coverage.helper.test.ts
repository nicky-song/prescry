// Copyright 2022 Prescryptive Health, Inc.

import { ICoverage } from '../models/fhir/patient-coverage/coverage';
import { getMasterIdFromCoverage } from './get-master-id-from-coverage.helper';

describe('getMasterIdFromCoverage', () => {
  it('returns undefined if beneficiary is missing', () => {
    const coverageNoBeneficiaryMock: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
    };

    const result = getMasterIdFromCoverage(
      coverageNoBeneficiaryMock as ICoverage
    );

    const expected = undefined;

    expect(result).toEqual(expected);
  });

  it('returns undefined if reference is missing', () => {
    const coverageNoReferenceMock: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: undefined,
    };

    const result = getMasterIdFromCoverage(
      coverageNoReferenceMock as ICoverage
    );

    const expected = undefined;

    expect(result).toEqual(expected);
  });

  it('returns undefined if masterId is missing', () => {
    const coverageNoMasterIdMock: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/',
      },
    };

    const result = getMasterIdFromCoverage(coverageNoMasterIdMock as ICoverage);

    const expected = undefined;

    expect(result).toEqual(expected);
  });

  it('returns masterId', () => {
    const masterIdMock = 'MASTER-ID-MOCK';

    const coverageMock: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `https://gears.prescryptive.io/patient/${masterIdMock}`,
      },
    };

    const result = getMasterIdFromCoverage(coverageMock as ICoverage);

    const expected = masterIdMock;

    expect(result).toEqual(expected);
  });
});
