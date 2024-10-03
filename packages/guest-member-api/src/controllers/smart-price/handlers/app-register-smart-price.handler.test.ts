// Copyright 2021 Prescryptive Health, Inc.

import { ISmartPriceRegistration } from './register-smart-price.handler';
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
import { getNext } from '../../../utils/redis/redis-order-number.helper';
import { appRegisterSmartPriceHandler } from './app-register-smart-price.handler';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { buildSmartPriceRegistration } from '../helpers/build-smart-price-registration';
import { publishPersonCreateMessage } from '../../../utils/service-bus/person-update-helper';
import { publishBrokerReferralEvent } from '../helpers/publish-broker-referral-event';
import sgMail from '@sendgrid/mail';
import { ApiConstants } from '../../../constants/api-constants';

jest.mock('../../../utils/twilio-helper', () => ({
  verifyOneTimePassword: jest.fn(),
}));

jest.mock('../../../utils/service-bus/account-update-helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../../constants/response-messages');
jest.mock('../../../utils/verify-device-helper');
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
const successResponseMock = SuccessResponse as jest.Mock;
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const searchPersonByPhoneNumberMock = searchPersonByPhoneNumber as jest.Mock;
const getNextMock = getNext as jest.Mock;
const buildSmartPriceRegistrationMock =
  buildSmartPriceRegistration as jest.Mock;
const publishPersonCreateMessageMock = publishPersonCreateMessage as jest.Mock;
const publishBrokerReferralEventMock = publishBrokerReferralEvent as jest.Mock;

const primaryMemeberRxIdMock = '1234567890';
const firstNameMock = 'Johnny';
const lastNameMock = 'Appleseed';
const dateOfBirthMock = '01/01/2020';
const phoneNumberMock = '111-222-3333';
const emailMock = 'email@test.com';
const responseMock = {
  locals: {
    device: {
      data: '111-222-3333',
    },
  },
} as unknown as Response;
const registrationMock = {
  firstName: firstNameMock,
  lastName: lastNameMock,
  dateOfBirth: dateOfBirthMock,
  phoneNumber: phoneNumberMock,
  email: emailMock,
  source: 'source',
} as ISmartPriceRegistration;
const registrationNoSourceMock = {
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
    primaryMemberRxId: primaryMemeberRxIdMock,
    primaryMemberFamilyId: 'SM12345',
    isPrimary: true,
    email: 'johnny@appleseed.com',
    primaryMemberPersonCode: '01',
    rxGroup: '200P32F',
    rxSubGroup: 'SMARTPRICE',
    rxGroupType: 'CASH',
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
    primaryMemberRxId: primaryMemeberRxIdMock,
    primaryMemberFamilyId: 'SM12345',
    isPrimary: true,
    email: 'johnny@appleseed.com',
    primaryMemberPersonCode: '01',
    rxGroup: '200P32F',
    rxSubGroup: 'SMARTPRICE',
    rxGroupType: 'SIE',
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
    rxGroupType: 'CASH',
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
    primaryMemberRxId: primaryMemeberRxIdMock,
    primaryMemberFamilyId: 'SM12345',
    isPrimary: true,
    email: 'johnny@appleseed.com',
    primaryMemberPersonCode: '01',
    rxGroup: '200P32F',
    rxSubGroup: 'SMARTPRICE',
    rxGroupType: 'CASH',
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
  primaryMemberRxId: primaryMemeberRxIdMock,
  primaryMemberFamilyId: 'SM12346',
  isPrimary: true,
  email: 'johnny@appleseed.com',
  primaryMemberPersonCode: '01',
  rxGroup: '200P32F',
  rxSubGroup: 'SMARTPRICE',
  rxGroupType: 'CASH',
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
  primaryMemberRxId: primaryMemeberRxIdMock,
  primaryMemberFamilyId: 'SM12346',
  isPrimary: true,
  email: 'johnny@appleseed.com',
  primaryMemberPersonCode: '01',
  rxGroup: '200P32F',
  rxSubGroup: 'SMARTPRICE',
  rxGroupType: 'CASH',
  rxBin: '610749',
  carrierPCN: 'X01',
};

beforeEach(() => {
  jest.clearAllMocks();
  buildSmartPriceRegistrationMock.mockReturnValue(smartPriceRegistration);
});

describe('appRegisterSmartPriceHandler', () => {
  it('calls twilio message create after searchPersonByPhoneNumber is called', async () => {
    const phoneNumber = responseMock.locals.device.data;
    getNextMock.mockReturnValueOnce('5');
    searchPersonByPhoneNumberMock.mockReturnValue(listOfPersonsMock);
    await appRegisterSmartPriceHandler(
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
    searchPersonByPhoneNumberMock.mockReturnValue(listOfPersonsMock);
    getNextMock.mockReturnValueOnce('5');
    await appRegisterSmartPriceHandler(
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
    const phoneNumber = responseMock.locals.device.data;
    getNextMock.mockReturnValueOnce('5');
    searchPersonByPhoneNumberMock.mockReturnValue(listOfSIEPersonsMock);
    await appRegisterSmartPriceHandler(
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
    expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.SMARTPRICE_NOT_ELIGIBLE
    );
  });
  it('should create new person for SmartPRICE if CASH profile does not exists and publish referral event if source exists', async () => {
    const phoneNumber = responseMock.locals.device.data;
    getNextMock.mockReturnValueOnce('5');
    searchPersonByPhoneNumberMock.mockReturnValue([]);

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
    await appRegisterSmartPriceHandler(
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
    const phoneNumber = responseMock.locals.device.data;
    getNextMock.mockReturnValueOnce('5');
    searchPersonByPhoneNumberMock.mockReturnValue(listOfCashPersonMocks);

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
    await appRegisterSmartPriceHandler(
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
    const phoneNumber = responseMock.locals.device.data;

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
    await appRegisterSmartPriceHandler(
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
    const phoneNumber = responseMock.locals.device.data;
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
    await appRegisterSmartPriceHandler(
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
    const phoneNumber = responseMock.locals.device.data;
    getNextMock.mockReturnValueOnce('5');
    searchPersonByPhoneNumberMock.mockReturnValue(listOfPersonsWithBrokerMock);
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
    await appRegisterSmartPriceHandler(
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
  });

  it('should call KnownFailureResponse when no device token provided', async () => {
    const emptyDataResponseMock = {
      locals: {
        device: {},
      },
    } as unknown as Response;
    await appRegisterSmartPriceHandler(
      requestMock,
      emptyDataResponseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      emptyDataResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.DEVICE_NOT_VERIFIED
    );
  });

  it('should call errorResponseWithTwilioErrorHandling when any other exception occurs', async () => {
    const error = {
      message: 'internal error',
      code: '111111',
      status: 'failed',
    };

    const { phoneNumber } = requestMock.body;
    searchPersonByPhoneNumberMock.mockImplementation(() => {
      throw error;
    });
    const expected = {};
    errorResponseWithTwilioErrorHandlingMock.mockReturnValueOnce(expected);
    const actual = await appRegisterSmartPriceHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioClientMock
    );
    expect(errorResponseWithTwilioErrorHandlingMock).toHaveBeenCalledWith(
      responseMock,
      phoneNumber,
      error
    );
    expect(actual).toBe(expected);
  });
});
