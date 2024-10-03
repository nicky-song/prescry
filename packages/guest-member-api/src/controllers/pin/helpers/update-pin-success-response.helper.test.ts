// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPinKeyValues } from '../../../utils/redis/redis.helper';
import { SuccessConstants } from '../../../constants/response-messages';
import { addPinKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { SuccessResponse } from '../../../utils/response-helper';

import { generateHash } from '../../../utils/bcryptjs-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { trackUpdatePinEvent } from '../../../utils/custom-event-helper';
import { updatePatientAccountPin } from '../../../utils/patient-account/update-patient-account-pin';

import { updatePinSuccessResponse } from './update-pin-success-response.helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { patientAccountPrimaryMock } from '../../../mock-data/patient-account.mock';

const mockPhoneNumber = 'fake-phone';
const mockEncryptedPin = 'fake-pin';
const routerResponseMock = {} as Response;
const newHashMock = 'pin-hash';

jest.mock('../../../databases/redis/redis-query-helper');
const addPinKeyInRedisMock = addPinKeyInRedis as jest.Mock;

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;

jest.mock('../../../utils/bcryptjs-helper');
const generateHashMock = generateHash as jest.Mock;
jest.mock('../../../utils/service-bus/account-update-helper');
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;

jest.mock('../../../utils/custom-event-helper');
const trackUpdatePinEventMock = trackUpdatePinEvent as jest.Mock;

jest.mock('../../../utils/patient-account/update-patient-account-pin');
const updatePatientAccountPinMock = updatePatientAccountPin as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  generateHashMock.mockReturnValue(newHashMock);
});

describe('updatePinSuccessResponse v1', () => {
  it('Should generate hash, update redis, send message, return success response', async () => {
    const pinKeyValues: IPinKeyValues = {
      dateOfBirth: 'dob',
      firstName: 'first-name',
      lastName: 'last-name',
      pinHash: 'hash',
      accountKey: 'account-key',
      _id: 'id',
    };

    const pinKeyValuesUpdated: IPinKeyValues = {
      dateOfBirth: 'dob',
      firstName: 'first-name',
      lastName: 'last-name',
      pinHash: newHashMock,
      accountKey: 'account-key',
      _id: 'id',
    };

    await updatePinSuccessResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockEncryptedPin,
      pinKeyValues,
      configurationMock,
      'v1'
    );

    expect(generateHash).toHaveBeenCalledTimes(1);
    expect(generateHash).toBeCalledWith(mockEncryptedPin);
    expect(addPinKeyInRedisMock).toHaveBeenCalledTimes(1);
    expect(addPinKeyInRedis).toBeCalledWith(
      mockPhoneNumber,
      pinKeyValuesUpdated,
      configurationMock.redisPinKeyExpiryTime
    );
    expect(publishAccountUpdateMessageMock).toBeCalledWith({
      phoneNumber: mockPhoneNumber,
      pinHash: newHashMock,
      recentlyUpdated: true,
    });
    expect(trackUpdatePinEventMock).toBeCalledWith(mockPhoneNumber);
    expect(successResponseMock).toBeCalledWith(
      routerResponseMock,
      SuccessConstants.UPDATE_PIN_SUCCESS
    );
  });
});

describe('updatePinSuccessResponsev2', () => {
  const pinKeyDetails: IPinKeyValues = {
    pinHash: 'hash',
    accountKey: 'account-key',
  };
  it('Should update pinHash and return success response if update authentication API is success', async () => {
    generateHashMock.mockReturnValue(newHashMock);
    const pinKeyValuesUpdated: IPinKeyValues = {
      pinHash: newHashMock,
      accountKey: 'account-key',
    };
    updatePatientAccountPinMock.mockReturnValueOnce(patientAccountPrimaryMock);

    await updatePinSuccessResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockEncryptedPin,
      pinKeyDetails,
      configurationMock,
      'v2',
      patientAccountPrimaryMock
    );

    expect(generateHash).toBeCalledWith(mockEncryptedPin);
    expect(updatePatientAccountPinMock).toBeCalledWith(
      'account-key',
      newHashMock,
      configurationMock,
      patientAccountPrimaryMock
    );
    expect(addPinKeyInRedis).toBeCalledWith(
      mockPhoneNumber,
      pinKeyValuesUpdated,
      configurationMock.redisPinKeyExpiryTime
    );
    expect(publishAccountUpdateMessageMock).toBeCalledWith({
      phoneNumber: mockPhoneNumber,
      pinHash: newHashMock,
      recentlyUpdated: true,
    });
    expect(trackUpdatePinEventMock).toBeCalledWith(mockPhoneNumber);
    expect(successResponseMock).toBeCalledWith(
      routerResponseMock,
      SuccessConstants.UPDATE_PIN_SUCCESS
    );
  });
  it('Should update pinHash and return success response if update authentication API is success', async () => {
    generateHashMock.mockReturnValue(newHashMock);

    const error = { message: 'internal error' };

    updatePatientAccountPinMock.mockImplementationOnce(() => {
      throw error;
    });

    try {
      await updatePinSuccessResponse(
        routerResponseMock,
        mockPhoneNumber,
        mockEncryptedPin,
        pinKeyDetails,
        configurationMock,
        'v2',
        patientAccountPrimaryMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(error);
    }
    expect(generateHash).toBeCalledWith(mockEncryptedPin);
    expect(updatePatientAccountPinMock).toBeCalledWith(
      'account-key',
      newHashMock,
      configurationMock,
      patientAccountPrimaryMock
    );
    expect(addPinKeyInRedis).not.toBeCalled();
    expect(publishAccountUpdateMessageMock).not.toBeCalled();
    expect(trackUpdatePinEventMock).not.toBeCalled();
    expect(successResponseMock).not.toBeCalled();
  });
});
