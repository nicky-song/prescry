// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalErrorCode,
} from '@phx/common/src/errors/error-codes';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { ErrorConstants } from '../../../constants/response-messages';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { getIdentityVerificationAttemptsDataFromRedis } from '../../../databases/redis/redis-query-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { invalidIdentityVerificationResponse } from '../helpers/invalid-identity-verification-response.helper';
import { verifyIdentitySuccessResponse } from '../helpers/verify-identity-success-response.helper';
import { verifyIdentityHandler } from './verify-identity.handler';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { databaseMock } from '../../../mock-data/database.mock';
import { IConfiguration } from '../../../configuration';
import { IAppLocals } from '../../../models/app-locals';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { mockPatient } from '../../../mock-data/fhir-patient.mock';
import { patientAccountPrimaryMock } from '../../../mock-data/patient-account.mock';
import { arePatientIdentityDetailsValid } from '../../../utils/fhir-patient/patient.helper';
import { IVerifyIdentityRequestBody } from '@phx/common/src/models/api-request-body/verify-identity.request-body';
import { isPhoneNumberInReferences } from '../../../utils/patient-account/patient-account.helper';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../../../databases/redis/redis-query-helper');
const getIdentityVerificationAttemptsDataFromRedisMock =
  getIdentityVerificationAttemptsDataFromRedis as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

jest.mock('@phx/common/src/utils/date-time-helper');
const UTCDateStringMock = UTCDateString as jest.Mock;

jest.mock('../helpers/verify-identity-success-response.helper');
const verifyIdentitySuccessResponseMock =
  verifyIdentitySuccessResponse as jest.Mock;

jest.mock('../../../utils/response-helper');
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const UnknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../helpers/invalid-identity-verification-response.helper');
const invalidIdentityVerificationResponseMock =
  invalidIdentityVerificationResponse as jest.Mock;

jest.mock('../../../utils/fhir-patient/patient.helper');
const arePatientIdentityDetailsValidMock =
  arePatientIdentityDetailsValid as jest.Mock;

jest.mock('../../../utils/patient-account/patient-account.helper');
const isPhoneNumberInReferencesMock = isPhoneNumberInReferences as jest.Mock;

jest.mock('../../../assertions/assert-has-patient-account');
const assertHasPatientAccountMock = assertHasPatientAccount as jest.Mock;

jest.mock('../../../assertions/assert-has-patient');
const assertHasPatientMock = assertHasPatient as jest.Mock;

describe('verifyIdentityHandler', () => {
  const responseMock = {} as Response;
  const accountPhoneNumberMock = '+15554443333';

  beforeEach(() => {
    jest.resetAllMocks();

    getRequiredResponseLocalMock.mockReturnValue({});
    getIdentityVerificationAttemptsDataFromRedisMock.mockResolvedValue(
      undefined
    );
  });

  it('returns success response when information is correct', async () => {
    const phoneNumberMock = '+15554443333';
    const emailAddressMock = 'email@email.com';
    const dateOfBirthMock = '2000-01-01';
    const accountMock = {
      dateOfBirth: '2000-01-01',
      recoveryEmail: 'email@email.com',
    };
    const requestMock = {
      body: {
        phoneNumber: phoneNumberMock,
        emailAddress: emailAddressMock,
        dateOfBirth: dateOfBirthMock,
      },
    } as Request;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 3,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );
    searchAccountByPhoneNumberMock.mockReturnValue(accountMock);
    UTCDateStringMock.mockReturnValue('2000-01-01');

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      phoneNumberMock
    );
    expect(UTCDateStringMock).toBeCalledWith(accountMock.dateOfBirth);
    expect(invalidIdentityVerificationResponseMock).not.toBeCalled();
    expect(verifyIdentitySuccessResponseMock).toBeCalledWith(
      responseMock,
      phoneNumberMock,
      emailAddressMock,
      configurationMock
    );
  });

  it('returns failure response when maximum attempts have been used', async () => {
    const requestMock = {} as Request;

    const verificationAttemptsMock = 5;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: verificationAttemptsMock,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );

    const configurationWithMaxVerificationAttemptsMock = {
      ...configurationMock,
      maxIdentityVerificationAttempts: verificationAttemptsMock,
    } as IConfiguration;

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationWithMaxVerificationAttemptsMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).not.toBeCalled();
    expect(verifyIdentitySuccessResponseMock).not.toBeCalled();
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.IDENTITY_VERIFICATION_LOCKED,
      undefined,
      InternalErrorCode.SHOW_ACCOUNT_LOCKED,
      { reachedMaxVerificationAttempts: true }
    );
  });

  it('asserts patient exists in locals (v2)', async () => {
    const requestMock = {
      body: {},
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;
    const responseMock = {
      locals: { patient: mockPatient } as IAppLocals,
    } as unknown as Response;

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(assertHasPatientMock, mockPatient);
  });

  it('returns failure when patient account missing from locals (v2)', async () => {
    const requestMock = {
      body: {},
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;
    const patientAccountMock = patientAccountPrimaryMock;
    const responseMock = {
      locals: {
        patient: mockPatient,
        patientAccount: patientAccountMock,
      } as IAppLocals,
    } as unknown as Response;

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasPatientAccountMock,
      patientAccountMock
    );
  });

  it('returns invalid identity verification when patient identity details do not match (v2)', async () => {
    const dateOfBirthMock = 'date-of-birth';
    const phoneNumberMock = 'phone-number';
    const emailMock = 'email';
    const requestMock = {
      body: {
        dateOfBirth: dateOfBirthMock,
        phoneNumber: phoneNumberMock,
        emailAddress: emailMock,
      } as IVerifyIdentityRequestBody,
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const responseMock = {
      locals: {
        patient: mockPatient,
        patientAccount: patientAccountPrimaryMock,
      } as IAppLocals,
    } as unknown as Response;

    const devicePhoneNumberMock = 'device-phone-number';
    getRequiredResponseLocalMock.mockReturnValue({
      data: devicePhoneNumberMock,
    });

    arePatientIdentityDetailsValidMock.mockReturnValue(false);

    const invalidIdentityMock = 'invalid-identity';
    invalidIdentityVerificationResponseMock.mockResolvedValue(
      invalidIdentityMock
    );

    const identityVerificationDataInRedisMock = undefined;
    getIdentityVerificationAttemptsDataFromRedisMock.mockResolvedValue(
      identityVerificationDataInRedisMock
    );

    const result = await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      arePatientIdentityDetailsValidMock,
      mockPatient,
      phoneNumberMock,
      emailMock,
      dateOfBirthMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      invalidIdentityVerificationResponseMock,
      responseMock,
      devicePhoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );

    expect(result).toEqual(invalidIdentityMock);
  });

  it('returns invalid identity verification when patient account reference does not match phone number (v2)', async () => {
    const phoneNumberMock = 'phone-number';
    const requestMock = {
      body: {
        phoneNumber: phoneNumberMock,
      } as IVerifyIdentityRequestBody,
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const responseMock = {
      locals: {
        patient: mockPatient,
        patientAccount: patientAccountPrimaryMock,
      } as IAppLocals,
    } as unknown as Response;

    const devicePhoneNumberMock = 'device-phone-number';
    getRequiredResponseLocalMock.mockReturnValue({
      data: devicePhoneNumberMock,
    });

    arePatientIdentityDetailsValidMock.mockReturnValue(true);
    isPhoneNumberInReferencesMock.mockReturnValue(false);

    const invalidIdentityMock = 'invalid-identity';
    invalidIdentityVerificationResponseMock.mockResolvedValue(
      invalidIdentityMock
    );

    const identityVerificationDataInRedisMock = undefined;
    getIdentityVerificationAttemptsDataFromRedisMock.mockResolvedValue(
      identityVerificationDataInRedisMock
    );

    const result = await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      isPhoneNumberInReferencesMock,
      patientAccountPrimaryMock.reference,
      phoneNumberMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      invalidIdentityVerificationResponseMock,
      responseMock,
      devicePhoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );

    expect(result).toEqual(invalidIdentityMock);
  });

  it('returns failure response when account is missing', async () => {
    const accountMock = undefined;
    const requestMock = {
      body: {
        phoneNumber: undefined,
        emailAddress: undefined,
        dateOfBirth: undefined,
      },
    } as Request;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 3,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );
    searchAccountByPhoneNumberMock.mockReturnValue(accountMock);

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      undefined
    );
    expect(UTCDateStringMock).not.toBeCalled();
    expect(verifyIdentitySuccessResponseMock).not.toBeCalled();
    expect(invalidIdentityVerificationResponseMock).toBeCalledWith(
      responseMock,
      accountPhoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );
  });

  it('returns failure response when recoveryEmail is missing', async () => {
    const accountMock = { recoveryEmail: undefined };
    const requestMock = {
      body: {
        phoneNumber: undefined,
        emailAddress: undefined,
        dateOfBirth: undefined,
      },
    } as Request;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 3,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );
    searchAccountByPhoneNumberMock.mockReturnValue(accountMock);

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      undefined
    );
    expect(UTCDateStringMock).not.toBeCalled();
    expect(verifyIdentitySuccessResponseMock).not.toBeCalled();
    expect(invalidIdentityVerificationResponseMock).toBeCalledWith(
      responseMock,
      accountPhoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );
  });

  it('returns failure response when recoveryEmail does not match account information', async () => {
    const accountMock = { recoveryEmail: 'email1@email.com' };
    const requestMock = {
      body: {
        phoneNumber: undefined,
        emailAddress: 'email@email.com',
        dateOfBirth: undefined,
      },
    } as Request;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 3,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );
    searchAccountByPhoneNumberMock.mockReturnValue(accountMock);

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      undefined
    );
    expect(UTCDateStringMock).not.toBeCalled();
    expect(verifyIdentitySuccessResponseMock).not.toBeCalled();
    expect(invalidIdentityVerificationResponseMock).toBeCalledWith(
      responseMock,
      accountPhoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );
  });

  it('returns failure response when dateOfBirth is missing', async () => {
    const accountMock = {
      recoveryEmail: 'email@email.com',
      dateOfBirth: '2000-01-01',
    };
    const requestMock = {
      body: {
        phoneNumber: undefined,
        emailAddress: 'email@email.com',
        dateOfBirth: undefined,
      },
    } as Request;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 3,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );
    searchAccountByPhoneNumberMock.mockReturnValue(accountMock);
    UTCDateStringMock.mockReturnValue('2000-01-01');

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      undefined
    );
    expect(UTCDateStringMock).toBeCalledWith(accountMock.dateOfBirth);
    expect(verifyIdentitySuccessResponseMock).not.toBeCalled();
    expect(invalidIdentityVerificationResponseMock).toBeCalledWith(
      responseMock,
      accountPhoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );
  });

  it('returns failure response when dateOfBirth does not match account information', async () => {
    const accountMock = {
      recoveryEmail: 'email@email.com',
      dateOfBirth: '2000-01-01',
    };
    const requestMock = {
      body: {
        phoneNumber: undefined,
        emailAddress: 'email@email.com',
        dateOfBirth: '1999-01-01',
      },
    } as Request;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 3,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );
    searchAccountByPhoneNumberMock.mockReturnValue(accountMock);
    UTCDateStringMock.mockReturnValue('2000-01-01');

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      undefined
    );
    expect(UTCDateStringMock).toBeCalledWith(accountMock.dateOfBirth);
    expect(verifyIdentitySuccessResponseMock).not.toBeCalled();
    expect(invalidIdentityVerificationResponseMock).toBeCalledWith(
      responseMock,
      accountPhoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );
  });

  it('returns failure response when phoneNumber does not match account information', async () => {
    const accountMock = {
      recoveryEmail: 'email@email.com',
      dateOfBirth: '2000-01-01',
    };
    const requestMock = {
      body: {
        phoneNumber: '+15554443332',
        emailAddress: 'email@email.com',
        dateOfBirth: '2000-01-01',
      },
    } as Request;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 3,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );
    searchAccountByPhoneNumberMock.mockReturnValue(accountMock);
    UTCDateStringMock.mockReturnValue('2000-01-01');

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      requestMock.body.phoneNumber
    );
    expect(UTCDateStringMock).toBeCalledWith(accountMock.dateOfBirth);
    expect(verifyIdentitySuccessResponseMock).not.toBeCalled();
    expect(invalidIdentityVerificationResponseMock).toBeCalledWith(
      responseMock,
      accountPhoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );
  });

  it('returns unknown failure response when unknown error is thrown', async () => {
    const requestMock = {
      body: {
        phoneNumber: '+15554443333',
        emailAddress: 'email@email.com',
        dateOfBirth: '2000-01-01',
      },
    } as Request;
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 3,
    };
    const unknownError = {
      message: 'This is an unknown error',
      status: 412,
      code: 412,
    };
    getRequiredResponseLocalMock.mockReturnValue({
      data: accountPhoneNumberMock,
    });
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValue(
      identityVerificationDataInRedisMock
    );
    searchAccountByPhoneNumberMock.mockImplementation(() => {
      throw unknownError;
    });
    UTCDateStringMock.mockReturnValue('2000-01-01');

    await verifyIdentityHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(getRequiredResponseLocalMock).toBeCalledWith(responseMock, 'device');
    expect(getIdentityVerificationAttemptsDataFromRedisMock).toBeCalledWith(
      accountPhoneNumberMock
    );
    expect(searchAccountByPhoneNumberMock).toBeCalledWith(
      databaseMock,
      requestMock.body.phoneNumber
    );
    expect(UTCDateStringMock).not.toBeCalled();
    expect(verifyIdentitySuccessResponseMock).not.toBeCalled();
    expect(invalidIdentityVerificationResponseMock).not.toBeCalled();
    expect(UnknownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      unknownError
    );
  });
});
