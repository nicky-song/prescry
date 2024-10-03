// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IAccount } from '@phx/common/src/models/account';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { TwilioErrorMessage } from '../../../constants/response-messages';
import { ErrorConstants } from '../../../constants/response-messages';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
  validatePhoneNumberErrorType,
} from '../../../utils/response-helper';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { deleteKeysInRedis } from '../../../utils/redis/redis.helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { createDeviceToken } from '../../../utils/verify-device-helper';
import { resetPinFailureResponse } from '../helpers/reset-pin-failure-response.helper';
import { pinResetHandler } from './pin-reset.handler';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { validateOneTimePasswordV2 } from '../../../utils/request/validate-one-time-password.v2';
import { databaseMock } from '../../../mock-data/database.mock';
import { twilioMock } from '../../../mock-data/twilio.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getPreferredEmailFromPatient } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../../../mock-data/patient-account.mock';
import { IAppLocals } from '../../../models/app-locals';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { IResetPinRequestBody } from '@phx/common/src/models/api-request-body/reset-pin.request-body';
import { maskPhoneNumber, maskEmail } from '../helpers/mask-values.helper';
import { validateOneTimePassword } from '../../../utils/request/validate-one-time-password';
import { VerificationTypesEnum } from '@phx/common/src/models/api-request-body/send-verification-code.request-body';
import { InternalServerRequestError } from '../../../errors/request-errors/internal-server.request-error';
import { clearPatientAccountPin } from '../../../utils/patient-account/clear-patient-account-pin';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const validatePhoneNumberErrorTypeMock =
  validatePhoneNumberErrorType as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

jest.mock('../../../utils/redis/redis.helper');
const deleteKeysInRedisMock = deleteKeysInRedis as jest.Mock;

jest.mock('../../../utils/service-bus/account-update-helper');
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;

jest.mock('../../../utils/verify-device-helper');
const createDeviceTokenMock = createDeviceToken as jest.Mock;

jest.mock('../helpers/reset-pin-failure-response.helper');
const resetPinFailureResponseMock = resetPinFailureResponse as jest.Mock;

jest.mock('../../../utils/request/validate-one-time-password');
const validateOneTimePasswordMock = validateOneTimePassword as jest.Mock;

jest.mock('../../../utils/request/validate-one-time-password.v2');
const validateOneTimePasswordV2Mock = validateOneTimePasswordV2 as jest.Mock;

jest.mock('../../../utils/fhir-patient/get-contact-info-from-patient');
const getPreferredEmailFromPatientMock =
  getPreferredEmailFromPatient as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../../../utils/patient-account/clear-patient-account-pin');
const clearPatientAccountPinMock = clearPatientAccountPin as jest.Mock;

jest.mock('../../../assertions/assert-has-patient-account');
const assertHasPatientAccountMock = assertHasPatientAccount as jest.Mock;

describe('pinResetHandler', () => {
  const localsPhoneMock = 'locals-phone-mock';
  const emailMock = 'email';

  const accountMock = {
    phoneNumber: 'mock-phone',
    recoveryEmail: 'mock-email@test.com',
  } as IAccount;

  const responseMock = { locals: {} } as Response;
  const requestMock = {
    body: {
      maskedValue: '',
    } as IResetPinRequestBody,
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();

    validateOneTimePasswordMock.mockResolvedValue({ status: 'approved' });
    validateOneTimePasswordV2Mock.mockResolvedValue(undefined);

    searchAccountByPhoneNumberMock.mockResolvedValue(accountMock);
    createDeviceTokenMock.mockResolvedValue('token');

    resetPinFailureResponseMock.mockResolvedValue(undefined);

    getRequiredResponseLocalMock.mockReturnValue({ data: localsPhoneMock });
    validatePhoneNumberErrorTypeMock.mockReturnValue({});

    clearPatientAccountPinMock.mockResolvedValue(undefined);
  });

  it('requests device from locals', async () => {
    await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getRequiredResponseLocalMock,
      responseMock,
      'device'
    );
  });

  it('returns error if no email in patient record (v2)', async () => {
    const responseWithPatientAccountMock = {
      ...responseMock,
      locals: {
        patientAccount: patientAccountPrimaryWithPatientMock,
      } as IAppLocals,
    } as unknown as Response;

    getPreferredEmailFromPatientMock.mockReturnValue(undefined);

    const knownFailureMock = 'failure';
    knownFailureResponseMock.mockReturnValue(knownFailureMock);
    const requestV2Mock = {
      ...requestMock,
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const actual = await pinResetHandler(
      requestV2Mock,
      responseWithPatientAccountMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getPreferredEmailFromPatientMock,
      patientAccountPrimaryWithPatientMock.patient
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseWithPatientAccountMock,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ErrorConstants.RECOVERY_EMAIL_MISSING,
      undefined,
      undefined
    );

    expect(actual).toEqual(knownFailureMock);
  });

  it('returns error if no account found for the phone number', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        code: '123456',
        maskedValue: 't**r@test.com',
      },
    } as Request;

    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);

    const expected = 'known-failure';
    knownFailureResponseMock.mockReturnValue(expected);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toEqual(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      localsPhoneMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PHONE_NUMBER_MISSING,
      undefined,
      undefined
    );

    expect(validateOneTimePasswordMock).not.toBeCalled();
    expect(deleteKeysInRedisMock).not.toBeCalled();
    expect(publishAccountUpdateMessageMock).not.toBeCalled();
    expect(createDeviceTokenMock).not.toBeCalled();
  });

  it('returns error if account found for phone number but it has no recovery email', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        code: '123456',
        maskedValue: 't*****r@test.com',
      },
    } as Request;

    const noRecoveryEmailAccountMock = {
      phoneNumber: 'mock-phone',
    } as IAccount;
    searchAccountByPhoneNumberMock.mockResolvedValue(
      noRecoveryEmailAccountMock
    );
    const expected = 'known-failure';
    knownFailureResponseMock.mockReturnValue(expected);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(expected).toBe(actual);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      localsPhoneMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.RECOVERY_EMAIL_MISSING,
      undefined,
      undefined
    );

    expect(validateOneTimePasswordMock).not.toBeCalled();
    expect(deleteKeysInRedisMock).not.toBeCalled();
    expect(publishAccountUpdateMessageMock).not.toBeCalled();
    expect(createDeviceTokenMock).not.toBeCalled();
  });

  it('returns resetPinFailureResponse if verification type is email and maskedValue is wrong (v1)', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        code: '123456',
        maskedValue: 't*****t@test.com',
      },
    } as Request;

    const resetPinFailureMock = 'reset-pin-failure';
    resetPinFailureResponseMock.mockResolvedValue(resetPinFailureMock);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toEqual(resetPinFailureMock);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      localsPhoneMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      resetPinFailureResponseMock,
      responseMock,
      localsPhoneMock,
      configurationMock
    );
    expect(validateOneTimePasswordMock).not.toBeCalled();
    expect(deleteKeysInRedisMock).not.toBeCalled();
    expect(publishAccountUpdateMessageMock).not.toBeCalled();
    expect(createDeviceTokenMock).not.toBeCalled();
  });

  it('returns resetPinFailureResponse if verification type is email and maskedValue is wrong (v2)', async () => {
    getPreferredEmailFromPatientMock.mockReturnValue('preferred-email');

    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        code: 'code',
        maskedValue: '',
      } as IResetPinRequestBody,
    } as Request;

    const resetPinFailureMock = 'reset-pin-failure';
    resetPinFailureResponseMock.mockResolvedValue(resetPinFailureMock);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      resetPinFailureResponseMock,
      responseMock,
      localsPhoneMock,
      configurationMock
    );

    expect(actual).toEqual(resetPinFailureMock);
  });

  it('returns resetPinFailureResponse if verification type is phone and maskedValue is wrong (v1)', async () => {
    const requestMock = {
      body: {
        verificationType: 'PHONE',
        code: '123456',
        maskedValue: '(XX)',
      },
    } as Request;

    const resetPinFailureMock = 'reset-pin-failure';
    resetPinFailureResponseMock.mockResolvedValue(resetPinFailureMock);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toEqual(resetPinFailureMock);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      localsPhoneMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      resetPinFailureResponseMock,
      responseMock,
      localsPhoneMock,
      configurationMock
    );
    expect(validateOneTimePasswordMock).not.toBeCalled();
    expect(deleteKeysInRedisMock).not.toBeCalled();
    expect(publishAccountUpdateMessageMock).not.toBeCalled();
    expect(createDeviceTokenMock).not.toBeCalled();
  });

  it('returns resetPinFailureResponse if verification type is phone and maskedValue is wrong (v2)', async () => {
    getRequiredResponseLocalMock.mockReturnValue({ data: localsPhoneMock });
    getPreferredEmailFromPatientMock.mockReturnValue('preferred-email');

    const requestMock = {
      body: {
        verificationType: 'PHONE',
        code: '123456',
        maskedValue: '',
      },
    } as Request;

    const resetPinFailureMock = 'reset-pin-failure';
    resetPinFailureResponseMock.mockResolvedValue(resetPinFailureMock);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      resetPinFailureResponseMock,
      responseMock,
      localsPhoneMock,
      configurationMock
    );

    expect(actual).toEqual(resetPinFailureMock);
  });

  it.each([
    [VerificationTypesEnum.EMAIL, emailMock],
    [VerificationTypesEnum.PHONE, localsPhoneMock],
  ])(
    'validates one-time password by %p (v2)',
    async (
      verificationTypeMock: VerificationTypesEnum,
      expectedEntity: string
    ) => {
      const codeMock = 'code';
      const requestWithTypeMock = {
        ...requestMock,
        body: {
          ...requestMock.body,
          verificationType: verificationTypeMock,
          code: codeMock,
          maskedValue:
            verificationTypeMock === 'EMAIL'
              ? maskEmail(expectedEntity)
              : maskPhoneNumber(expectedEntity),
        } as IResetPinRequestBody,
        headers: {
          [RequestHeaders.apiVersion]: 'v2',
        },
      } as Request;

      getPreferredEmailFromPatientMock.mockReturnValue(emailMock);

      await pinResetHandler(
        requestWithTypeMock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      expectToHaveBeenCalledOnceOnlyWith(
        validateOneTimePasswordV2Mock,
        configurationMock,
        expectedEntity,
        codeMock
      );
    }
  );

  it('returns reset pin failure response if OTP validation fails with request error (v2)', async () => {
    getPreferredEmailFromPatientMock.mockReturnValue(emailMock);

    validateOneTimePasswordV2Mock.mockImplementation(() => {
      throw new InternalServerRequestError('request-error');
    });

    const resetPinFailureMock = 'reset-pin-failure';
    resetPinFailureResponseMock.mockResolvedValue(resetPinFailureMock);

    const result = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      resetPinFailureResponseMock,
      responseMock,
      localsPhoneMock,
      configurationMock
    );

    expect(result).toEqual(resetPinFailureMock);
  });

  it('returns unknown failure if OTP validation fails with unexpected error (v2)', async () => {
    getPreferredEmailFromPatientMock.mockReturnValue(emailMock);

    const requestByEmailMock = {
      ...requestMock,
      body: {
        verificationType: 'EMAIL',
        maskedValue: maskEmail(emailMock),
      } as IResetPinRequestBody,
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const errorMock = new Error('error');
    validateOneTimePasswordV2Mock.mockImplementation(() => {
      throw errorMock;
    });

    const unknownFailureMock = 'unknown-failure';
    unknownFailureResponseMock.mockReturnValue(unknownFailureMock);

    const result = await pinResetHandler(
      requestByEmailMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      unknownFailureResponseMock,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );

    expect(result).toEqual(unknownFailureMock);
  });

  it('calls verifyOneTimePassword if verification type is email', async () => {
    const requestMock = {
      body: {
        verificationType: 'EMAIL',
        code: '123456',
        maskedValue: 'm*****l@test.com',
      },
    } as Request;

    const expected = 'success';
    successResponseMock.mockReturnValue(expected);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toEqual(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      localsPhoneMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      validateOneTimePasswordMock,
      twilioMock,
      configurationMock.twilioEmailVerificationServiceId,
      'mock-email@test.com',
      '123456'
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      'User needs to create PIN',
      { deviceToken: 'token' },
      undefined,
      undefined,
      undefined,
      2001
    );
    expectToHaveBeenCalledOnceOnlyWith(
      deleteKeysInRedisMock,
      `*:${localsPhoneMock}*`
    );
    expectToHaveBeenCalledOnceOnlyWith(publishAccountUpdateMessageMock, {
      accountKey: '',
      pinHash: '',
      phoneNumber: localsPhoneMock,
      recentlyUpdated: true,
    });
    expectToHaveBeenCalledOnceOnlyWith(
      createDeviceTokenMock,
      localsPhoneMock,
      configurationMock
    );
  });

  it('calls verifyOneTimePassword if verification type is phone', async () => {
    const requestMock = {
      body: {
        verificationType: 'PHONE',
        code: '123456',
        maskedValue: maskPhoneNumber(localsPhoneMock),
      },
    } as Request;

    const expected = 'success';
    successResponseMock.mockReturnValue(expected);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toEqual(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      localsPhoneMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      validateOneTimePasswordMock,
      twilioMock,
      configurationMock.twilioVerificationServiceId,
      localsPhoneMock,
      '123456'
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      'User needs to create PIN',
      { deviceToken: 'token' },
      undefined,
      undefined,
      undefined,
      2001
    );
    expectToHaveBeenCalledOnceOnlyWith(
      deleteKeysInRedisMock,
      `*:${localsPhoneMock}*`
    );
    expectToHaveBeenCalledOnceOnlyWith(publishAccountUpdateMessageMock, {
      accountKey: '',
      pinHash: '',
      phoneNumber: localsPhoneMock,
      recentlyUpdated: true,
    });
    expectToHaveBeenCalledOnceOnlyWith(
      createDeviceTokenMock,
      localsPhoneMock,
      configurationMock
    );
  });

  it('returns KnownFailureResponse for known twilio failure responses', async () => {
    const error = {
      code: 60200,
      detail: undefined,
      message: 'Unable to send verification code to the provided Number',
      moreInfo: 'https://www.twilio.com/docs/errors/60200',
      status: HttpStatusCodes.BAD_REQUEST,
    };
    validateOneTimePasswordMock.mockRejectedValue(error);

    validatePhoneNumberErrorTypeMock.mockReturnValue({
      isKnownError: true,
      message: TwilioErrorMessage.UNABLE_TO_SEND_CODE,
      type: 'Twilio',
    });

    const requestMock = {
      body: {
        verificationType: 'PHONE',
        code: '123456',
        maskedValue: maskPhoneNumber(localsPhoneMock),
      },
    } as Request;

    const expected = 'known-failure';
    knownFailureResponseMock.mockReturnValue(expected);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toEqual(expected);

    expect(searchAccountByPhoneNumberMock).toBeCalledTimes(1);

    expectToHaveBeenCalledOnceOnlyWith(
      validatePhoneNumberErrorTypeMock,
      HttpStatusCodes.BAD_REQUEST,
      60200,
      localsPhoneMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      TwilioErrorMessage.UNABLE_TO_SEND_CODE,
      error,
      60200
    );
    expect(deleteKeysInRedisMock).not.toBeCalled();
    expect(publishAccountUpdateMessageMock).not.toBeCalled();
    expect(createDeviceTokenMock).not.toBeCalled();
  });

  it('returns KnownFailureResponse for twilio max attempt failure responses', async () => {
    const error = {
      code: 60203,
      detail: undefined,
      message: 'Max send attempts reached',
      moreInfo: 'https://www.twilio.com/docs/errors/60203',
      status: HttpStatusCodes.TOO_MANY_REQUESTS,
    };
    validateOneTimePasswordMock.mockRejectedValue(error);

    validatePhoneNumberErrorTypeMock.mockReturnValue({
      isKnownError: true,
      message: TwilioErrorMessage.TOO_MANY_TIMES,
      type: 'Twilio',
    });

    const requestMock = {
      body: {
        verificationType: 'PHONE',
        code: '123456',
        maskedValue: maskPhoneNumber(localsPhoneMock),
      },
    } as Request;

    const expected = 'reset-pin-failure';
    resetPinFailureResponseMock.mockResolvedValue(expected);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toEqual(expected);

    expect(searchAccountByPhoneNumberMock).toBeCalledTimes(1);

    expectToHaveBeenCalledOnceOnlyWith(
      validatePhoneNumberErrorTypeMock,
      HttpStatusCodes.TOO_MANY_REQUESTS,
      60203,
      localsPhoneMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      resetPinFailureResponseMock,
      responseMock,
      localsPhoneMock,
      configurationMock
    );
    expect(deleteKeysInRedisMock).not.toBeCalled();
    expect(publishAccountUpdateMessageMock).not.toBeCalled();
    expect(createDeviceTokenMock).not.toBeCalled();
  });

  it('asserts patientAccount exists in locals', async () => {
    getPreferredEmailFromPatientMock.mockReturnValue(emailMock);
    const requestByEmailMock = {
      ...requestMock,
      body: {
        verificationType: 'EMAIL',
        maskedValue: maskEmail(emailMock),
      } as IResetPinRequestBody,
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const patientAccountMock = patientAccountPrimaryMock;
    const responseWithoutPatientAccountMock = {
      ...responseMock,
      locals: {
        patientAccount: patientAccountMock,
      } as IAppLocals,
    } as unknown as Response;

    await pinResetHandler(
      requestByEmailMock,
      responseWithoutPatientAccountMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasPatientAccountMock,
      patientAccountMock
    );
  });

  it('resets patient account pin (v2)', async () => {
    getPreferredEmailFromPatientMock.mockReturnValue(emailMock);
    const requestByEmailMock = {
      ...requestMock,
      body: {
        verificationType: 'EMAIL',
        maskedValue: maskEmail(emailMock),
      } as IResetPinRequestBody,
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const knownFailureMock = 'known-failure';
    knownFailureResponseMock.mockReturnValue(knownFailureMock);

    const responseWithoutPatientAccountMock = {
      ...responseMock,
      locals: {
        patientAccount: patientAccountPrimaryWithPatientMock,
      } as IAppLocals,
    } as unknown as Response;

    await pinResetHandler(
      requestByEmailMock,
      responseWithoutPatientAccountMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      clearPatientAccountPinMock,
      configurationMock,
      patientAccountPrimaryWithPatientMock
    );
  });

  it('returns error from resetPinHandler if any exception occurs', async () => {
    const error = { message: 'internal error' };
    searchAccountByPhoneNumberMock.mockImplementation(() => {
      throw error;
    });
    const requestMock = {
      body: { verificationType: 'EMAIL' },
    } as Request;

    validatePhoneNumberErrorTypeMock.mockReturnValue({
      isKnownError: false,
      message: ErrorConstants.INTERNAL_SERVER_ERROR,
    });

    const expected = 'unknown-failure';
    unknownFailureResponseMock.mockReturnValue(expected);

    const actual = await pinResetHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toEqual(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      unknownFailureResponseMock,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
