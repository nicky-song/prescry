// Copyright 2022 Prescryptive Health, Inc.

import { getAllPatientRecordsForLoggedInPerson } from './get-logged-in-patient.helper';
import {
  mockPatient,
  mockPatientEmailAndPhone,
} from '../../mock-data/fhir-patient.mock';

import { getMasterIdFromCoverage } from '../get-master-id-from-coverage.helper';
import { getPatientByMasterId } from '../external-api/identity/get-patient-by-master-id';
import { getActiveCoveragesOfPatient } from './get-active-coverages-of-patient';
import { configurationMock } from '../../mock-data/configuration.mock';
import { IPatientLink } from '../../models/fhir/patient/patient-link';
import {
  coverageMock1,
  coverageMock2,
} from '../../mock-data/fhir-coverage.mock';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { IPatientProfile } from '../../models/patient-profile';

jest.mock('../external-api/coverage/get-patient-coverage-by-query');
const getPatientCoverageByQueryMock = getPatientCoverageByQuery as jest.Mock;

jest.mock('../get-master-id-from-coverage.helper');
const getMasterIdFromCoverageMock = getMasterIdFromCoverage as jest.Mock;

jest.mock('../external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

jest.mock('./get-active-coverages-of-patient');
const getActiveCoveragesOfPatientMock =
  getActiveCoveragesOfPatient as jest.Mock;

describe('getAllPatientRecordsForLoggedInPerson', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns cash profile when there is no links in cash profile', async () => {
    const expected: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatient,
      },
    ];

    const actual = await getAllPatientRecordsForLoggedInPerson(
      mockPatient,
      configurationMock
    );

    expect(actual).toEqual(expected);

    expect(getPatientCoverageByQueryMock).not.toBeCalled();
    expect(getActiveCoveragesOfPatientMock).not.toBeCalled();
    expect(getMasterIdFromCoverageMock).not.toBeCalled();
    expect(getPatientByMasterIdMock).not.toBeCalled();
  });

  it('returns cash profile when there are invalid links in cash profile', async () => {
    const pbmLink: IPatientLink[] = [
      { other: { reference: 'pbm-profile-reference-link' }, type: 'refer' },
    ];
    const mockPatientWithLinks = { ...mockPatient, link: pbmLink };

    const expected: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatientWithLinks,
      },
    ];
    getPatientCoverageByQueryMock.mockReturnValueOnce(undefined);

    const actual = await getAllPatientRecordsForLoggedInPerson(
      mockPatientWithLinks,
      configurationMock
    );

    expect(actual).toEqual(expected);
    expectToHaveBeenCalledOnceOnlyWith(
      getPatientCoverageByQueryMock,
      configurationMock,
      'beneficiary=pbm-profile-reference-link'
    );
    expect(getActiveCoveragesOfPatientMock).not.toBeCalled();
    expect(getMasterIdFromCoverageMock).not.toBeCalled();
    expect(getPatientByMasterIdMock).not.toBeCalled();
  });

  it('returns cash profile when there are expired coverage PBM links in cash profile', async () => {
    const pbmLink: IPatientLink[] = [
      { other: { reference: 'pbm-profile-reference-link' }, type: 'refer' },
    ];
    const mockPatientWithLinks = { ...mockPatient, link: pbmLink };

    const expected: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatientWithLinks,
      },
    ];

    getPatientCoverageByQueryMock.mockReturnValueOnce([coverageMock1]);
    getActiveCoveragesOfPatientMock.mockReturnValueOnce([]);

    const actual = await getAllPatientRecordsForLoggedInPerson(
      mockPatientWithLinks,
      configurationMock
    );

    expect(actual).toEqual(expected);
    expectToHaveBeenCalledOnceOnlyWith(
      getPatientCoverageByQueryMock,
      configurationMock,
      'beneficiary=pbm-profile-reference-link'
    );
    expectToHaveBeenCalledOnceOnlyWith(getActiveCoveragesOfPatientMock, [
      coverageMock1,
    ]);
    expect(getMasterIdFromCoverageMock).not.toBeCalled();
    expect(getPatientByMasterIdMock).not.toBeCalled();
  });

  it('returns only cash profile when there are more than 1 valid coverage PBM links in cash profile', async () => {
    const pbmLink: IPatientLink[] = [
      { other: { reference: 'pbm-profile-reference-link' }, type: 'refer' },
      { other: { reference: 'pbm-profile-reference-link2' }, type: 'refer' },
    ];
    const mockPatientWithLinks = { ...mockPatient, link: pbmLink };

    const expected: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatientWithLinks,
      },
    ];

    getPatientCoverageByQueryMock.mockReturnValueOnce([
      coverageMock1,
      coverageMock2,
    ]);
    getActiveCoveragesOfPatientMock.mockReturnValueOnce([
      coverageMock1,
      coverageMock2,
    ]);

    const actual = await getAllPatientRecordsForLoggedInPerson(
      mockPatientWithLinks,
      configurationMock
    );

    expect(actual).toEqual(expected);
    expectToHaveBeenCalledOnceOnlyWith(
      getPatientCoverageByQueryMock,
      configurationMock,
      'beneficiary=pbm-profile-reference-link,pbm-profile-reference-link2'
    );
    expectToHaveBeenCalledOnceOnlyWith(getActiveCoveragesOfPatientMock, [
      coverageMock1,
      coverageMock2,
    ]);
    expect(getMasterIdFromCoverageMock).not.toBeCalled();
    expect(getPatientByMasterIdMock).not.toBeCalled();
  });

  it('returns cash and PBM profile when there is 1 valid coverage PBM link in cash profile', async () => {
    const pbmLink: IPatientLink[] = [
      { other: { reference: 'pbm-profile-reference-link' }, type: 'refer' },
    ];
    const mockPatientWithLinks = { ...mockPatient, link: pbmLink };

    const expected: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatientWithLinks,
      },
      {
        rxGroupType: 'SIE',
        primary: mockPatientEmailAndPhone,
      },
    ];

    getPatientCoverageByQueryMock.mockReturnValueOnce([coverageMock1]);
    getActiveCoveragesOfPatientMock.mockReturnValueOnce([coverageMock1]);
    getMasterIdFromCoverageMock.mockReturnValueOnce('MASTER-ID-MOCK');
    getPatientByMasterIdMock.mockReturnValueOnce(mockPatientEmailAndPhone);

    const actual = await getAllPatientRecordsForLoggedInPerson(
      mockPatientWithLinks,
      configurationMock
    );

    expect(actual).toEqual(expected);
    expectToHaveBeenCalledOnceOnlyWith(
      getPatientCoverageByQueryMock,
      configurationMock,
      'beneficiary=pbm-profile-reference-link'
    );
    expectToHaveBeenCalledOnceOnlyWith(getActiveCoveragesOfPatientMock, [
      coverageMock1,
    ]);
    expectToHaveBeenCalledOnceOnlyWith(
      getMasterIdFromCoverageMock,
      coverageMock1
    );
    expectToHaveBeenCalledOnceOnlyWith(
      getPatientByMasterIdMock,
      'MASTER-ID-MOCK',
      configurationMock
    );
  });
});
