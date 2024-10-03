// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { IConfiguration } from '../../../configuration';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishUpdatePersonContactInformationMessage } from '../../../utils/service-bus/person-update-helper';
import { updateMemberContactInfoHandler } from './update-member-contact-info.handler';
import { getResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { IPerson } from '@phx/common/src/models/person';
import { getLoggedInUserProfileForRxGroupType } from '../../../utils/person/get-dependent-person.helper';

jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/request/request-app-locals.helper');
jest.mock('../../../utils/service-bus/person-update-helper');
jest.mock('@phx/common/src/utils/date-time-helper');
jest.mock('../../../utils/person/get-dependent-person.helper');

const CalculateAbsoluteAgeMock = CalculateAbsoluteAge as jest.Mock;
const publishUpdatePersonContactInfoMock =
  publishUpdatePersonContactInformationMessage as jest.Mock;
const getResponseLocalMock = getResponseLocal as jest.Mock;

const mockEmail = 'mock-email';
const mockNumber = 'mock-phoneNumber';
const mockIdentifier = 'mock-request-identifier';
const mockSecondaryMemberIdentifier = 'mock-secondaryMemberIdentifier';
const requestMock = {
  body: {
    email: mockEmail,
    phoneNumber: mockNumber,
    secondaryMemberIdentifier: mockSecondaryMemberIdentifier,
  },
  params: {
    identifier: mockIdentifier,
  },
} as unknown as Request;

const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const getLoggedInUserProfileForRxGroupTypeMock =
  getLoggedInUserProfileForRxGroupType as jest.Mock;

const configurationMock = {
  childMemberAgeLimit: 13,
} as IConfiguration;

beforeEach(() => {
  jest.resetAllMocks();
  CalculateAbsoluteAgeMock.mockReturnValue(10);
});

describe('updateMemberContactInfoHandler', () => {
  it('should allow user to edit his own information', async () => {
    const responseMock = {
      locals: {
        dependents: [
          {
            identifier: 'identifier-2',
            isPrimary: false,
            primaryMemberFamilyId: 'family-id',
            rxGroupType: 'SIE',
          },
        ],
      },
    } as unknown as Response;
    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce({
      identifier: mockIdentifier,
      isPrimary: false,
      primaryMemberFamilyId: 'family-id',
      rxGroupType: 'SIE',
    });
    await updateMemberContactInfoHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(publishUpdatePersonContactInfoMock).toHaveBeenCalledTimes(1);
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][0]).toBe(
      mockIdentifier
    );
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][1]).toBe(
      mockSecondaryMemberIdentifier
    );
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][2]).toBe(true);
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][3]).toBe(
      mockNumber
    );
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][4]).toBe(mockEmail);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(responseMock);
    expect(successResponseMock.mock.calls[0][1]).toBe(
      SuccessConstants.MEMBER_UPDATE_SENT_SUCCESSFULLY
    );
  });

  it('should return failure response if loggedIn member is not primary and trying to edit other user information', async () => {
    const invalidPrimaryMemberResponseMock = {
      locals: {},
    } as unknown as Response;
    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce({
      identifier: 'mock-id1',
      isPrimary: false,
      rxGroupType: 'SIE',
    });
    await updateMemberContactInfoHandler(
      requestMock,
      invalidPrimaryMemberResponseMock,
      configurationMock
    );

    expect(knownFailureResponseMock.mock.calls[0][0]).toBe(
      invalidPrimaryMemberResponseMock
    );
    expect(knownFailureResponseMock.mock.calls[0][1]).toBe(
      HttpStatusCodes.UNAUTHORIZED_REQUEST
    );
    expect(knownFailureResponseMock.mock.calls[0][2]).toBe(
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
  });

  it('should return failure response if loggedIn member is primary but identifier provided in params is not in family members list', async () => {
    const invalidIdentifierRequest = {
      ...requestMock,
      params: { identifier: 'fake-id' },
    } as unknown as Request;
    const dependentsMock = [
      {
        identifier: 'identifier-5',
        isPrimary: false,
        primaryMemberFamilyId: 'family-id5',
        rxGroupType: 'SIE',
      } as IPerson,
      {
        identifier: 'identifier-6',
        isPrimary: false,
        primaryMemberFamilyId: 'family-id4',
        rxGroupType: 'CASH',
      } as IPerson,
    ];
    const responseMockWithDependents = {
      locals: {
        dependents: dependentsMock,
      },
    } as unknown as Response;

    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce({
      identifier: 'loggedIn-user-identifier',
      isPrimary: true,
      primaryMemberFamilyId: 'family-id',
      rxGroupType: 'SIE',
    });
    getResponseLocalMock.mockReturnValue(dependentsMock);
    await updateMemberContactInfoHandler(
      invalidIdentifierRequest,
      responseMockWithDependents,
      configurationMock
    );

    expect(knownFailureResponseMock.mock.calls[0][0]).toBe(
      responseMockWithDependents
    );
    expect(knownFailureResponseMock.mock.calls[0][1]).toBe(
      HttpStatusCodes.UNAUTHORIZED_REQUEST
    );
    expect(knownFailureResponseMock.mock.calls[0][2]).toBe(
      ErrorConstants.UPDATE_CONTACT_INFO_FAILED
    );
  });

  it('should return failure response if loggedIn member is primary and trying to edit details of member of age greater than or equal to 13', async () => {
    const invalidIdentifierRequest = {
      ...requestMock,
      params: { identifier: 'fake-id' },
    } as unknown as Request;

    const dependentsMock = [
      {
        identifier: 'identifier-5',
        isPrimary: false,
        dateOfBirth: '2005-01-01',
        primaryMemberFamilyId: 'family-id',
        rxGroupType: 'SIE',
      } as IPerson,
      {
        identifier: 'identifier-6',
        isPrimary: false,
        dateOfBirth: '2005-01-01',
        primaryMemberFamilyId: 'family-id',
        rxGroupType: 'CASH',
      } as IPerson,
    ];
    const responseMockWithDependents = {
      locals: {
        personList: [
          {
            identifier: 'loggedIn-user-identifier',
            isPrimary: true,
            primaryMemberFamilyId: 'family-id',
            rxGroupType: 'SIE',
          },
        ],
        dependents: dependentsMock,
      },
    } as unknown as Response;

    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce({
      identifier: 'loggedIn-user-identifier',
      isPrimary: true,
      primaryMemberFamilyId: 'family-id',
      rxGroupType: 'SIE',
    });
    getResponseLocalMock.mockReturnValueOnce(dependentsMock);
    CalculateAbsoluteAgeMock.mockReturnValueOnce(13);
    await updateMemberContactInfoHandler(
      invalidIdentifierRequest,
      responseMockWithDependents,
      configurationMock
    );

    expect(knownFailureResponseMock.mock.calls[0][0]).toBe(
      responseMockWithDependents
    );
    expect(knownFailureResponseMock.mock.calls[0][1]).toBe(
      HttpStatusCodes.UNAUTHORIZED_REQUEST
    );
    expect(knownFailureResponseMock.mock.calls[0][2]).toBe(
      ErrorConstants.UPDATE_CONTACT_INFO_FAILED
    );
  });

  it('should call publishUpdatePersonContactInformationMessage if user is trying to edit child member information', async () => {
    const personListMock = [
      {
        identifier: 'loggedIn-user-identifier',
        isPrimary: true,
        primaryMemberFamilyId: 'family-id',
        rxGroupType: 'SIE',
      },
    ];
    const dependentsMock = [
      {
        identifier: mockIdentifier,
        isPrimary: false,
        dateOfBirth: '2016-01-01',
        primaryMemberFamilyId: 'family-id',
        rxGroupType: 'SIE',
      } as IPerson,
      {
        identifier: 'identifier-6',
        isPrimary: false,
        dateOfBirth: '2005-01-01',
        primaryMemberFamilyId: 'family-id',
        rxGroupType: 'CASH',
      } as IPerson,
    ];
    const responseMockWithDependents = {
      locals: {
        personList: personListMock,
        dependents: dependentsMock,
      },
    } as unknown as Response;

    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce({
      identifier: 'loggedIn-user-identifier',
      isPrimary: true,
      primaryMemberFamilyId: 'family-id',
      rxGroupType: 'SIE',
    });
    getResponseLocalMock.mockReturnValueOnce(dependentsMock);
    CalculateAbsoluteAgeMock.mockReturnValueOnce(5);
    await updateMemberContactInfoHandler(
      requestMock,
      responseMockWithDependents,
      configurationMock
    );

    expect(publishUpdatePersonContactInfoMock.mock.calls[0][0]).toBe(
      mockIdentifier
    );
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][1]).toBe(
      mockSecondaryMemberIdentifier
    );
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][2]).toBe(false);
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][3]).toBe(
      mockNumber
    );
    expect(publishUpdatePersonContactInfoMock.mock.calls[0][4]).toBe(mockEmail);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(
      responseMockWithDependents
    );
    expect(successResponseMock.mock.calls[0][1]).toBe(
      SuccessConstants.MEMBER_UPDATE_SENT_SUCCESSFULLY
    );
  });

  it('should throw Internal server error if publishPersonUpdateMessage fails', async () => {
    publishUpdatePersonContactInfoMock.mockReturnValueOnce(
      Promise.reject({
        message: 'server error',
        status: 500,
      })
    );
    const dependentsMock = [
      {
        identifier: 'mockIdentifier',
        isPrimary: false,
        dateOfBirth: '2016-01-01',
        primaryMemberFamilyId: 'family-id',
        rxGroupType: 'SIE',
      } as IPerson,
      {
        identifier: 'identifier-6',
        isPrimary: false,
        dateOfBirth: '2005-01-01',
        primaryMemberFamilyId: 'family-id5',
        rxGroupType: 'CASH',
      } as IPerson,
    ];
    const responseMockWithDependents = {
      locals: {
        dependents: dependentsMock,
      },
    } as unknown as Response;
    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce({
      identifier: 'mock-request-identifier',
      isPrimary: true,
      primaryMemberFamilyId: 'family-id',
      rxGroupType: 'SIE',
    });
    getResponseLocalMock.mockReturnValueOnce(dependentsMock);
    CalculateAbsoluteAgeMock.mockReturnValueOnce(5);
    await updateMemberContactInfoHandler(
      requestMock,
      responseMockWithDependents,
      configurationMock
    );
    expect(publishUpdatePersonContactInfoMock).toHaveBeenCalledTimes(1);

    expect(unknownFailureResponseMock).toBeCalledTimes(1);
    expect(unknownFailureResponseMock.mock.calls[0][0]).toBe(
      responseMockWithDependents
    );
    expect(unknownFailureResponseMock.mock.calls[0][1]).toBe(
      ErrorConstants.SERVICE_BUS_FAILURE
    );
  });

  it('should return SIE_PROFILE_NOT_FOUND error if loggedIn member is not an SIE user', async () => {
    const invalidIdentifierRequest = {
      ...requestMock,
      params: { identifier: 'fake-id' },
    } as unknown as Request;

    const responseMock = {
      locals: {},
    } as unknown as Response;

    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce(undefined);
    getResponseLocalMock.mockReturnValueOnce(undefined);
    await updateMemberContactInfoHandler(
      invalidIdentifierRequest,
      responseMock,
      configurationMock
    );

    expect(knownFailureResponseMock.mock.calls[0][0]).toBe(responseMock);
    expect(knownFailureResponseMock.mock.calls[0][1]).toBe(
      HttpStatusCodes.UNAUTHORIZED_REQUEST
    );
    expect(knownFailureResponseMock.mock.calls[0][2]).toBe(
      ErrorConstants.SIE_PROFILE_NOT_FOUND
    );
  });
});
