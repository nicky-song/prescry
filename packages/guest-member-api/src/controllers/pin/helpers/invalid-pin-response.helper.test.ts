// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import {
  getPinVerificationDataFromRedis,
  addPinVerificationKeyInRedis,
} from '../../../databases/redis/redis-query-helper';
import { KnownFailureResponse } from '../../../utils/response-helper';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import {
  trackPinVerificationFailedEvent,
  trackSessionLockedEvent,
} from '../../../utils/custom-event-helper';
import { IConfiguration } from '../../../configuration';

import { invalidPinResponse } from './invalid-pin-response.helper';

const routerResponseMock = {} as Response;
const mockPhoneNumber = 'fake-phone';
const mockDeviceIdentifier = 'id-1';
const configurationMock = {
  maxPinVerificationAttempts: 5,
  redisPinVerificationKeyExpiryTime: 1800,
} as IConfiguration;

jest.mock('../../../databases/redis/redis-query-helper');
jest.mock('../../../utils/custom-event-helper');
jest.mock('../../../utils/response-helper');

const getPinVerificationDataFromRedisMock =
  getPinVerificationDataFromRedis as jest.Mock;
const addPinVerificationKeyInRedisMock =
  addPinVerificationKeyInRedis as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const trackPinVerificationFailedEventMock =
  trackPinVerificationFailedEvent as jest.Mock;
const trackSessionLockedEventMock = trackSessionLockedEvent as jest.Mock;

beforeEach(() => {
  addPinVerificationKeyInRedisMock.mockReset();
  getPinVerificationDataFromRedisMock.mockReset();
  knownFailureResponseMock.mockReset();
  trackPinVerificationFailedEventMock.mockReset();
  trackSessionLockedEventMock.mockReset();
});
describe('invalidPinResponse', () => {
  it('Should increment count of existing pin verification attempts and update redis pin verification key', async () => {
    getPinVerificationDataFromRedisMock.mockReturnValue({
      pinVerificationAttempt: 1,
    });

    await invalidPinResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      configurationMock,
      true
    );

    expect(addPinVerificationKeyInRedisMock).toHaveBeenCalledTimes(1);
    expect(addPinVerificationKeyInRedisMock).toBeCalledWith(
      mockPhoneNumber,
      configurationMock.redisPinVerificationKeyExpiryTime,
      mockDeviceIdentifier,
      2
    );
  });
  it('Should set pin verification attempts to 1 if pinVerification key does not exists and update redis pin verification key', async () => {
    getPinVerificationDataFromRedisMock.mockReturnValue(undefined);
    await invalidPinResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      configurationMock,
      true
    );

    expect(addPinVerificationKeyInRedisMock).toHaveBeenCalledTimes(1);
    expect(addPinVerificationKeyInRedisMock).toBeCalledWith(
      mockPhoneNumber,
      configurationMock.redisPinVerificationKeyExpiryTime,
      mockDeviceIdentifier,
      1
    );
  });
  it('Should return bad request error code if its update pin endpoint', async () => {
    getPinVerificationDataFromRedisMock.mockReturnValue({});

    await invalidPinResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      configurationMock,
      true
    );

    expect(addPinVerificationKeyInRedisMock).toHaveBeenCalledTimes(1);
    expect(addPinVerificationKeyInRedisMock).toBeCalledWith(
      mockPhoneNumber,
      configurationMock.redisPinVerificationKeyExpiryTime,
      mockDeviceIdentifier,
      1
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_PIN,
      undefined,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
  });
  it('Should return bad request error code with total attempts so far if its verify pin endpoint', async () => {
    getPinVerificationDataFromRedisMock.mockReturnValue({
      pinVerificationAttempt: 3,
    });

    await invalidPinResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      configurationMock,
      false
    );

    expect(addPinVerificationKeyInRedisMock).toHaveBeenCalledTimes(1);
    expect(addPinVerificationKeyInRedisMock).toBeCalledWith(
      mockPhoneNumber,
      configurationMock.redisPinVerificationKeyExpiryTime,
      mockDeviceIdentifier,
      4
    );
    expect(trackPinVerificationFailedEventMock).toBeCalledWith(
      mockPhoneNumber,
      4
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_PIN,
      undefined,
      undefined,
      { pinVerificationAttempt: 4 }
    );
  });
  it('Should track account locked event if maxPinVerificationAttempts is reached and its verify pin endpoint', async () => {
    getPinVerificationDataFromRedisMock.mockReturnValue({
      pinVerificationAttempt: 4,
    });

    await invalidPinResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      configurationMock,
      false
    );

    expect(addPinVerificationKeyInRedisMock).toHaveBeenCalledTimes(1);
    expect(addPinVerificationKeyInRedisMock).toBeCalledWith(
      mockPhoneNumber,
      configurationMock.redisPinVerificationKeyExpiryTime,
      mockDeviceIdentifier,
      5
    );
    expect(trackPinVerificationFailedEventMock).toBeCalledWith(
      mockPhoneNumber,
      5
    );
    expect(trackSessionLockedEventMock).toBeCalledWith(mockPhoneNumber);
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_PIN,
      undefined,
      undefined,
      { pinVerificationAttempt: 5 }
    );
  });
});
