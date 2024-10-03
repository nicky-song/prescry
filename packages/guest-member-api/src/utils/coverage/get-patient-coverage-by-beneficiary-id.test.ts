// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import { cashCoveragePrimaryMock } from '../../mock-data/fhir-coverage.mock';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';
import { getPatientCoverageByBeneficiaryId } from './get-patient-coverage-by-beneficiary-id';

jest.mock('../external-api/coverage/get-patient-coverage-by-query');
const getPatientCoverageByQueryMock = getPatientCoverageByQuery as jest.Mock;

describe('getPatientCoverageByBeneficiaryId', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getPatientCoverageByQueryMock.mockResolvedValue(undefined);
  });

  it('gets patient account by query', async () => {
    const masterIdMock = 'master-id';

    const coveragesMock: ICoverage[] = [cashCoveragePrimaryMock];
    getPatientCoverageByQueryMock.mockResolvedValue(coveragesMock);

    const result = await getPatientCoverageByBeneficiaryId(
      configurationMock,
      masterIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getPatientCoverageByQueryMock,
      configurationMock,
      `beneficiary=patient/${masterIdMock}`
    );

    expect(result).toEqual(coveragesMock);
  });
});
