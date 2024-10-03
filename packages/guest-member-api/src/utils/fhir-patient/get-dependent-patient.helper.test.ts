// Copyright 2022 Prescryptive Health, Inc.

import { getPatientByMasterId } from '../external-api/identity/get-patient-by-master-id';
import { getMasterIdFromCoverage } from '../get-master-id-from-coverage.helper';
import { getActiveCoveragesOfPatient } from './get-active-coverages-of-patient';
import { getAllFamilyMembersOfLoggedInUser } from './get-dependent-patient.helper';
import {
  cashCoverageDependentMock,
  coverageMock1,
  coverageMock2,
  coverageMock2Tenant2,
} from '../../mock-data/fhir-coverage.mock';
import { configurationMock } from '../../mock-data/configuration.mock';
import {
  mockChildDependentPatient,
  mockChildPbmDependentPatient,
  mockPatient,
  mockPbmPatient,
} from '../../mock-data/fhir-patient.mock';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { getPatientCoverageByFamilyId } from '../coverage/get-patient-coverage-by-family-id';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';
import { IPatientProfile } from '../../models/patient-profile';

jest.mock('../external-api/coverage/get-patient-coverage-by-query');
const getPatientCoverageByQueryMock = getPatientCoverageByQuery as jest.Mock;

jest.mock('../external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

jest.mock('../get-master-id-from-coverage.helper');
const getMasterIdFromCoverageMock = getMasterIdFromCoverage as jest.Mock;

jest.mock('./get-active-coverages-of-patient');
const getActiveCoveragesOfPatientMock =
  getActiveCoveragesOfPatient as jest.Mock;

jest.mock('@phx/common/src/utils/date-time-helper');
const calculateAbsoluteAgeMock = CalculateAbsoluteAge as jest.Mock;

jest.mock('../coverage/get-patient-coverage-by-family-id');
const getPatientCoverageByFamilyIdMock =
  getPatientCoverageByFamilyId as jest.Mock;

describe('getAllFamilyMembersOfLoggedInUser', () => {
  const patientPrimaryProfile: IPatientProfile[] = [
    {
      rxGroupType: 'CASH',
      primary: mockPatient,
    },
    {
      rxGroupType: 'SIE',
      primary: mockPbmPatient,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getPatientCoverageByFamilyIdMock.mockResolvedValue(undefined);
  });

  it('returns success with empty array if patient does not have coverage record with beneficiary entry', async () => {
    getPatientCoverageByQueryMock.mockReturnValueOnce([]);
    const actual = await getAllFamilyMembersOfLoggedInUser(
      configurationMock,
      patientPrimaryProfile
    );
    expect(getPatientCoverageByFamilyIdMock).not.toBeCalled();
    expect(getActiveCoveragesOfPatientMock).toBeCalledTimes(2);
    expect(getActiveCoveragesOfPatientMock).toHaveBeenNthCalledWith(1, []);
    expect(getActiveCoveragesOfPatientMock).toHaveBeenNthCalledWith(2, []);
    expect(actual).toEqual([]);
  });

  it('returns success with empty array if patient does not have coverage records', async () => {
    getPatientCoverageByQueryMock.mockReturnValueOnce([coverageMock1]);

    getActiveCoveragesOfPatientMock
      .mockReturnValueOnce([coverageMock1])
      .mockReturnValue([]);

    getPatientCoverageByFamilyIdMock.mockResolvedValue(undefined);

    const actual = await getAllFamilyMembersOfLoggedInUser(
      configurationMock,
      patientPrimaryProfile
    );

    expect(getPatientCoverageByFamilyIdMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      'family-id'
    );
    expect(getActiveCoveragesOfPatientMock).toBeCalledTimes(2);
    expect(getActiveCoveragesOfPatientMock).toHaveBeenNthCalledWith(1, [
      coverageMock1,
    ]);
    expect(getActiveCoveragesOfPatientMock).toHaveBeenNthCalledWith(2, []);
    expect(actual).toEqual([]);
  });

  it('returns success with empty array if dependentCoverages does not exist for logged in user', async () => {
    const patientPrimaryCashProfile: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatient,
      },
    ];
    getPatientCoverageByQueryMock.mockReturnValueOnce([coverageMock1]);

    getPatientCoverageByFamilyIdMock.mockResolvedValue([coverageMock1]);

    getActiveCoveragesOfPatientMock.mockReturnValue([coverageMock1]);

    const actual = await getAllFamilyMembersOfLoggedInUser(
      configurationMock,
      patientPrimaryCashProfile
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getPatientCoverageByFamilyIdMock,
      configurationMock,
      'family-id'
    );
    expect(getActiveCoveragesOfPatientMock).toBeCalledTimes(1);
    expect(getActiveCoveragesOfPatientMock).toHaveBeenNthCalledWith(1, [
      coverageMock1,
    ]);
    expect(actual).toEqual([]);
  });

  it('returns success with cash dependents when cash dependents with single tenant and pbm dependents with multi-tenant exist', async () => {
    calculateAbsoluteAgeMock.mockReturnValueOnce(5).mockReturnValue(15);
    getPatientCoverageByQueryMock
      .mockReturnValueOnce([coverageMock1])
      .mockResolvedValue([coverageMock1]);

    getPatientByMasterIdMock.mockReturnValueOnce(mockChildDependentPatient);
    getMasterIdFromCoverageMock.mockReturnValueOnce('master-id-mock');

    getPatientCoverageByFamilyIdMock
      .mockResolvedValueOnce([coverageMock1, cashCoverageDependentMock])
      .mockResolvedValue([coverageMock1, coverageMock2, coverageMock2Tenant2]);
    getActiveCoveragesOfPatientMock.mockReset();
    getActiveCoveragesOfPatientMock
      .mockReturnValueOnce([cashCoverageDependentMock])
      .mockReturnValueOnce([cashCoverageDependentMock])
      .mockReturnValueOnce([coverageMock2, coverageMock2Tenant2])
      .mockReturnValue([coverageMock2, coverageMock2Tenant2]);

    const actual = await getAllFamilyMembersOfLoggedInUser(
      configurationMock,
      patientPrimaryProfile
    );

    expect(getPatientCoverageByFamilyIdMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      'CADX4O01'
    );

    const expected = [
      {
        rxGroupType: 'CASH',
        childMembers: {
          activePatients: [mockChildDependentPatient],
        },
      },
    ];

    expect(actual).toEqual(expected);
  });

  it('returns success with both cash and pbm dependents if exists', async () => {
    calculateAbsoluteAgeMock.mockReset();
    calculateAbsoluteAgeMock.mockReturnValueOnce(5).mockReturnValue(15);
    getPatientCoverageByQueryMock
      .mockReturnValueOnce([coverageMock1])
      .mockResolvedValue([coverageMock1]);

    getPatientCoverageByFamilyIdMock
      .mockResolvedValueOnce([coverageMock1, cashCoverageDependentMock])
      .mockResolvedValue([coverageMock1, coverageMock2]);
    getActiveCoveragesOfPatientMock.mockReset();
    getActiveCoveragesOfPatientMock
      .mockReturnValueOnce([cashCoverageDependentMock])
      .mockReturnValueOnce([cashCoverageDependentMock])
      .mockReturnValueOnce([coverageMock2])
      .mockReturnValue([coverageMock2]);
    getPatientByMasterIdMock.mockReset();
    getPatientByMasterIdMock
      .mockReturnValueOnce(mockChildDependentPatient)
      .mockReturnValue(mockChildPbmDependentPatient);
    getPatientByMasterIdMock.mockReset();
    getPatientByMasterIdMock
      .mockReturnValueOnce(mockChildDependentPatient)
      .mockReturnValue(mockChildPbmDependentPatient);

    const actual = await getAllFamilyMembersOfLoggedInUser(
      configurationMock,
      patientPrimaryProfile
    );

    expect(getPatientCoverageByFamilyIdMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      'CADX4O01'
    );
    expect(getPatientCoverageByFamilyIdMock).toHaveBeenNthCalledWith(
      2,
      configurationMock,
      'family-id'
    );
    const expected = [
      {
        rxGroupType: 'CASH',
        childMembers: {
          activePatients: [mockChildDependentPatient],
        },
      },
      {
        rxGroupType: 'SIE',
        adultMembers: {
          activePatients: [mockChildPbmDependentPatient],
        },
      },
    ];
    expect(actual).toEqual(expected);
  });
});
