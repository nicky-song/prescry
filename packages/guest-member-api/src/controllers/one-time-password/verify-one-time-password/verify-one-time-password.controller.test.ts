// Copyright 2020 Prescryptive Health, Inc.

import { VerifyOneTimePasswordController } from './verify-one-time-password.controller';
import { Request, Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';
import {
  getFirstOrDefault,
  sortMemberByPersonCode,
} from '../../../utils/person/person-helper';
import {
  KnownFailureResponse,
  errorResponseWithTwilioErrorHandling,
  SuccessResponse,
} from '../../../utils/response-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { buildTermsAndConditionsAcceptance } from '../../../utils/terms-and-conditions.helper';
import { generateDeviceToken } from '../../../utils/verify-device-helper';
import {
  memberRegistrationRequiredResponse,
  createPinResponse,
  phoneLoginSuccessResponse,
} from './verify-one-time-password-response.helper';
import { validateAutomationToken } from '../../../utils/validate-automation-token/validate-automation-token';
import { getIdentityVerificationAttemptsDataFromRedis } from '../../../databases/redis/redis-query-helper';
import { isTooManyIdentityVerificationAttempts } from '../../../middlewares/device-token.middleware';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import { validateOneTimePasswordV2 } from '../../../utils/request/validate-one-time-password.v2';
import { validateOneTimePassword } from '../../../utils/request/validate-one-time-password';
import { EndpointVersion } from '../../../models/endpoint-version';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithUnverifiedMock,
} from '../../../mock-data/patient-account.mock';
import { getPatientAccountByPhoneNumber } from '../../../utils/patient-account/get-patient-account-by-phone-number';
import {
  generateDeviceTokenV2,
  IGenerateDeviceTokenResponseV2,
} from '../../../utils/verify-device-helper-v2';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { publishTermsAndConditionsHealthRecordEvent } from '../../../utils/health-record-event/publish-terms-and-conditions-health-record-event';
import { updatePatientAccountTermsAndConditionsAcceptance } from '../../../utils/patient-account/update-patient-account-terms-and-conditions-acceptance';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { twilioMock } from '../../../mock-data/twilio.mock';

jest.mock('../../../utils/validate-automation-token/validate-automation-token');
const validateAutomationTokenMock = validateAutomationToken as jest.Mock;

jest.mock('../../../utils/service-bus/account-update-helper');
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;

jest.mock('../../../utils/response-helper');
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const errorResponseWithTwilioErrorHandlingMock =
  errorResponseWithTwilioErrorHandling as jest.Mock;
const SuccessResponseMock = SuccessResponse as jest.Mock;

jest.mock('../../../utils/verify-device-helper');
const generateDeviceTokenMock = generateDeviceToken as jest.Mock;

jest.mock('../../../utils/terms-and-conditions.helper');
const buildTermsAndConditionsAcceptanceMock =
  buildTermsAndConditionsAcceptance as jest.Mock;

jest.mock('../../../utils/person/get-logged-in-person.helper');
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;

jest.mock('../../../utils/person/person-helper');
const getFirstOrDefaultMock = getFirstOrDefault as jest.Mock;
const sortMemberByPersonCodeMock = sortMemberByPersonCode as jest.Mock;

jest.mock('./verify-one-time-password-response.helper');
const createPinResponseMock = createPinResponse as jest.Mock;
const memberRegistrationRequiredResponseMock =
  memberRegistrationRequiredResponse as jest.Mock;
const phoneLoginSuccessResponseMock = phoneLoginSuccessResponse as jest.Mock;

jest.mock('../../../databases/redis/redis-query-helper');
const getIdentityVerificationAttemptsDataFromRedisMock =
  getIdentityVerificationAttemptsDataFromRedis as jest.Mock;

jest.mock('../../../middlewares/device-token.middleware');
const isTooManyIdentityVerificationAttemptsMock =
  isTooManyIdentityVerificationAttempts as jest.Mock;

jest.mock('../../../utils/request/validate-one-time-password.v2');
const validateOneTimePasswordV2Mock = validateOneTimePasswordV2 as jest.Mock;

jest.mock('../../../utils/request/validate-one-time-password');
const validateOneTimePasswordMock = validateOneTimePassword as jest.Mock;

jest.mock('../../../utils/person/create-cash-profile-and-add-to-redis');
const createCashProfileAndAddToRedisMock =
  createCashProfileAndAddToRedis as jest.Mock;

jest.mock('../../../utils/patient-account/get-patient-account-by-phone-number');
const getPatientAccountByPhoneNumberMock =
  getPatientAccountByPhoneNumber as jest.Mock;

jest.mock('../../../utils/verify-device-helper-v2');
const generateDeviceTokenV2Mock = generateDeviceTokenV2 as jest.Mock;

jest.mock(
  '../../../utils/health-record-event/publish-terms-and-conditions-health-record-event'
);
const publishTermsAndConditionsHealthRecordEventMock =
  publishTermsAndConditionsHealthRecordEvent as jest.Mock;

jest.mock(
  '../../../utils/patient-account/update-patient-account-terms-and-conditions-acceptance'
);
const updatePatientAccountTermsAndConditionsAcceptanceMock =
  updatePatientAccountTermsAndConditionsAcceptance as jest.Mock;

describe('VerifyOneTimePasswordController -> ', () => {
  const primaryMemberRxIdMock = '1234567890';
  const firstNameMock = 'Johnny';
  const lastNameMock = 'Appleseed';
  const dateOfBirthMock = '01/01/2020';
  const phoneNumberMock = '111-222-3333';
  const responseMock = {} as Response;
  const bodyMock = {
    dateOfBirth: dateOfBirthMock,
    firstName: firstNameMock,
    lastName: lastNameMock,
    primaryMemberRxId: primaryMemberRxIdMock,
    phoneNumber: phoneNumberMock,
    code: '111111',
  };
  const requestMock = {
    app: { locals: { device: { data: '111-222-3333' } } },
    body: bodyMock,
    headers: {
      authorization: 'token',
    },
  } as unknown as Request;
  const personMock = {
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
    rxGroup: 'abc',
    rxBin: 'default',
    carrierPCN: 'default',
    rxGroupType: 'SIE',
  } as IPerson;
  const listOfPersonsMock: [IPerson] = [personMock];
  const termsAndConditionsAcceptanceMock = {
    hasAccepted: true,
    allowSmsMessages: true,
    allowEmailMessages: true,
    fromIP: '128.0.0.1',
    acceptedDateTime: '01/01/2020',
    browser: 'safari',
    authToken: 'mock-auth-token',
  } as ITermsAndConditionsWithAuthTokenAcceptance;

  const tokenMock = 'fake_automation_token';

  const v1: EndpointVersion = 'v1';
  const v2: EndpointVersion = 'v2';

  const requestV2Mock = {
    app: { locals: { device: { data: '111-222-3333' } } },
    body: bodyMock,
    headers: {
      authorization: 'token',
      [RequestHeaders.apiVersion]: v2,
    },
  } as unknown as Request;

  beforeEach(() => {
    jest.clearAllMocks();

    validateAutomationTokenMock.mockReturnValue(tokenMock);
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(2);
    isTooManyIdentityVerificationAttemptsMock.mockReturnValue(false);

    validateOneTimePasswordV2Mock.mockResolvedValue(undefined);
    validateOneTimePasswordMock.mockResolvedValue(undefined);

    getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);
    generateDeviceTokenV2Mock.mockResolvedValue(undefined);
    publishTermsAndConditionsHealthRecordEventMock.mockResolvedValue(undefined);
    updatePatientAccountTermsAndConditionsAcceptanceMock.mockResolvedValue(
      undefined
    );
  });

  it('constructs object of type "VerifyOneTimePasswordController"', () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    expect(
      controller instanceof VerifyOneTimePasswordController
    ).toBeTruthy();
    expect(controller.configuration).toEqual(configurationMock);
    expect(controller.twilioClient).toEqual(twilioMock);
    expect(controller.database).toEqual(databaseMock);
  }
  );

  it.each([[v1], [v2]])(
    'returns "KnownFailureResponse" response on OTP validation failure (version: %p)',
    async (versionMock: EndpointVersion) => {
      const controller = new VerifyOneTimePasswordController(
        configurationMock,
        twilioMock,
        databaseMock,
      );
      const mockRequest = versionMock === v1 ? requestMock : requestV2Mock;

      const knownFailureMock = 'known-failure';
      KnownFailureResponseMock.mockReturnValue(knownFailureMock);

      const errorMock = new BadRequestError('error');
      validateOneTimePasswordMock.mockImplementation(() => {
        throw errorMock;
      });
      validateOneTimePasswordV2Mock.mockImplementation(() => {
        throw errorMock;
      });

      const result = await controller.verifyOneTimePassword(
        mockRequest,
        responseMock
      );

      expect(result).toEqual(knownFailureMock);

      const { phoneNumber: expectedPhoneNumber, code: expectedCode } = bodyMock;

      if (versionMock === 'v2') {
        expectToHaveBeenCalledOnceOnlyWith(
          validateOneTimePasswordV2Mock,
          configurationMock,
          expectedPhoneNumber,
          expectedCode
        );
        expect(validateOneTimePasswordMock).not.toHaveBeenCalled();
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          validateOneTimePasswordMock,
          twilioMock,
          configurationMock.twilioVerificationServiceId,
          expectedPhoneNumber,
          expectedCode
        );
        expect(validateOneTimePasswordV2Mock).not.toHaveBeenCalled();
      }

      expect(KnownFailureResponseMock).toBeCalledWith(
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        errorMock.message,
        undefined,
        errorMock.internalCode
      );
    }
  );

  it('when "verifyOneTimePassword" returns approved status then generateDeviceToken, generateTermsAndConditionsAcceptances, getAllRecordsForLoggedInPerson & getFirstOrDefault are called', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    const { phoneNumber } = requestMock.body;
    generateDeviceTokenMock.mockReturnValue({
      account: 'mock-account-id',
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    getAllRecordsForLoggedInPersonMock.mockReturnValueOnce(listOfPersonsMock);
    getFirstOrDefaultMock.mockReturnValueOnce(personMock);

    await controller.verifyOneTimePassword(requestMock, responseMock);

    expect(generateDeviceTokenMock).toBeCalledWith(
      phoneNumber,
      controller.configuration,
      controller.database
    );
    expect(buildTermsAndConditionsAcceptanceMock).toBeCalledWith(
      requestMock,
      'mock-token'
    );
    expect(getAllRecordsForLoggedInPersonMock).toBeCalledWith(
      controller.database,
      phoneNumber
    );
    expect(getFirstOrDefaultMock).toBeCalledWith(
      listOfPersonsMock,
      sortMemberByPersonCodeMock
    );
    expect(createCashProfileAndAddToRedisMock).toHaveBeenCalledWith(
      databaseMock,
      configurationMock,
      'Johnny',
      'Appleseed',
      '01/01/2020',
      phoneNumber
    );
  });

  it('gets patient account by phone number (v2)', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    await controller.verifyOneTimePassword(requestV2Mock, responseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      getPatientAccountByPhoneNumberMock,
      configurationMock,
      bodyMock.phoneNumber
    );
  });

  it('generates device token (v2)', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    getPatientAccountByPhoneNumberMock.mockResolvedValue(
      patientAccountPrimaryMock
    );

    await controller.verifyOneTimePassword(requestV2Mock, responseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      generateDeviceTokenV2Mock,
      bodyMock.phoneNumber,
      configurationMock,
      patientAccountPrimaryMock
    );
  });

  it.each([[undefined], [patientAccountPrimaryMock]])(
    'updates terms and conditions acceptance if patient account exists (patientAccount: %p) (v2)',
    async (patientAccountMock: undefined | IPatientAccount) => {
      const controller = new VerifyOneTimePasswordController(
        configurationMock,
        twilioMock,
        databaseMock,
      );

      getPatientAccountByPhoneNumberMock.mockResolvedValue(patientAccountMock);

      const v2TokenMock = 'v2-token';
      const tokenResponseMock: Partial<IGenerateDeviceTokenResponseV2> = {
        token: v2TokenMock,
      };
      generateDeviceTokenV2Mock.mockResolvedValue(tokenResponseMock);

      buildTermsAndConditionsAcceptanceMock.mockReturnValue(
        termsAndConditionsAcceptanceMock
      );

      await controller.verifyOneTimePassword(requestV2Mock, responseMock);

      expectToHaveBeenCalledOnceOnlyWith(
        buildTermsAndConditionsAcceptanceMock,
        requestV2Mock,
        v2TokenMock
      );

      if (patientAccountMock) {
        expectToHaveBeenCalledOnceOnlyWith(
          updatePatientAccountTermsAndConditionsAcceptanceMock,
          configurationMock,
          patientAccountMock,
          termsAndConditionsAcceptanceMock
        );
      } else {
        expect(
          updatePatientAccountTermsAndConditionsAcceptanceMock
        ).not.toHaveBeenCalled();
      }
    }
  );

  it('publishes health record event for terms and conditions if no patient account  (v2)', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);

    const v2TokenMock = 'v2-token';
    const tokenResponseMock: Partial<IGenerateDeviceTokenResponseV2> = {
      token: v2TokenMock,
    };
    generateDeviceTokenV2Mock.mockResolvedValue(tokenResponseMock);

    const resultMock = 'result';
    memberRegistrationRequiredResponseMock.mockReturnValue(resultMock);

    buildTermsAndConditionsAcceptanceMock.mockReturnValue(
      termsAndConditionsAcceptanceMock
    );

    await controller.verifyOneTimePassword(requestV2Mock, responseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      publishTermsAndConditionsHealthRecordEventMock,
      termsAndConditionsAcceptanceMock,
      bodyMock.phoneNumber
    );

    expectToHaveBeenCalledOnceOnlyWith(
      buildTermsAndConditionsAcceptanceMock,
      requestV2Mock,
      v2TokenMock
    );
  });

  const patientAccountWithNoStatusMock: IPatientAccount = {
    ...patientAccountPrimaryWithUnverifiedMock,
    status: undefined,
  };

  it.each([
    [undefined],
    [patientAccountPrimaryWithUnverifiedMock],
    [patientAccountWithNoStatusMock],
  ])(
    'returns member registration required if no patient account or account is not verified (account: %p)  (v2)',
    async (patientAccountMock: IPatientAccount | undefined) => {
      const controller = new VerifyOneTimePasswordController(
        configurationMock,
        twilioMock,
        databaseMock,
      );

      getPatientAccountByPhoneNumberMock.mockResolvedValue(patientAccountMock);

      const v2TokenMock = 'v2-token';
      const tokenResponseMock: Partial<IGenerateDeviceTokenResponseV2> = {
        token: v2TokenMock,
      };
      generateDeviceTokenV2Mock.mockResolvedValue(tokenResponseMock);

      const resultMock = 'result';
      memberRegistrationRequiredResponseMock.mockReturnValue(resultMock);

      buildTermsAndConditionsAcceptanceMock.mockReturnValue(
        termsAndConditionsAcceptanceMock
      );

      const result = await controller.verifyOneTimePassword(
        requestV2Mock,
        responseMock
      );

      expect(result).toEqual(resultMock);

      expectToHaveBeenCalledOnceOnlyWith(
        memberRegistrationRequiredResponseMock,
        bodyMock.phoneNumber,
        termsAndConditionsAcceptanceMock,
        v2TokenMock,
        responseMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildTermsAndConditionsAcceptanceMock,
        requestV2Mock,
        v2TokenMock
      );
    }
  );

  it('does not create CASH profile if it already exists', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    const { phoneNumber } = requestMock.body;
    generateDeviceTokenMock.mockReturnValue({
      account: 'mock-account-id',
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    const cashPersonMock = { ...personMock, rxGroupType: 'CASH' };
    getAllRecordsForLoggedInPersonMock.mockReturnValueOnce([cashPersonMock]);
    getFirstOrDefaultMock.mockReturnValueOnce(cashPersonMock);
    await controller.verifyOneTimePassword(requestMock, responseMock);
    expect(generateDeviceTokenMock).toBeCalledWith(
      phoneNumber,
      controller.configuration,
      controller.database
    );
    expect(buildTermsAndConditionsAcceptanceMock).toBeCalledWith(
      requestMock,
      'mock-token'
    );
    expect(getAllRecordsForLoggedInPersonMock).toBeCalledWith(
      controller.database,
      phoneNumber
    );
    expect(getFirstOrDefaultMock).toBeCalledWith(
      [cashPersonMock],
      sortMemberByPersonCodeMock
    );
    expect(createCashProfileAndAddToRedisMock).not.toHaveBeenCalled();
  });

  it('when "generateDeviceToken" returns a null for account or has missing date of Birth details then "createPinResponse" is called', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    const { phoneNumber } = requestMock.body;
    generateDeviceTokenMock.mockReturnValue({
      account: null,
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    getFirstOrDefaultMock.mockReturnValueOnce(personMock);
    buildTermsAndConditionsAcceptanceMock.mockReturnValue(
      termsAndConditionsAcceptanceMock
    );
    await controller.verifyOneTimePassword(requestMock, responseMock);
    expect(createPinResponseMock).toBeCalledWith(
      phoneNumber,
      termsAndConditionsAcceptanceMock,
      'mock-token',
      personMock,
      responseMock,
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
  });

  it('when "generateDeviceToken" returns a null for account or has missing date of birth details and when "getFirstOrDefault" returns undefined then "memberRegistrationRequiredResponse" is called and returned', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    const { phoneNumber } = requestMock.body;
    generateDeviceTokenMock.mockReturnValue({
      account: null,
      accountKey: 'mock-account-key',
      token: 'mock-token',
    });
    getFirstOrDefaultMock.mockReturnValue(undefined);
    buildTermsAndConditionsAcceptanceMock.mockReturnValue(
      termsAndConditionsAcceptanceMock
    );

    const registrationRequiredResponseMock: Partial<Response> = {
      statusCode: 1,
    };
    memberRegistrationRequiredResponseMock.mockReturnValue(
      registrationRequiredResponseMock
    );

    const result = await controller.verifyOneTimePassword(
      requestMock,
      responseMock
    );

    expect(result).toEqual(registrationRequiredResponseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      memberRegistrationRequiredResponseMock,
      phoneNumber,
      termsAndConditionsAcceptanceMock,
      'mock-token',
      responseMock
    );
  });

  it('when "generateDeviceToken" returns an account with a date of birth then "publishAccountUpdateMessage" is called and "phoneLoginSuccessResponse" is returned', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    const { phoneNumber } = requestMock.body;
    generateDeviceTokenMock.mockReturnValue({
      account: { dateOfBirth: dateOfBirthMock },
      accountKey: 'mock-account-key',
      token: 'mock-token',
      recoveryEmailExists: false,
    });
    getFirstOrDefaultMock.mockReturnValueOnce(personMock);
    buildTermsAndConditionsAcceptanceMock.mockReturnValue(
      termsAndConditionsAcceptanceMock
    );
    phoneLoginSuccessResponseMock.mockReturnValue({
      status: 'return from phone login success',
    });

    await controller.verifyOneTimePassword(requestMock, responseMock);
    expect(publishAccountUpdateMessageMock).toBeCalledWith({
      phoneNumber,
      termsAndConditionsAcceptances: termsAndConditionsAcceptanceMock,
    });
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      phoneNumber
    );
    expect(isTooManyIdentityVerificationAttemptsMock).toBeCalled();
    expect(phoneLoginSuccessResponseMock).toBeCalledWith(
      'mock-account-key',
      'mock-token',
      responseMock,
      false
    );
  });

  it('when "generateDeviceToken" returns an account with a date of birth then "publishAccountUpdateMessage" is called and "AccountLockedScreen" is returned if account is locked', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    const { phoneNumber } = requestMock.body;
    generateDeviceTokenMock.mockReturnValue({
      account: { dateOfBirth: dateOfBirthMock },
      accountKey: 'mock-account-key',
      token: 'mock-token',
      recoveryEmailExists: false,
    });
    getFirstOrDefaultMock.mockReturnValue(personMock);
    buildTermsAndConditionsAcceptanceMock.mockReturnValue(
      termsAndConditionsAcceptanceMock
    );
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(5);
    isTooManyIdentityVerificationAttemptsMock.mockReturnValue(true);

    await controller.verifyOneTimePassword(requestMock, responseMock);
    expect(publishAccountUpdateMessageMock).toBeCalledWith({
      phoneNumber,
      termsAndConditionsAcceptances: termsAndConditionsAcceptanceMock,
    });
    expect(phoneLoginSuccessResponseMock).not.toBeCalled();
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      phoneNumber
    );
    expect(isTooManyIdentityVerificationAttemptsMock).toBeCalled();
    expect(SuccessResponseMock).toBeCalledWith(
      responseMock,
      'SHOW_ACCOUNT_LOCKED',
      { deviceToken: 'mock-token', recoveryEmailExists: false },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.SHOW_ACCOUNT_LOCKED
    );
  });

  it('should call errorResponseWithTwilioErrorHandling when any other exception occurs', async () => {
    const controller = new VerifyOneTimePasswordController(
      configurationMock,
      twilioMock,
      databaseMock,
    );

    const error = {
      message: 'internal error',
      code: '111111',
      status: 'failed',
    };
    const expected = {};
    errorResponseWithTwilioErrorHandlingMock.mockReturnValueOnce(expected);
    const { phoneNumber } = requestMock.body;
    validateOneTimePasswordMock.mockImplementation(() => {
      throw error;
    });
    const actual = await controller.verifyOneTimePassword(
      requestMock,
      responseMock
    );
    expect(errorResponseWithTwilioErrorHandlingMock).toHaveBeenCalledWith(
      responseMock,
      phoneNumber,
      error
    );
    expect(actual).toBe(expected);
  });

  it('should return token when token is successfully sent to the validateAutomationToken', () => {
    requestMock.headers = {
      'x-prescryptive-automation-token': tokenMock,
    };
    validateAutomationTokenMock.mockReset();
    validateAutomationTokenMock.mockReturnValue(tokenMock);

    const validateAutomation = validateAutomationTokenMock(
      requestMock,
      responseMock,
      configurationMock,
      phoneNumberMock
    );
    expect(validateAutomation).toEqual(tokenMock);
  });
});
