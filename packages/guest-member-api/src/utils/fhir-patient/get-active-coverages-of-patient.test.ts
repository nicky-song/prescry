// Copyright 2022 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import {
  coverageMock1,
  coverageMock2,
} from '../../mock-data/fhir-coverage.mock';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { getActiveCoveragesOfPatient } from './get-active-coverages-of-patient';

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

describe('getActiveCoveragesOfPatient', () => {
  it('returns active coverages list if there is any active coverages in the list', () => {
    const coverages: Partial<ICoverage>[] = [coverageMock1, coverageMock2];

    getNewDateMock.mockReturnValueOnce(new Date('2022-01-01T11:01:58.135Z'));

    const result = getActiveCoveragesOfPatient(coverages as ICoverage[]);

    const expected: ICoverage[] = [coverageMock1 as ICoverage];

    expect(result).toEqual(expected);
  });
});
