// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import {
  addIdentityVerificationAttemptsKeyInRedis,
  getIdentityVerificationAttemptsDataFromRedis,
} from '../../../databases/redis/redis-query-helper';
import { trackPinResetLockedEvent } from '../../../utils/custom-event-helper';

import { IIdentityVerificationKeyValues } from '../../../utils/redis/redis.helper';
import { KnownFailureResponse } from '../../../utils/response-helper';
import { resetPinFailureResponse } from './reset-pin-failure-response.helper';

jest.mock('../../../utils/custom-event-helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../../databases/redis/redis-query-helper');

const trackPinResetLockedEventMock = trackPinResetLockedEvent as jest.Mock;
const addIdentityVerificationAttemptsKeyInRedisMock =
  addIdentityVerificationAttemptsKeyInRedis as jest.Mock;
const getIdentityVerificationAttemptsDataFromRedisMock =
  getIdentityVerificationAttemptsDataFromRedis as jest.Mock;
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const responseMock = {} as Response;
const phoneNumberMock = '+11112223344';
const configurationMock = {
  maxIdentityVerificationAttempts: 5,
  redisIdentityVerificationKeyExpiryTime: 10,
} as IConfiguration;

beforeEach(() => {
  jest.clearAllMocks();
});
describe('resetPinFailureResponse', () => {
  it('returns verification failed response if max verification attempts not reached', async () => {
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 1,
    } as IIdentityVerificationKeyValues;
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValueOnce(
      identityVerificationDataInRedisMock
    );
    const formattedErrorMessage =
      'Invalid code. You have 3 attempts left before your account is locked.';
    await resetPinFailureResponse(
      responseMock,
      phoneNumberMock,
      configurationMock
    );
    expect(addIdentityVerificationAttemptsKeyInRedisMock).toBeCalledWith(
      phoneNumberMock,
      configurationMock.redisIdentityVerificationKeyExpiryTime,
      2
    );
    expect(trackPinResetLockedEventMock).not.toBeCalled();
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      formattedErrorMessage,
      undefined,
      undefined,
      { reachedMaxVerificationAttempts: false }
    );
  });
  it('returns verification locked response if max verification attempts is reached', async () => {
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 4,
    } as IIdentityVerificationKeyValues;
    getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValueOnce(
      identityVerificationDataInRedisMock
    );
    await resetPinFailureResponse(
      responseMock,
      phoneNumberMock,
      configurationMock
    );
    expect(addIdentityVerificationAttemptsKeyInRedisMock).toBeCalledWith(
      phoneNumberMock,
      configurationMock.redisIdentityVerificationKeyExpiryTime,
      5
    );

    expect(trackPinResetLockedEventMock).toBeCalledWith(phoneNumberMock);
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PIN_RESET_LOCKED,
      undefined,
      2010,
      { reachedMaxVerificationAttempts: true }
    );
  });
});
