// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  addPinKeyInRedis,
  getAccountCreationDataFromRedis,
} from '../../../databases/redis/redis-query-helper';
import { generateHash } from '../../../utils/bcryptjs-helper';
import { trackAddPinEvent } from '../../../utils/custom-event-helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { generateAccountToken } from '../../../utils/account-token.helper';
import { getPersonIdentifiers } from '../helpers/get-person-identifiers.helper';
import { addPinHandler } from './add-pin.handler';

const configurationMock = {
  accountTokenExpiryTime: 1800,
  jwtTokenSecretKey: 'LF0RA4WB9w8HuxGFaYKXu1I4EKNplXW8',
  maxPinVerificationAttempts: 5,
} as IConfiguration;

const databaseMock = {} as IDatabase;
const mockPhoneNumber = 'fake-phone';
const requestMock = {
  body: {
    encryptedPin: 'encryptedPin',
  },
} as Request;

const routerResponseMock = {
  locals: {
    device: {
      data: mockPhoneNumber,
      identifier: 'id-1',
      type: 'phone',
    },
    deviceKeyRedis: 'deviceKey',
  },
} as unknown as Response;

jest.mock('../../../utils/bcryptjs-helper');
jest.mock('../../../utils/service-bus/account-update-helper');
jest.mock('../../../utils/account-token.helper');
jest.mock('../../../utils/response-helper');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);
jest.mock('../../../utils/custom-event-helper');
jest.mock('../../../databases/redis/redis-query-helper');
jest.mock('../helpers/get-person-identifiers.helper');

const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownResponseMock = UnknownFailureResponse as jest.Mock;
const generateHashMock = generateHash as jest.Mock;
const addPinKeyInRedisMock = addPinKeyInRedis as jest.Mock;
const getAccountCreationDataFromRedisMock =
  getAccountCreationDataFromRedis as jest.Mock;
const getPersonIdentifiersMock = getPersonIdentifiers as jest.Mock;
const generateAccountTokenMock = generateAccountToken as jest.Mock;
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;
const trackAddPinEventMock = trackAddPinEvent as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  generateAccountTokenMock.mockReturnValue('token');
});

describe('addPinHandler', () => {
  it('should call searchAccountByPhoneNumber and return error if dateOfBirth is not present in db as well as in redis (accoutn registration not complete)', async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce({
      phoneNumber: mockPhoneNumber,
    });
    getAccountCreationDataFromRedisMock.mockReturnValueOnce(undefined);

    await addPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(searchAccountByPhoneNumberMock).toHaveBeenCalled();
    expect(getAccountCreationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(searchAccountByPhoneNumberMock).toHaveBeenCalledWith(
      databaseMock,
      mockPhoneNumber
    );
    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.PHONE_NUMBER_MISSING
    );
  });
  it('should use data from redis if dateOfBirth is not present in db but present in redis', async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce({
      phoneNumber: mockPhoneNumber,
      _id: 'id',
    });
    getAccountCreationDataFromRedisMock.mockReturnValueOnce({
      phoneNumber: mockPhoneNumber,
      dateOfBirth: 'dob',
      firstName: 'fname',
      lastName: 'lname',
    });
    generateHashMock.mockReturnValueOnce('newPinHash');
    const mockPersonIdentifiers = ['identifier1', 'identifier2'];
    getPersonIdentifiersMock.mockReturnValueOnce(mockPersonIdentifiers);
    await addPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(searchAccountByPhoneNumberMock).toHaveBeenCalled();
    expect(getAccountCreationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(searchAccountByPhoneNumberMock).toHaveBeenCalledWith(
      databaseMock,
      mockPhoneNumber
    );
    expect(generateHashMock).toBeCalledWith(requestMock.body.encryptedPin);
    expect(addPinKeyInRedisMock).toBeCalledWith(
      mockPhoneNumber,
      {
        firstName: 'fname',
        lastName: 'lname',
        dateOfBirth: 'dob',
        pinHash: 'newPinHash',
        accountKey: 'deviceKey',
        _id: 'id',
      },
      configurationMock.redisPinKeyExpiryTime
    );
    expect(getPersonIdentifiersMock).toBeCalledWith(
      mockPhoneNumber,
      databaseMock
    );
    expect(generateAccountTokenMock).toBeCalledWith(
      {
        firstName: 'fname',
        identifier: 'id',
        lastName: 'lname',
        phoneNumber: mockPhoneNumber,
        membershipIdentifiers: mockPersonIdentifiers,
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.accountTokenExpiryTime
    );
    expect(publishAccountUpdateMessageMock).toHaveBeenCalledWith({
      accountKey: 'deviceKey',
      phoneNumber: mockPhoneNumber,
      pinHash: 'newPinHash',
      recentlyUpdated: true,
    });
    expect(trackAddPinEventMock).toHaveBeenCalledWith('id');
    expect(successResponseMock).toBeCalledWith(
      routerResponseMock,
      SuccessConstants.ADD_PIN_SUCCESS,
      { accountToken: 'token' }
    );
  });
  it('should call searchAccountByPhoneNumber and return error if PIN already present', async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce({
      phoneNumber: mockPhoneNumber,
      dateOfBirth: 'dob',
      accountKey: 'deviceKey',
      pinHash: 'pinHash',
    });
    await addPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(getAccountCreationDataFromRedisMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.PIN_ALREADY_SET
    );
  });

  it('should add pin message to service bus and generated account token if no error', async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce({
      phoneNumber: mockPhoneNumber,
      dateOfBirth: 'dob',
      firstName: 'fname',
      lastName: 'lname',
      _id: 'id',
    });
    generateHashMock.mockReturnValueOnce('newPinHash');
    const mockPersonIdentifiers = ['identifier1', 'identifier2'];
    getPersonIdentifiersMock.mockReturnValueOnce(mockPersonIdentifiers);
    await addPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );

    expect(getAccountCreationDataFromRedisMock).not.toHaveBeenCalled();
    expect(generateHashMock).toBeCalledTimes(1);
    expect(generateHashMock).toBeCalledWith(requestMock.body.encryptedPin);
    expect(addPinKeyInRedisMock).toBeCalledWith(
      mockPhoneNumber,
      {
        firstName: 'fname',
        lastName: 'lname',
        dateOfBirth: 'dob',
        pinHash: 'newPinHash',
        accountKey: 'deviceKey',
        _id: 'id',
      },
      configurationMock.redisPinKeyExpiryTime
    );
    expect(getPersonIdentifiersMock).toBeCalledWith(
      mockPhoneNumber,
      databaseMock
    );
    expect(generateAccountTokenMock).toBeCalledWith(
      {
        firstName: 'fname',
        identifier: 'id',
        lastName: 'lname',
        phoneNumber: mockPhoneNumber,
        membershipIdentifiers: mockPersonIdentifiers,
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.accountTokenExpiryTime
    );
    expect(publishAccountUpdateMessageMock).toHaveBeenCalledWith({
      accountKey: 'deviceKey',
      phoneNumber: mockPhoneNumber,
      pinHash: 'newPinHash',
      recentlyUpdated: true,
    });
    expect(trackAddPinEventMock).toHaveBeenCalledWith('id');
    expect(successResponseMock).toBeCalledWith(
      routerResponseMock,
      SuccessConstants.ADD_PIN_SUCCESS,
      { accountToken: 'token' }
    );
  });
  it('should call UnknownFailureResponse if exception occured', async () => {
    const error = { message: 'internal error' };
    searchAccountByPhoneNumberMock.mockImplementation(() => {
      throw error;
    });
    await addPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(unknownResponseMock).toHaveBeenCalled();
    expect(unknownResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
