// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import {
  mockAdultDependentPatient,
  mockChildDependentPatient,
  mockPatient,
  mockPbmPatient,
} from '../../../mock-data/fhir-patient.mock';
import {
  IPatientDependents,
  IPatientProfile,
} from '../../../models/patient-profile';
import {
  getAllActivePatientsForLoggedInUser,
  getAllMemberIdsFromPatients,
} from '../../../utils/fhir-patient/patient.helper';
import { getAllowedPersonsForLoggedInUser } from '../../../utils/person/get-dependent-person.helper';
import { getFeedAudience, getFeedAudienceV2 } from './get-feed-audience';

const responseMock = {} as unknown as Response;
jest.mock('../../../utils/person/get-dependent-person.helper');
const getAllowedPersonsForLoggedInUserMock =
  getAllowedPersonsForLoggedInUser as jest.Mock;

jest.mock('../../../utils/fhir-patient/patient.helper');
const getAllActivePatientsForLoggedInUserMock =
  getAllActivePatientsForLoggedInUser as jest.Mock;

const getAllMemberIdsFromPatientsMock =
  getAllMemberIdsFromPatients as jest.Mock;

describe('getFeedAudience', () => {
  beforeEach(() => {
    getAllowedPersonsForLoggedInUserMock.mockReset();
  });

  it('should return all audience (including dependents) using person is there in database for phoneNumber', () => {
    const mockPersonList = [
      { rxGroupType: 'SIE', primaryMemberRxId: 'id1' },
      { rxGroupType: 'COVID19', primaryMemberRxId: 'id2' },
    ];

    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    const result = getFeedAudience(responseMock);

    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledWith(responseMock);
    expect(result).toEqual({
      rxGroupTypes: ['SIE', 'COVID19'],
      members: ['id1', 'id2'],
    });
  });

  it('should default to sie if person exists but rxGroupType is not there for the person', () => {
    const mockPersonList = [{ primaryMemberRxId: 'id1' }];
    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    const result = getFeedAudience(responseMock);

    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(result).toEqual({
      rxGroupTypes: ['SIE'],
      members: ['id1'],
    });
  });

  it('should return audience based on query param if person is test member', () => {
    const responseFeatureFlagMock = {
      locals: {
        device: {
          data: 'fake-phone',
        },
        features: {
          usegrouptypesie: true,
        },
      },
    } as unknown as Response;
    const mockPersonList = [
      {
        isTestMembership: true,
        rxGroupType: 'COVID19',
        primaryMemberRxId: 'id1',
      },
    ];
    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    const result = getFeedAudience(responseFeatureFlagMock);

    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(result).toEqual({
      rxGroupTypes: ['SIE'],
      members: ['id1'],
    });
  });

  it('should not use rxgroupttype provided in request if isTestMembership is not set to true', () => {
    const responseFeatureFlagMock = {
      locals: {
        device: {
          data: 'fake-phone',
        },
        features: {
          usegrouptypesie: true,
        },
      },
    } as unknown as Response;
    const mockPersonList = [
      { rxGroupType: 'COVID19', primaryMemberRxId: 'id1' },
    ];
    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    const result = getFeedAudience(responseFeatureFlagMock);

    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(result).toEqual({
      rxGroupTypes: ['COVID19'],
      members: ['id1'],
    });
  });
});

describe('getFeedAudienceV2', () => {
  beforeEach(() => {
    getAllowedPersonsForLoggedInUserMock.mockReset();
  });

  it('should return all audience (including dependents) from patientList and patientDependents for phoneNumber', () => {
    const mockPersonList = [
      { rxGroupType: 'SIE', primaryMemberRxId: 'id1' },
      { rxGroupType: 'COVID19', primaryMemberRxId: 'id2' },
    ];

    const patientDependentsMock: IPatientDependents[] = [
      {
        rxGroupType: 'CASH',
        childMembers: {
          activePatients: [mockChildDependentPatient],
        },
        adultMembers: {
          activePatients: [mockAdultDependentPatient],
        },
      },
    ];

    const patienProfilesMock: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatient,
      },
      {
        rxGroupType: 'SIE',
        primary: mockPbmPatient,
      },
    ];

    const responseMock = {
      locals: {
        patientProfiles: patienProfilesMock,
        patientDependents: patientDependentsMock,
      },
    } as unknown as Response;

    const membersMock = ['id1', 'id2'];

    getAllActivePatientsForLoggedInUserMock.mockReturnValueOnce([mockPatient]);

    getAllMemberIdsFromPatientsMock.mockReturnValue(membersMock);

    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    const result = getFeedAudienceV2(responseMock);

    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledWith(responseMock);
    expect(result).toEqual({
      rxGroupTypes: ['CASH', 'SIE'],
      members: membersMock,
    });
  });

  it('should default to sie if person exists but rxGroupType is not there for the person', () => {
    const mockPersonList = [{ primaryMemberRxId: 'id1' }];
    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    const result = getFeedAudience(responseMock);

    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(result).toEqual({
      rxGroupTypes: ['SIE'],
      members: ['id1'],
    });
  });

  it('should return audience based on query param if person is test member', () => {
    const responseFeatureFlagMock = {
      locals: {
        device: {
          data: 'fake-phone',
        },
        features: {
          usegrouptypesie: true,
        },
      },
    } as unknown as Response;
    const mockPersonList = [
      {
        isTestMembership: true,
        rxGroupType: 'COVID19',
        primaryMemberRxId: 'id1',
      },
    ];
    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    const result = getFeedAudience(responseFeatureFlagMock);

    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(result).toEqual({
      rxGroupTypes: ['SIE'],
      members: ['id1'],
    });
  });

  it('should not use rxgroupttype provided in request if isTestMembership is not set to true', () => {
    const responseFeatureFlagMock = {
      locals: {
        device: {
          data: 'fake-phone',
        },
        features: {
          usegrouptypesie: true,
        },
      },
    } as unknown as Response;
    const mockPersonList = [
      { rxGroupType: 'COVID19', primaryMemberRxId: 'id1' },
    ];
    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    getAllowedPersonsForLoggedInUserMock.mockReturnValueOnce(mockPersonList);

    const result = getFeedAudience(responseFeatureFlagMock);

    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(result).toEqual({
      rxGroupTypes: ['COVID19'],
      members: ['id1'],
    });
  });
});
