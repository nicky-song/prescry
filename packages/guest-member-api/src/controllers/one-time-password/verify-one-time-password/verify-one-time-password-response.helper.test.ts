// Copyright 2020 Prescryptive Health, Inc.

import {
  memberRegistrationRequiredResponse,
  createPinResponse,
  phoneLoginSuccessResponse,
} from './verify-one-time-password-response.helper';
import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { InternalResponseCode } from '../../../constants/error-codes';
import { SuccessConstants } from '../../../constants/response-messages';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';
import { SuccessResponse } from '../../../utils/response-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';

import { configurationMock } from '../../../mock-data/configuration.mock';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';

jest.mock('../../../utils/custom-event-helper');
jest.mock('../../../utils/service-bus/account-update-helper');
jest.mock('../../../utils/account/account.helper');
jest.mock('../../../utils/response-helper');

const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;
const publishAccountUpdateMessageAndAddToRedisMock =
  publishAccountUpdateMessageAndAddToRedis as jest.Mock;

const SuccessResponseMock = SuccessResponse as jest.Mock;

const phoneNumberMock = '111-222-3333';
const responseMock = {} as Response;
const tokenMock = 'mock-token';
const termsAndConditionsAcceptanceMock = {
  hasAccepted: true,
  allowSmsMessages: true,
  allowEmailMessages: true,
  fromIP: '128.0.0.1',
  acceptedDateTime: '01/01/2020',
  browser: 'safari',
  authToken: 'mock-auth-token',
} as ITermsAndConditionsWithAuthTokenAcceptance;
const primaryMemeberRxIdMock = '1234567890';
const firstNameMock = 'Johnny';
const lastNameMock = 'Appleseed';
const dateOfBirthMock = '01/01/2020';
const personMock: IPerson = {
  identifier: '123',
  phoneNumber: phoneNumberMock,
  firstName: firstNameMock,
  lastName: lastNameMock,
  dateOfBirth: dateOfBirthMock,
  isPhoneNumberVerified: false,
  primaryMemberRxId: primaryMemeberRxIdMock,
  isPrimary: true,
  email: 'johnny@appleseed.com',
  primaryMemberPersonCode: '2002',
  rxGroupType: RxGroupTypesEnum.CASH,
  rxGroup: 'abc',
  rxBin: 'default',
  carrierPCN: 'default',
};

describe('memberRegistrationRequiredResponse ->', () => {
  it('publishAccountUpdateMessage is called and "SuccessResponse" response is returned', async () => {
    SuccessResponseMock.mockReturnValue({ status: 200 });
    expect(
      await memberRegistrationRequiredResponse(
        phoneNumberMock,
        termsAndConditionsAcceptanceMock,
        tokenMock,
        responseMock
      )
    ).toEqual({ status: 200 });
    expect(publishAccountUpdateMessageMock).toBeCalledWith({
      phoneNumber: phoneNumberMock,
      termsAndConditionsAcceptances: termsAndConditionsAcceptanceMock,
    });
    expect(SuccessResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_LOGIN,
      { deviceToken: tokenMock },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_REGISTRATION
    );
  });
});

describe('createPinResponse ->', () => {
  it('publishAccountUpdateMessageAndAddToRedis is called and "SuccessResponse" response is returned', async () => {
    SuccessResponseMock.mockReturnValue({ status: 200 });
    expect(
      await createPinResponse(
        phoneNumberMock,
        termsAndConditionsAcceptanceMock,
        tokenMock,
        personMock,
        responseMock,
        configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
      )
    ).toEqual({ status: 200 });
    expect(publishAccountUpdateMessageAndAddToRedisMock).toBeCalledWith(
      {
        dateOfBirth: personMock.dateOfBirth,
        firstName: personMock.firstName,
        lastName: personMock.lastName,
        phoneNumber: personMock.phoneNumber,
        termsAndConditionsAcceptances: termsAndConditionsAcceptanceMock,
        recentlyUpdated: true,
      },
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
    expect(SuccessResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.CREATE_WITH_PIN,
      { deviceToken: tokenMock },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN
    );
  });
});

describe('phoneLoginSuccessResponse ->', () => {
  it('SuccessResponse is called with corresponding custom code and message when account key is undefined', () => {
    SuccessResponseMock.mockReturnValue({ status: 200 });
    expect(
      phoneLoginSuccessResponse(undefined, tokenMock, responseMock)
    ).toEqual({ status: 200 });
    expect(SuccessResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: false },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('SuccessResponse is called with corresponding custom code and message when account key is valid string', () => {
    const accountKey = 'mock-account-key';

    SuccessResponseMock.mockReturnValue({ status: 200 });
    expect(
      phoneLoginSuccessResponse(accountKey, tokenMock, responseMock, true)
    ).toEqual({ status: 200 });
    expect(SuccessResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
  });
});
