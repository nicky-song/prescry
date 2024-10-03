// Copyright 2021 Prescryptive Health, Inc.

import {
  ISmartPriceRegistration,
  registerSmartPriceHandler,
} from './register-smart-price.handler';
import { Request, Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { searchPersonByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';

import {
  KnownFailureResponse,
  errorResponseWithTwilioErrorHandling,
  SuccessResponse,
} from '../../../utils/response-helper';
import { buildTermsAndConditionsAcceptance } from '../../../utils/terms-and-conditions.helper';
import { verifyOneTimePassword } from '../../../utils/twilio-helper';
import { generateDeviceToken } from '../../../utils/verify-device-helper';
import { getNext } from '../../../utils/redis/redis-order-number.helper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { buildSmartPriceRegistration } from '../helpers/build-smart-price-registration';
import { publishPersonCreateMessage } from '../../../utils/service-bus/person-update-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';

import { publishBrokerReferralEvent } from '../helpers/publish-broker-referral-event';
import sgMail from '@sendgrid/mail';
import { ApiConstants } from '../../../constants/api-constants';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
jest.mock('../../../utils/twilio-helper', () => ({
  verifyOneTimePassword: jest.fn(),
}));

jest.mock('../../../utils/service-bus/account-update-helper');
jest.mock('../../../utils/account/account.helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../../constants/response-messages');
jest.mock('../../../utils/verify-device-helper');

jest.mock('../../../utils/terms-and-conditions.helper');
const buildTermsAndConditionsAcceptancesMock =
  buildTermsAndConditionsAcceptance as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/person-collection-helper'
);
jest.mock('../../../utils/person/person-helper');
jest.mock('../../../utils/redis/redis-order-number.helper');
jest.mock('../helpers/build-smart-price-registration');
jest.mock('../../../utils/service-bus/person-update-helper');
jest.mock('../helpers/publish-broker-referral-event');
jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn(),
  };
});
const errorResponseWithTwilioErrorHandlingMock =
  errorResponseWithTwilioErrorHandling as jest.Mock;
const verifyOneTimePasswordMock = verifyOneTimePassword as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const generateDeviceTokenMock = generateDeviceToken as jest.Mock;
const searchPersonByPhoneNumberMock = searchPersonByPhoneNumber as jest.Mock;
const getNextMock = getNext as jest.Mock;
const buildSmartPriceRegistrationMock =
  buildSmartPriceRegistration as jest.Mock;
const publishPersonCreateMessageMock = publishPersonCreateMessage as jest.Mock;
const publishBrokerReferralEventMock = publishBrokerReferralEvent as jest.Mock;
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;
const publishAccountUpdateMessageAndAddToRedisMock =
  publishAccountUpdateMessageAndAddToRedis as jest.Mock;

const primaryMemberRxIdMock = '1234567890';
const firstNameMock = 'Johnny';
const lastNameMock = 'Appleseed';
const dateOfBirthMock = '01/01/2020';
const phoneNumberMock = '111-222-3333';
const emailMock = 'email@test.com';
const responseMock = {} as Response;
const registrationMock = {
  verifyCode: '111111',
  firstName: firstNameMock,
  lastName: lastNameMock,
  dateOfBirth: dateOfBirthMock,
  phoneNumber: phoneNumberMock,
  email: emailMock,
  source: 'source',
} as ISmartPriceRegistration;
const registrationNoSourceMock = {
  verifyCode: '111111',
  firstName: firstNameMock,
  lastName: lastNameMock,
  dateOfBirth: dateOfBirthMock,
  phoneNumber: phoneNumberMock,
  email: emailMock,
} as ISmartPriceRegistration;
const requestMock = {
  body: registrationMock,
} as Request;
const requestNoSourceMock = {
  body: registrationNoSourceMock,
} as Request;
const mockCreate = jest.fn();
const databaseMock = {} as IDatabase;
const twilioClientMock = {
  messages: {
    create: mockCreate,
  },
} as unknown as Twilio;
const configurationMock = {
  twilioVerificationServiceId: 'mock-serviceId',
  twilioMessagingFromPhoneNumber: 'phoneNumber',
  orderNumberBlockLength: 100,
} as IConfiguration;

const listOfPersonsMock: [IPerson] = [
  {
    identifier: '123',
    phoneNumber: phoneNumberMock,
    firstName: firstNameMock,
    lastName: lastNameMock,
    dateOfBirth: dateOfBirthMock,
    isPhoneNumberVerified: false,
    primaryMemberRxId: primaryMemberRxIdMock,
    primaryMemberFamilyId: 'SM12345',
    isPrimary: true,
    email: 'johnny@appleseed.com',
    primaryMemberPersonCode: '01',
    rxGroup: '200P32F',
    rxSubGroup: 'SMARTPRICE',
    rxGroupType: RxGroupTypesEnum.CASH,
    rxBin: '610749',
    carrierPCN: 'X01',
  },
];

const listOfSIEPersonsMock: [IPerson] = [
  {
    identifier: '123',
    phoneNumber: phoneNumberMock,
    firstName: firstNameMock,
    lastName: lastNameMock,
    dateOfBirth: dateOfBirthMock,
    isPhoneNumberVerified: false,
    primaryMemberRxId: primaryMemberRxIdMock,
    primaryMemberFamilyId: 'SM12345',
    isPrimary: true,
    email: 'johnny@appleseed.com',
    primaryMemberPersonCode: '01',
    rxGroup: '200P32F',
    rxSubGroup: 'SMARTPRICE',
    rxGroupType: RxGroupTypesEnum.SIE,
    rxBin: '610749',
    carrierPCN: 'X01',
  },
];
const listOfCashPersonMocks: [IPerson] = [
  {
    identifier: '123',
    phoneNumber: phoneNumberMock,
    firstName: firstNameMock,
    lastName: lastNameMock,
    dateOfBirth: dateOfBirthMock,
    isPhoneNumberVerified: false,
    primaryMemberRxId: 'CA1234501',
    primaryMemberFamilyId: 'CA12345',
    isPrimary: true,
    email: 'johnny@appleseed.com',
    primaryMemberPersonCode: '01',
    rxGroup: '200P32F',
    rxSubGroup: 'CASH',
    rxGroupType: RxGroupTypesEnum.CASH,
    rxBin: '610749',
    carrierPCN: 'X01',
  },
];
const listOfPersonsWithBrokerMock: [IPerson] = [
  {
    identifier: '123',
    phoneNumber: phoneNumberMock,
    firstName: firstNameMock,
    lastName: lastNameMock,
    dateOfBirth: dateOfBirthMock,
    isPhoneNumberVerified: false,
    primaryMemberRxId: primaryMemberRxIdMock,
    primaryMemberFamilyId: 'SM12345',
    isPrimary: true,
    email: 'johnny@appleseed.com',
    primaryMemberPersonCode: '01',
    rxGroup: '200P32F',
    rxSubGroup: 'SMARTPRICE',
    rxGroupType: RxGroupTypesEnum.CASH,
    rxBin: '610749',
    carrierPCN: 'X01',
    source: '12345',
  },
];
const smartPriceRegistration = {
  identifier: 'xxx',
  phoneNumber: phoneNumberMock,
  firstName: firstNameMock,
  lastName: lastNameMock,
  dateOfBirth: dateOfBirthMock,
  isPhoneNumberVerified: false,
  primaryMemberRxId: primaryMemberRxIdMock,
  primaryMemberFamilyId: 'SM12346',
  isPrimary: true,
  email: 'johnny@appleseed.com',
  primaryMemberPersonCode: '01',
  rxGroup: '200P32F',
  rxSubGroup: 'SMARTPRICE',
  rxGroupType: RxGroupTypesEnum.CASH,
  rxBin: '610749',
  carrierPCN: 'X01',
  source: 'source',
};
const smartPriceRegistrationNoSource = {
  identifier: 'xxx',
  phoneNumber: phoneNumberMock,
  firstName: firstNameMock,
  lastName: lastNameMock,
  dateOfBirth: dateOfBirthMock,
  isPhoneNumberVerified: false,
  primaryMemberRxId: primaryMemberRxIdMock,
  primaryMemberFamilyId: 'SM12346',
  isPrimary: true,
  email: 'johnny@appleseed.com',
  primaryMemberPersonCode: '01',
  rxGroup: '200P32F',
  rxSubGroup: 'SMARTPRICE',
  rxGroupType: RxGroupTypesEnum.CASH,
  rxBin: '610749',
  carrierPCN: 'X01',
};
beforeEach(() => {
  jest.clearAllMocks();
  buildSmartPriceRegistrationMock.mockReturnValue(smartPriceRegistration);
});

describe('registerSmartPriceHandler', () => {
  it('calls method verifyOneTimePassword with expected parameters', async () => {
    const { verifyCode, phoneNumber } = requestMock.body;
    const { twilioVerificationServiceId } = configurationMock;
    verifyOneTimePasswordMock.mockReturnValueOnce({ status: 'failed' });
    await registerSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(verifyOneTimePasswordMock).toHaveBeenNthCalledWith(
      1,
      twilioClientMock,
      twilioVerificationServiceId,
      phoneNumber,
      verifyCode
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledTimes(1);
  });

  it('calls twilio message create after "verifyOneTimePassword" returns approved status then generateDeviceToken, generateTermsAndConditionsAcceptances, searchPersonByPhoneNumber are called', async () => {
    const { phoneNumber } = requestMock.body;

    generateDeviceTokenMock.mockReturnValue({
      account: { _id: 'mock-account-id' },
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    verifyOneTimePasswordMock.mockReturnValue({ status: 'approved' });
    searchPersonByPhoneNumberMock.mockReturnValue(listOfPersonsMock);
    getNextMock.mockReturnValueOnce('5');
    await registerSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(generateDeviceTokenMock).toBeCalledWith(
      phoneNumber,
      configurationMock,
      databaseMock
    );
    expect(buildTermsAndConditionsAcceptancesMock).toBeCalledWith(
      requestMock,
      'mock-token'
    );
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumber
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(mockCreate).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      {
        memberId: 'SM12345',
        rxGroup: '200P32F',
        rxBin: '610749',
        carrierPCN: 'X01',
      }
    );
  });

  it('should send email after "verifyOneTimePassword" returns approved status then generateDeviceToken, generateTermsAndConditionsAcceptances, searchPersonByPhoneNumber are called', async () => {
    const { phoneNumber } = requestMock.body;

    generateDeviceTokenMock.mockReturnValue({
      account: { _id: 'mock-account-id', dateOfBirth: dateOfBirthMock },
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    verifyOneTimePasswordMock.mockReturnValue({ status: 'approved' });
    searchPersonByPhoneNumberMock.mockReturnValue(listOfPersonsMock);
    getNextMock.mockReturnValueOnce('5');
    await registerSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(generateDeviceTokenMock).toBeCalledWith(
      phoneNumber,
      configurationMock,
      databaseMock
    );
    expect(buildTermsAndConditionsAcceptancesMock).toBeCalledWith(
      requestMock,
      'mock-token'
    );
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumber
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(publishAccountUpdateMessageAndAddToRedisMock).not.toHaveBeenCalled();
    expect(publishAccountUpdateMessageMock).toHaveBeenCalled();
    expect(mockCreate).toBeCalledTimes(1);
    expect(sgMail.send).toBeCalledWith({
      from: {
        email: 'noreply@prescryptive.com',
        name: 'Prescryptive',
      },
      personalizations: [
        {
          dynamic_template_data: {
            carrierPCN: 'X01',
            memberId: 'SM12345',
            rxBin: '610749',
            rxGroup: '200P32F',
          },
          subject: 'Savings for your medications',
          to: [
            {
              email: 'email@test.com',
              name: 'Johnny Appleseed',
            },
          ],
        },
      ],
      templateId: ApiConstants.SMART_PRICE_EMAIL_TEMPLATE_ID,
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      {
        memberId: 'SM12345',
        rxGroup: '200P32F',
        rxBin: '610749',
        carrierPCN: 'X01',
      }
    );
  });

  it('should return KnownFailure Response when existing SIE user tries to register for SmartPRICE', async () => {
    const { phoneNumber } = requestMock.body;

    generateDeviceTokenMock.mockReturnValue({
      account: { _id: 'mock-account-id' },
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    verifyOneTimePasswordMock.mockReturnValue({ status: 'approved' });
    searchPersonByPhoneNumberMock.mockReturnValue(listOfSIEPersonsMock);
    getNextMock.mockReturnValueOnce('5');
    await registerSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(generateDeviceTokenMock).toBeCalledWith(
      phoneNumber,
      configurationMock,
      databaseMock
    );
    expect(buildTermsAndConditionsAcceptancesMock).toBeCalledWith(
      requestMock,
      'mock-token'
    );
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumber
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.SMARTPRICE_NOT_ELIGIBLE
    );
  });
  it('should create new person for SmartPRICE if CASH profile does not exists and publish referral event if source exists', async () => {
    const { phoneNumber } = requestMock.body;

    generateDeviceTokenMock.mockReturnValue({
      account: { _id: 'mock-account-id' },
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    verifyOneTimePasswordMock.mockReturnValue({ status: 'approved' });
    searchPersonByPhoneNumberMock.mockReturnValue([]);
    getNextMock.mockReturnValueOnce('5');
    const expectedMemberInfo = {
      memberId: 'SM12346',
      rxGroup: '200P32F',
      rxBin: '610749',
      carrierPCN: 'X01',
    };
    const twilioTextMessage = `Welcome to the Prescryptive SmartPrice™ savings plan!

Present the following information to your pharmacy to save on medications:
Member ID: SM12346
RxGroup: 200P32F
RxBin: 610749
PCN: X01`;
    await registerSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(getNextMock).toBeCalledWith(databaseMock, 100);
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumber
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(publishPersonCreateMessageMock).toBeCalled();
    expect(publishAccountUpdateMessageAndAddToRedisMock).toHaveBeenCalled();
    expect(mockCreate).toBeCalled();
    expect(mockCreate).toBeCalledWith({
      to: '111-222-3333',
      body: twilioTextMessage,
      from: 'phoneNumber',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedMemberInfo
    );
    expect(publishBrokerReferralEventMock).toBeCalledWith(
      '1234567890',
      'source'
    );
  });
  it('should not create new person for SmartPRICE if CASH profile exists but publish source if it exists', async () => {
    const { phoneNumber } = requestMock.body;

    generateDeviceTokenMock.mockReturnValue({
      account: { _id: 'mock-account-id' },
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    verifyOneTimePasswordMock.mockReturnValue({ status: 'approved' });
    searchPersonByPhoneNumberMock.mockReturnValue(listOfCashPersonMocks);
    getNextMock.mockReturnValueOnce('5');
    const expectedMemberInfo = {
      memberId: 'CA12345',
      rxGroup: '200P32F',
      rxBin: '610749',
      carrierPCN: 'X01',
    };
    const twilioTextMessage = `Welcome to the Prescryptive SmartPrice™ savings plan!

Present the following information to your pharmacy to save on medications:
Member ID: CA12345
RxGroup: 200P32F
RxBin: 610749
PCN: X01`;
    await registerSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumber
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(publishPersonCreateMessageMock).not.toBeCalled();
    expect(mockCreate).toBeCalled();
    expect(mockCreate).toBeCalledWith({
      to: '111-222-3333',
      body: twilioTextMessage,
      from: 'phoneNumber',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedMemberInfo
    );
    expect(publishBrokerReferralEventMock).toBeCalledWith(
      'CA1234501',
      'source'
    );
  });

  it('should not publish referral event for existing user for SmartPRICE if CASH profile exists and request does not have source', async () => {
    const { phoneNumber } = requestNoSourceMock.body;

    generateDeviceTokenMock.mockReturnValue({
      account: { _id: 'mock-account-id' },
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    verifyOneTimePasswordMock.mockReturnValue({ status: 'approved' });
    searchPersonByPhoneNumberMock.mockReturnValue(listOfCashPersonMocks);
    getNextMock.mockReturnValueOnce('5');
    const expectedMemberInfo = {
      memberId: 'CA12345',
      rxGroup: '200P32F',
      rxBin: '610749',
      carrierPCN: 'X01',
    };
    const twilioTextMessage = `Welcome to the Prescryptive SmartPrice™ savings plan!

Present the following information to your pharmacy to save on medications:
Member ID: CA12345
RxGroup: 200P32F
RxBin: 610749
PCN: X01`;
    buildSmartPriceRegistrationMock.mockReturnValueOnce(
      smartPriceRegistrationNoSource
    );
    await registerSmartPriceHandler(
      requestNoSourceMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumber
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(publishPersonCreateMessageMock).not.toBeCalled();
    expect(mockCreate).toBeCalled();
    expect(mockCreate).toBeCalledWith({
      to: '111-222-3333',
      body: twilioTextMessage,
      from: 'phoneNumber',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedMemberInfo
    );
    expect(publishBrokerReferralEventMock).not.toBeCalled();
  });

  it('should create new person for SmartPRICE if CASH profile does not exists and not publish referral event if source not provided', async () => {
    const { phoneNumber } = requestNoSourceMock.body;

    generateDeviceTokenMock.mockReturnValue({
      account: { _id: 'mock-account-id' },
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    verifyOneTimePasswordMock.mockReturnValue({ status: 'approved' });
    searchPersonByPhoneNumberMock.mockReturnValue([]);
    getNextMock.mockReturnValueOnce('5');
    const expectedMemberInfo = {
      memberId: 'SM12346',
      rxGroup: '200P32F',
      rxBin: '610749',
      carrierPCN: 'X01',
    };
    buildSmartPriceRegistrationMock.mockReturnValueOnce(
      smartPriceRegistrationNoSource
    );
    const twilioTextMessage = `Welcome to the Prescryptive SmartPrice™ savings plan!

Present the following information to your pharmacy to save on medications:
Member ID: SM12346
RxGroup: 200P32F
RxBin: 610749
PCN: X01`;
    await registerSmartPriceHandler(
      requestNoSourceMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(getNextMock).toBeCalledWith(databaseMock, 100);
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumber
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(publishPersonCreateMessageMock).toBeCalled();
    expect(publishAccountUpdateMessageAndAddToRedisMock).toHaveBeenCalled();
    expect(mockCreate).toBeCalled();
    expect(mockCreate).toBeCalledWith({
      to: '111-222-3333',
      body: twilioTextMessage,
      from: 'phoneNumber',
    });
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedMemberInfo
    );
    expect(publishBrokerReferralEventMock).not.toBeCalled();
  });

  it('should not return error Response when existing user already has an associated broker', async () => {
    const { phoneNumber } = requestMock.body;

    generateDeviceTokenMock.mockReturnValue({
      account: { _id: 'mock-account-id', dateOfBirth: dateOfBirthMock },
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    const expectedMemberInfo = {
      memberId: 'SM12345',
      rxGroup: '200P32F',
      rxBin: '610749',
      carrierPCN: 'X01',
    };
    const twilioTextMessage = `Welcome to the Prescryptive SmartPrice™ savings plan!

Present the following information to your pharmacy to save on medications:
Member ID: SM12345
RxGroup: 200P32F
RxBin: 610749
PCN: X01`;
    verifyOneTimePasswordMock.mockReturnValue({ status: 'approved' });
    searchPersonByPhoneNumberMock.mockReturnValue(listOfPersonsWithBrokerMock);
    getNextMock.mockReturnValueOnce('5');
    await registerSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(generateDeviceTokenMock).toBeCalledWith(
      phoneNumber,
      configurationMock,
      databaseMock
    );
    expect(buildTermsAndConditionsAcceptancesMock).toBeCalledWith(
      requestMock,
      'mock-token'
    );
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumber
    );
    expect(getNextMock).toHaveBeenCalled();
    expect(mockCreate).toBeCalled();
    expect(mockCreate).toBeCalledWith({
      to: '111-222-3333',
      body: twilioTextMessage,
      from: 'phoneNumber',
    });
    expect(publishAccountUpdateMessageAndAddToRedisMock).not.toHaveBeenCalled();
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      expectedMemberInfo
    );
  });

  it('should call errorResponseWithTwilioErrorHandlingMock when any other exception occurs', async () => {
    const error = {
      message: 'internal error',
      code: '111111',
      status: 'failed',
    };
    const expected = {};
    errorResponseWithTwilioErrorHandlingMock.mockReturnValueOnce(expected);
    const { phoneNumber } = requestMock.body;
    verifyOneTimePasswordMock.mockImplementation(() => {
      throw error;
    });
    const actual = await registerSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(errorResponseWithTwilioErrorHandlingMock).toBeCalledWith(
      responseMock,
      phoneNumber,
      error
    );
    expect(actual).toBe(expected);
  });
});
