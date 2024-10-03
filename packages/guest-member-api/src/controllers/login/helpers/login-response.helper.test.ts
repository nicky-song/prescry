// Copyright 2020 Prescryptive Health, Inc.

import {
  invalidMemberDetailsResponse,
  invalidMemberResponse,
  invalidMemberRxIdResponse,
  loginSuccessResponse,
} from './login-response.helper';
import { Response } from 'express';
import {
  trackMissingData,
  trackRegistrationFailureEvent,
  trackNewPhoneNumberRegistrationEvent,
} from '../../../utils/custom-event-helper';
import {
  KnownFailureResponse,
  SuccessResponseWithoutHeaders,
} from '../../../utils/response-helper';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  LoginMessages as responseMessage,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { addPhoneRegistrationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';
import { IPerson } from '@phx/common/src/models/person';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';

jest.mock('../../../utils/custom-event-helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../../databases/redis/redis-query-helper');
jest.mock('../../../utils/account/account.helper');

const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const trackRegistrationFailureEventMock =
  trackRegistrationFailureEvent as jest.Mock;
const trackMissingDataMock = trackMissingData as jest.Mock;
const trackNewPhoneNumberRegistrationEventMock =
  trackNewPhoneNumberRegistrationEvent as jest.Mock;
const addPhoneRegistrationKeyInRedisMock =
  addPhoneRegistrationKeyInRedis as jest.Mock;
const publishAccountUpdateMessageAndAddToRedisMock =
  publishAccountUpdateMessageAndAddToRedis as jest.Mock;
const SuccessResponseWithoutHeadersMock =
  SuccessResponseWithoutHeaders as jest.Mock;

const responseMock = {} as unknown as Response;
const primaryMemberRxIdMock = '1234567890';
const firstNameMock = 'Johnny';
const lastNameMock = 'Appleseed';
const dateOfBirthMock = '01/01/2020';
const phoneNumberMock = '111-222-3333';
const redisPhoneNumberRegistrationKeyExpiryTimeMock = 1;
const modelFoundMock: IPerson = {
  identifier: '123',
  phoneNumber: phoneNumberMock,
  firstName: firstNameMock,
  lastName: lastNameMock,
  dateOfBirth: dateOfBirthMock,
  isPhoneNumberVerified: false,
  primaryMemberRxId: primaryMemberRxIdMock,
  isPrimary: true,
  email: 'johnny@appleseed.com',
  primaryMemberPersonCode: '2002',
  rxGroupType: RxGroupTypesEnum.CASH,
  rxGroup: 'abc',
  rxBin: 'default',
  carrierPCN: 'default',
};

describe('Login response helpers -> ', () => {
  beforeEach(() => {
    KnownFailureResponseMock.mockReset();
    trackRegistrationFailureEventMock.mockReset();
    trackMissingDataMock.mockReset();
    trackNewPhoneNumberRegistrationEventMock.mockReset();
    addPhoneRegistrationKeyInRedisMock.mockReset();
    publishAccountUpdateMessageAndAddToRedisMock.mockReset();
    SuccessResponseWithoutHeadersMock.mockReset();
  });

  it('invalidMemberDetailsResponse -> ', () => {
    const expectedMock = {
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage: responseMessage.INVALID_USER_DETAILS,
    };
    expect(
      invalidMemberDetailsResponse(
        firstNameMock,
        lastNameMock,
        dateOfBirthMock,
        primaryMemberRxIdMock
      )
    ).toEqual(expectedMock);
    expect(trackRegistrationFailureEventMock).toBeCalledWith(
      'InvalidMemberDetails',
      firstNameMock,
      lastNameMock,
      primaryMemberRxIdMock,
      dateOfBirthMock
    );
  });

  it('invalidMemberResponse -> ', () => {
    const expectedMock = {
      isValidMembership: false,
      responseCode: HttpStatusCodes.SERVER_DATA_ERROR,
      responseMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
    };
    expect(invalidMemberResponse(primaryMemberRxIdMock)).toEqual(expectedMock);
    expect(trackMissingDataMock).toBeCalledWith(
      'identifier',
      primaryMemberRxIdMock,
      'Person'
    );
  });

  it('invalidMemberRxIdResponse -> ', () => {
    const expectedMock = {
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage: responseMessage.INVALID_MEMBER_RXID,
    };
    expect(
      invalidMemberRxIdResponse(
        firstNameMock,
        lastNameMock,
        dateOfBirthMock,
        primaryMemberRxIdMock
      )
    ).toEqual(expectedMock);
    expect(trackRegistrationFailureEventMock).toBeCalledWith(
      'InvalidMemberRxId',
      firstNameMock,
      lastNameMock,
      primaryMemberRxIdMock,
      dateOfBirthMock
    );
  });

  it('loginSuccessResponse -> ', async () => {
    await loginSuccessResponse(
      responseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      redisPhoneNumberRegistrationKeyExpiryTimeMock,
      modelFoundMock,
      false,
      'test@test.com'
    );
    expect(addPhoneRegistrationKeyInRedisMock).toBeCalledWith(
      phoneNumberMock,
      modelFoundMock,
      redisPhoneNumberRegistrationKeyExpiryTimeMock
    );

    const expected = {
      dateOfBirth: dateOfBirthMock,
      firstName: 'JOHNNY',
      lastName: 'APPLESEED',
      phoneNumber: phoneNumberMock,
      recoveryEmail: 'test@test.com',
      recentlyUpdated: true,
    };
    expect(publishAccountUpdateMessageAndAddToRedisMock).toBeCalledWith(
      expected,
      redisPhoneNumberRegistrationKeyExpiryTimeMock
    );
    expect(trackNewPhoneNumberRegistrationEventMock).toBeCalledWith(
      phoneNumberMock,
      modelFoundMock.identifier
    );
    expect(SuccessResponseWithoutHeadersMock).toBeCalledWith(
      responseMock,
      responseMessage.AUTHENTICATION_SUCCESSFUL,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });
  it('loginSuccessResponse when addMembers-> ', async () => {
    await loginSuccessResponse(
      responseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      redisPhoneNumberRegistrationKeyExpiryTimeMock,
      modelFoundMock,
      true
    );
    expect(addPhoneRegistrationKeyInRedisMock).toBeCalledWith(
      phoneNumberMock,
      modelFoundMock,
      redisPhoneNumberRegistrationKeyExpiryTimeMock
    );

    expect(publishAccountUpdateMessageAndAddToRedisMock).not.toBeCalled();
    expect(trackNewPhoneNumberRegistrationEventMock).toBeCalledWith(
      phoneNumberMock,
      modelFoundMock.identifier
    );
    expect(SuccessResponseWithoutHeadersMock).toBeCalledWith(
      responseMock,
      responseMessage.ADD_MEMBERSHIP_SUCCESS
    );
  });
});
