// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import { cashCoveragePrimaryMock } from '../../mock-data/fhir-coverage.mock';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';
import { getPatientCoverageByFamilyId } from './get-patient-coverage-by-family-id';

jest.mock('../external-api/coverage/get-patient-coverage-by-query');
const getPatientCoverageByQueryMock = getPatientCoverageByQuery as jest.Mock;

describe('getPatientCoverageByFamilyId', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getPatientCoverageByQueryMock.mockResolvedValue(undefined);
  });

  it('gets patient account by query', async () => {
    const familyIdMock = 'family-id';

    const coveragesMock: ICoverage[] = [cashCoveragePrimaryMock];
    getPatientCoverageByQueryMock.mockResolvedValue(coveragesMock);

    const result = await getPatientCoverageByFamilyId(
      configurationMock,
      familyIdMock
    );

    const expectedMaxPersonCode = 999;

    expectToHaveBeenCalledOnceOnlyWith(
      getPatientCoverageByQueryMock,
      configurationMock,
      `_count=${expectedMaxPersonCode}&class-type=familyid&class-value=${familyIdMock}`
    );

    expect(result).toEqual(coveragesMock);
  });
});
