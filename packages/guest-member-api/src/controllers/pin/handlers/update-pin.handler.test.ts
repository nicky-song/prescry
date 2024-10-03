// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import {
  addPinVerificationKeyInRedis,
  getPinDataFromRedis,
} from '../../../databases/redis/redis-query-helper';
import { compareHashValue } from '../../../utils/bcryptjs-helper';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { invalidPinResponse } from '../helpers/invalid-pin-response.helper';
import { updatePinSuccessResponse } from '../helpers/update-pin-success-response.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { getPinDetails } from '../../../utils/patient-account/get-pin-details';
import { updatePinHandler } from './update-pin.handler';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ErrorRequestInitialization } from '@phx/common/src/errors/error-request-initialization';
import { patientAccountPrimaryMock } from '../../../mock-data/patient-account.mock';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { databaseMock } from '../../../mock-data/database.mock';

const mockPhoneNumber = 'fake-phone';
const requestMock = {
  body: {
    encryptedPinCurrent: 'encryptedPin',
    encryptedPinNew: 'newPin',
  },
} as Request;
const requestV2Mock = {
  ...requestMock,
  headers: {
    [RequestHeaders.apiVersion]: 'v2',
  },
} as Request;

const deviceMock = {
  data: mockPhoneNumber,
  identifier: 'id-1',
  type: 'phone',
};
const routerResponseMock = {
  locals: {
    device: deviceMock,
    deviceKeyRedis: 'deviceKey',
  },
} as unknown as Response;

jest.mock('../../../databases/redis/redis-query-helper');
const getPinDataFromRedisMock = getPinDataFromRedis as jest.Mock;
const addPinVerificationKeyInRedisMock =
  addPinVerificationKeyInRedis as jest.Mock;

jest.mock('../../../utils/response-helper');
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../utils/bcryptjs-helper');
const compareHashValueMock = compareHashValue as jest.Mock;

jest.mock('../helpers/invalid-pin-response.helper');
const invalidPinResponseMock = invalidPinResponse as jest.Mock;

jest.mock('../helpers/update-pin-success-response.helper');
const updatePinSuccessResponseMock = updatePinSuccessResponse as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../../../utils/patient-account/get-pin-details');
const getPinDetailsMock = getPinDetails as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});
describe('updatePinHandler', () => {
  it('should return KnownFailureResponse if pin details not found from redis', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    getPinDataFromRedisMock.mockReturnValue(undefined);
    await updatePinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );

    expect(knownFailureResponseMock).toHaveBeenCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.PIN_MISSING,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(1);
    expect(getPinDetailsMock).not.toBeCalled();
  });
  it('should return KnownFailureResponse if account is in redis but pinHash details not found from redis', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    getPinDataFromRedisMock.mockReturnValue({ phoneNumber: mockPhoneNumber });
    await updatePinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );

    expect(knownFailureResponseMock).toHaveBeenCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.PIN_MISSING,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(1);
    expect(getPinDetailsMock).not.toBeCalled();
  });
  it('should call invalidPinResponse if pin is invalid', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    compareHashValueMock.mockReturnValueOnce(false);
    getPinDataFromRedisMock.mockReturnValue({
      phoneNumber: mockPhoneNumber,
      pinHash: 'pinHash',
    });
    await updatePinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(compareHashValueMock).toHaveBeenCalledTimes(1);
    expect(compareHashValueMock).toBeCalledWith('encryptedPin', 'pinHash');
    expect(invalidPinResponseMock).toBeCalled();
    expect(invalidPinResponseMock).toBeCalledWith(
      routerResponseMock,
      mockPhoneNumber,
      'id-1',
      configurationMock,
      true
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(1);
    expect(getPinDetailsMock).not.toBeCalled();
  });
  it('should call error if new pin is same as old pin', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    compareHashValueMock.mockReturnValueOnce(true);
    compareHashValueMock.mockReturnValueOnce(true);
    getPinDataFromRedisMock.mockReturnValue({
      phoneNumber: mockPhoneNumber,
      pinHash: 'pinHash',
    });
    await updatePinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(compareHashValueMock).toHaveBeenCalledTimes(2);
    expect(compareHashValueMock.mock.calls[0][0]).toBe('encryptedPin');
    expect(compareHashValueMock.mock.calls[0][1]).toBe('pinHash');
    expect(compareHashValueMock.mock.calls[1][0]).toBe('newPin');
    expect(compareHashValueMock.mock.calls[1][1]).toBe('pinHash');

    expect(addPinVerificationKeyInRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber,
      configurationMock.redisPinVerificationKeyExpiryTime,
      'id-1'
    );
    expect(knownFailureResponseMock).toBeCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.NEW_PIN_SAME,
      undefined,
      InternalResponseCode.USE_ANOTHER_PIN
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(1);
    expect(getPinDetailsMock).not.toBeCalled();
  });
  it('should call updatePinSuccessResponse if pin is valid', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    compareHashValueMock.mockReturnValueOnce(true);
    compareHashValueMock.mockReturnValueOnce(false);
    getPinDataFromRedisMock.mockReturnValue({
      phoneNumber: mockPhoneNumber,
      pinHash: 'pinHash',
    });
    await updatePinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(compareHashValueMock).toHaveBeenCalledTimes(2);
    expect(updatePinSuccessResponseMock).toBeCalled();
    expect(updatePinSuccessResponseMock).toBeCalledWith(
      routerResponseMock,
      mockPhoneNumber,
      'newPin',
      {
        phoneNumber: mockPhoneNumber,
        pinHash: 'pinHash',
      },
      configurationMock,
      'v1',
      undefined
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(1);
    expect(getPinDetailsMock).not.toBeCalled();
  });

  it('should return UnknownFailureResponse in case of exception', async () => {
    const error = { message: 'internal error' };
    getPinDataFromRedisMock.mockImplementationOnce(() => {
      throw error;
    });
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    await updatePinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(unknownResponseMock).toHaveBeenCalled();
    expect(unknownResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(1);
    expect(getPinDetailsMock).not.toBeCalled();
  });
  it('v2: should return UnknownFailureResponse where patient account does not exists', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    const errorMock = new ErrorRequestInitialization('locals.patientAccount');
    getRequiredResponseLocalMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    await updatePinHandler(
      requestV2Mock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(unknownResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(2);
    expect(getPinDetailsMock).not.toBeCalled();
    expect(getPinDataFromRedisMock).not.toBeCalled();
  });
  it('v2: should return knownFailureResponse where pin does not exist in patient account', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    getRequiredResponseLocalMock.mockReturnValueOnce(patientAccountPrimaryMock);
    getPinDetailsMock.mockReturnValueOnce(undefined);

    await updatePinHandler(
      requestV2Mock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );

    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.PIN_MISSING,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(2);
    expect(getPinDetailsMock).toBeCalledWith(patientAccountPrimaryMock);
    expect(getPinDataFromRedisMock).not.toBeCalled();
  });
  it('v2: should return invalidPinResponse where pin is same as existing in patient account', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    getRequiredResponseLocalMock.mockReturnValueOnce(patientAccountPrimaryMock);
    getPinDetailsMock.mockReturnValueOnce({
      pinHash: 'pinHash',
      accountKey: 'account-key',
    });
    compareHashValueMock.mockReturnValueOnce(false);
    await updatePinHandler(
      requestV2Mock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(compareHashValueMock).toHaveBeenCalledTimes(1);
    expect(compareHashValueMock).toBeCalledWith('encryptedPin', 'pinHash');
    expect(invalidPinResponseMock).toBeCalledWith(
      routerResponseMock,
      mockPhoneNumber,
      'id-1',
      configurationMock,
      true
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(2);
    expect(getPinDetailsMock).toBeCalledWith(patientAccountPrimaryMock);
    expect(getPinDataFromRedisMock).not.toBeCalled();
  });
  it('v2: should return knownFailureResponse if new pin is same as old pin', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    getRequiredResponseLocalMock.mockReturnValueOnce(patientAccountPrimaryMock);
    getPinDetailsMock.mockReturnValueOnce({
      pinHash: 'pinHash',
      accountKey: 'account-key',
    });
    compareHashValueMock.mockReturnValueOnce(true);
    compareHashValueMock.mockReturnValueOnce(true);
    getPinDataFromRedisMock.mockReturnValue({
      phoneNumber: mockPhoneNumber,
      pinHash: 'pinHash',
    });
    await updatePinHandler(
      requestV2Mock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(compareHashValueMock).toHaveBeenCalledTimes(2);
    expect(compareHashValueMock.mock.calls[0][0]).toBe('encryptedPin');
    expect(compareHashValueMock.mock.calls[0][1]).toBe('pinHash');
    expect(compareHashValueMock.mock.calls[1][0]).toBe('newPin');
    expect(compareHashValueMock.mock.calls[1][1]).toBe('pinHash');

    expect(addPinVerificationKeyInRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber,
      configurationMock.redisPinVerificationKeyExpiryTime,
      'id-1'
    );
    expect(knownFailureResponseMock).toBeCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.NEW_PIN_SAME,
      undefined,
      InternalResponseCode.USE_ANOTHER_PIN
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(2);
    expect(getPinDetailsMock).toBeCalledWith(patientAccountPrimaryMock);
    expect(getPinDataFromRedisMock).not.toBeCalled();
  });
  it('v2: should call updatePinSuccessResponse if pin is valid', async () => {
    getRequiredResponseLocalMock.mockReturnValueOnce(deviceMock);
    getRequiredResponseLocalMock.mockReturnValueOnce(patientAccountPrimaryMock);
    getPinDetailsMock.mockReturnValueOnce({
      pinHash: 'pinHash',
      accountKey: 'account-key',
    });
    compareHashValueMock.mockReturnValueOnce(true);
    compareHashValueMock.mockReturnValueOnce(false);
    await updatePinHandler(
      requestV2Mock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(compareHashValueMock).toHaveBeenCalledTimes(2);
    expect(updatePinSuccessResponseMock).toBeCalled();
    expect(updatePinSuccessResponseMock).toBeCalledWith(
      routerResponseMock,
      mockPhoneNumber,
      'newPin',
      {
        accountKey: 'account-key',
        pinHash: 'pinHash',
      },
      configurationMock,
      'v2',
      patientAccountPrimaryMock
    );
    expect(getRequiredResponseLocal).toBeCalledTimes(2);
    expect(getPinDetailsMock).toBeCalledWith(patientAccountPrimaryMock);
    expect(getPinDataFromRedisMock).not.toBeCalled();
  });
});
