// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IAccount } from '@phx/common/src/models/account';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { SuccessConstants } from '../../../constants/response-messages';
import { ErrorConstants } from '../../../constants/response-messages';
import {
  KnownFailureResponse,
  SuccessResponse,
  errorResponseWithTwilioErrorHandling,
} from '../../../utils/response-helper';
import {
  sendOneTimeCodeToEmail,
  sendOneTimePassword,
} from '../../../utils/twilio-helper';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { sendVerificationCodeHandler } from './send-verification-code.handler';
import { databaseMock } from '../../../mock-data/database.mock';
import { twilioMock } from '../../../mock-data/twilio.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { IAppLocals } from '../../../models/app-locals';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../../../mock-data/patient-account.mock';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { isPhoneNumberInReferences } from '../../../utils/patient-account/patient-account.helper';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import { getPreferredEmailFromPatient } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import { sendOneTimePasswordV2 } from '../../../utils/one-time-password/send-one-time-password-v2';
import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const errorResponseWithTwilioErrorHandlingMock =
  errorResponseWithTwilioErrorHandling as jest.Mock;

jest.mock('../../../utils/twilio-helper');
const sendOneTimePasswordMock = sendOneTimePassword as jest.Mock;
const sendOneTimeCodeToEmailMock = sendOneTimeCodeToEmail as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

jest.mock('../../../assertions/assert-has-patient-account');
const assertHasPatientAccountMock = assertHasPatientAccount as jest.Mock;

jest.mock('../../../assertions/assert-has-account-id');
const assertHasAccountIdMock = assertHasAccountId as jest.Mock;

jest.mock('../../../utils/patient-account/patient-account.helper');
const isPhoneNumberInReferencesMock = isPhoneNumberInReferences as jest.Mock;

jest.mock('../../../assertions/assert-has-patient');
const assertHasPatientMock = assertHasPatient as jest.Mock;

jest.mock('../../../utils/fhir-patient/get-contact-info-from-patient');
const getPreferredEmailFromPatientMock =
  getPreferredEmailFromPatient as jest.Mock;

jest.mock('../../../utils/one-time-password/send-one-time-password-v2');
const sendOneTimePasswordV2Mock = sendOneTimePasswordV2 as jest.Mock;

jest.mock('@phx/common/src/assertions/assert-is-truthy');
const assertIsTruthyMock = assertIsTruthy as jest.Mock;

describe('sendVerificationCodeHandler', () => {
  const accountMock = {
    phoneNumber: 'mock-phone',
    recoveryEmail: 'mock-email',
  } as IAccount;

  beforeEach(() => {
    jest.clearAllMocks();
    sendOneTimePasswordMock.mockResolvedValue(
      Promise.resolve({ status: 'approved' })
    );
    searchAccountByPhoneNumberMock.mockResolvedValue(accountMock);
    sendOneTimePasswordV2Mock.mockResolvedValue(undefined);
  });

  it('asserts patient account exists in locals (v2)', async () => {
    const requestMock = {
      body: { verificationType: 'EMAIL' },
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const patientAccountMock = patientAccountPrimaryMock;
    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
        patientAccount: patientAccountMock,
      } as IAppLocals,
    } as unknown as Response;

    await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasPatientAccountMock,
      patientAccountMock
    );
  });

  it('asserts account id exists in patient account (v2)', async () => {
    const requestMock = {
      body: { verificationType: 'EMAIL' },
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const accountIdMock = 'account-id';
    const patientAccountMock = {
      ...patientAccountPrimaryMock,
      accountId: accountIdMock,
    };
    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
        patientAccount: patientAccountMock,
      } as IAppLocals,
    } as unknown as Response;

    await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(assertHasAccountIdMock, accountIdMock);
  });

  it('returns BAD REQUEST if phone number does not exist in patient account (v2)', async () => {
    const requestMock = {
      body: { verificationType: 'EMAIL' },
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const patientAccountMock = patientAccountPrimaryMock;
    const phoneNumberMock = 'phone-number';
    const responseMock = {
      locals: {
        device: { data: phoneNumberMock },
        patientAccount: patientAccountMock,
      } as IAppLocals,
    } as unknown as Response;

    isPhoneNumberInReferencesMock.mockReturnValue(false);

    const knownFailureMock = 'known-failure';
    knownFailureResponseMock.mockReturnValue(knownFailureMock);

    const result = await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      isPhoneNumberInReferencesMock,
      patientAccountMock.reference,
      phoneNumberMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PHONE_NUMBER_MISSING,
      undefined,
      undefined
    );

    expect(result).toEqual(knownFailureMock);
  });

  it('asserts patient exists in patient account (v2 - email)', async () => {
    const requestMock = {
      body: { verificationType: 'EMAIL' },
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const patientAccountMock = patientAccountPrimaryWithPatientMock;
    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
        patientAccount: patientAccountMock,
      } as IAppLocals,
    } as unknown as Response;

    isPhoneNumberInReferencesMock.mockReturnValue(true);

    await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasPatientMock,
      patientAccountMock.patient
    );
  });

  it('sends one-time password (v2 - email)', async () => {
    const requestMock = {
      body: { verificationType: 'EMAIL' },
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const patientAccountMock = patientAccountPrimaryWithPatientMock;
    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
        patientAccount: patientAccountMock,
      } as IAppLocals,
    } as unknown as Response;

    isPhoneNumberInReferencesMock.mockReturnValue(true);

    const preferredEmailMock = 'preferred-email';
    getPreferredEmailFromPatientMock.mockReturnValue(preferredEmailMock);

    await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getPreferredEmailFromPatientMock,
      patientAccountMock.patient
    );

    expectToHaveBeenCalledOnceOnlyWith(assertIsTruthyMock, preferredEmailMock);

    expectToHaveBeenCalledOnceOnlyWith(
      sendOneTimePasswordV2Mock,
      configurationMock,
      preferredEmailMock,
      'email'
    );
  });

  it('sends one-time password (v2 - phone)', async () => {
    const requestMock = {
      body: { verificationType: 'PHONE' },
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const patientAccountMock = patientAccountPrimaryWithPatientMock;
    const phoneNumberMock = 'phone-number';
    const responseMock = {
      locals: {
        device: { data: phoneNumberMock },
        patientAccount: patientAccountMock,
      } as IAppLocals,
    } as unknown as Response;

    isPhoneNumberInReferencesMock.mockReturnValue(true);

    await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      sendOneTimePasswordV2Mock,
      configurationMock,
      phoneNumberMock,
      'phone'
    );
  });

  it('returns error if no account found for the phone number', async () => {
    const requestMock = {
      body: { verificationType: 'EMAIL' },
    } as Request;

    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
      },
    } as unknown as Response;

    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    const expected = {};
    knownFailureResponseMock.mockReturnValue(expected);

    const actual = await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toBe(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      'mock-phone'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PHONE_NUMBER_MISSING,
      undefined,
      undefined
    );

    expect(sendOneTimeCodeToEmailMock).not.toBeCalled();
    expect(sendOneTimePasswordMock).not.toBeCalled();
  });

  it('returns error if account found for the phone number but it has no recovery email', async () => {
    const requestMock = {
      body: { verificationType: 'EMAIL' },
    } as Request;

    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
      },
    } as unknown as Response;
    const noRecoveryAccountMock = {
      phoneNumber: 'mock-phone',
    } as IAccount;
    searchAccountByPhoneNumberMock.mockResolvedValue(noRecoveryAccountMock);
    const expected = {};
    knownFailureResponseMock.mockReturnValue(expected);

    const actual = await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toBe(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      'mock-phone'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.RECOVERY_EMAIL_MISSING,
      undefined,
      undefined
    );

    expect(sendOneTimeCodeToEmailMock).not.toBeCalled();
    expect(sendOneTimePasswordMock).not.toBeCalled();
  });

  it('calls sendOneTimeCodeToEmail if verification type is email', async () => {
    const requestMock = {
      body: { verificationType: 'EMAIL' },
    } as Request;

    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
      },
    } as unknown as Response;

    const expected = {};
    successResponseMock.mockReturnValue(expected);

    const actual = await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toBe(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      'mock-phone'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      sendOneTimeCodeToEmailMock,
      twilioMock,
      configurationMock.twilioEmailVerificationServiceId,
      'mock-email'
    );

    expect(sendOneTimePasswordMock).not.toBeCalled();

    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.SEND_SUCCESS_MESSAGE
    );
  });

  it('calls sendOneTimePassword if verification type is phone', async () => {
    const requestMock = {
      body: { verificationType: 'PHONE' },
    } as Request;

    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
      },
    } as unknown as Response;

    const expected = {};
    successResponseMock.mockReturnValue(expected);

    const actual = await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toBe(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      'mock-phone'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      sendOneTimePasswordMock,
      twilioMock,
      configurationMock.twilioVerificationServiceId,
      'mock-phone'
    );

    expect(sendOneTimeCodeToEmailMock).not.toBeCalled();

    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.SEND_SUCCESS_MESSAGE
    );
  });

  it('returns error from sendVerificationCodeHandler if any exception occurs', async () => {
    const error = { message: 'internal error' };
    searchAccountByPhoneNumberMock.mockImplementation(() => {
      throw error;
    });
    const requestMock = {
      body: { verificationType: 'EMAIL' },
    } as Request;

    const responseMock = {
      locals: {
        device: { data: 'mock-phone' },
      },
    } as unknown as Response;

    const expected = {};
    errorResponseWithTwilioErrorHandlingMock.mockReturnValueOnce(expected);

    const actual = await sendVerificationCodeHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(actual).toBe(expected);

    expectToHaveBeenCalledOnceOnlyWith(
      errorResponseWithTwilioErrorHandlingMock,
      responseMock,
      'mock-phone',
      error
    );
  });
});
