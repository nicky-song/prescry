// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import { addIdentityVerificationAttemptsKeyInRedis } from '../../../databases/redis/redis-query-helper';
import {
  trackIdentityVerificationFailedEvent,
  trackIdentityVerificationLockedEvent,
} from '../../../utils/custom-event-helper';
import { IIdentityVerificationKeyValues } from '../../../utils/redis/redis.helper';
import { KnownFailureResponse } from '../../../utils/response-helper';
import { invalidIdentityVerificationResponse } from './invalid-identity-verification-response.helper';

jest.mock('../../../utils/custom-event-helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../../databases/redis/redis-query-helper');

const trackIdentityVerificationLockedEventMock =
  trackIdentityVerificationLockedEvent as jest.Mock;
const trackIdentityVerificationFailedEventMock =
  trackIdentityVerificationFailedEvent as jest.Mock;
const addIdentityVerificationAttemptsKeyInRedisMock =
  addIdentityVerificationAttemptsKeyInRedis as jest.Mock;
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const responseMock = {} as Response;
const phoneNumberMock = '+11112223344';
const configurationMock = {
  maxIdentityVerificationAttempts: 5,
  redisIdentityVerificationKeyExpiryTime: 10,
} as IConfiguration;

describe('invalidIdentityVerificationResponse', () => {
  it('returns verification failed response if max verification attempts not reached', async () => {
    const identityVerificationDataInRedisMock = {
      identityVerificationAttempt: 1,
    } as IIdentityVerificationKeyValues;
    const formattedErrorMessage =
      'The information you provided does not match our records. You have 3 attempts left before your account is locked.';
    await invalidIdentityVerificationResponse(
      responseMock,
      phoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );
    expect(addIdentityVerificationAttemptsKeyInRedisMock).toBeCalledWith(
      phoneNumberMock,
      configurationMock.redisIdentityVerificationKeyExpiryTime,
      2
    );
    expect(trackIdentityVerificationFailedEventMock).toBeCalledWith(
      phoneNumberMock,
      2
    );
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
    await invalidIdentityVerificationResponse(
      responseMock,
      phoneNumberMock,
      configurationMock,
      identityVerificationDataInRedisMock
    );
    expect(addIdentityVerificationAttemptsKeyInRedisMock).toBeCalledWith(
      phoneNumberMock,
      configurationMock.redisIdentityVerificationKeyExpiryTime,
      5
    );
    expect(trackIdentityVerificationFailedEventMock).toBeCalledWith(
      phoneNumberMock,
      5
    );
    expect(trackIdentityVerificationLockedEventMock).toBeCalledWith(
      phoneNumberMock
    );
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.IDENTITY_VERIFICATION_LOCKED,
      undefined,
      undefined,
      { reachedMaxVerificationAttempts: true }
    );
  });
});
