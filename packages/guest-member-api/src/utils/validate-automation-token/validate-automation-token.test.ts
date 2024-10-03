// Copyright 2021 Prescryptive Health, Inc.

import { Response, Request } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import {
  validateAutomationToken,
  checkIfPhoneNumberAndNameIsValid,
  verifyJsonAutomationToken,
} from './validate-automation-token';
import { IConfiguration } from '../../configuration';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { ErrorDeviceTokenInvalid } from '@phx/common/src/errors/error-device-token-invalid';
import { logger } from '../server-helper';

const configurationMock = {
  childMemberAgeLimit: 13,
  jwtTokenExpiryTime: 1800,
  jwtTokenSecretKey: 'LF0RA4WB9w8HuxGFaYKXu1I4EKNplXW8',
  redisPhoneNumberRegistrationKeyExpiryTime: 1800,
  twilioVerificationServiceId: 'mock-serviceId',
} as IConfiguration;

const requestMock = {
  headers: {
    authorization: 'token',
  },
} as Request;

const statusFunctionMock = jest.fn();
const headerMock = jest.fn();
const responseMock = {
  header: headerMock,
  status: statusFunctionMock,
  locals: {},
} as unknown as Response;

jest.mock('jsonwebtoken', () => ({
  TokenExpiredError: jest.fn(),
  sign: jest.fn(),
  verify: jest.fn(),
}));
const verifyMock = verify as jest.Mock;
const mockToken = 'token';
const mockSecretKey = 'secret-key';

const mockLoggerInfo = jest.fn();
const mockLoggerError = jest.fn();
jest.mock('../server-helper', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));
logger.info = mockLoggerInfo;
logger.error = mockLoggerError;

jest.mock('../app-insight-helper', () => ({
  logTelemetryException: jest.fn(),
}));
const phoneNumberMock = 'X1111111111';
const automationUserName = 'AUTOMATION_USER';
const automationCode = '123456';

describe('validateAutomationToken', () => {
  it('should return false, since automationToken is not passed', () => {
    const validateAutomation = validateAutomationToken(
      requestMock,
      responseMock,
      configurationMock,
      phoneNumberMock
    );
    expect(validateAutomation).toEqual({ status: false });
  });

  it('should return true since token is send', () => {
    const automationTokenMock = 'fake_automation_token';
    requestMock.headers = {
      'x-prescryptive-automation-token': automationTokenMock,
    };
    verifyMock.mockReset();
    verifyMock.mockImplementation(() => {
      return {
        phoneNumber: phoneNumberMock,
        code: automationCode,
        name: automationUserName,
      };
    });
    const validateAutomation = validateAutomationToken(
      requestMock,
      responseMock,
      configurationMock,
      phoneNumberMock
    );
    expect(validateAutomation).toEqual({ status: true });
  });

  it('should return success response with payload if token verified successfully', () => {
    verifyMock.mockReset();
    verifyMock.mockImplementation(() => {
      return {
        automationToken: 'fake-token',
      };
    });
    const result = verifyJsonAutomationToken(mockToken, mockSecretKey);
    expect(verifyMock).toHaveBeenNthCalledWith(1, mockToken, mockSecretKey);
    expect(result).toEqual({
      automationToken: 'fake-token',
    });
  });

  it('should return TOKEN_EXPIRED error if token is expired', () => {
    verifyMock.mockImplementation(() => {
      throw new TokenExpiredError('Token Expired', new Date());
    });

    expect(() => verifyJsonAutomationToken(mockToken, mockSecretKey)).toThrow(
      ErrorJsonWebTokenExpired
    );
    expect(verifyMock).toHaveBeenNthCalledWith(1, mockToken, mockSecretKey);
  });

  it('should return INVALID_TOKEN error if token verification failed', () => {
    verifyMock.mockImplementation(() => {
      throw new Error('Invalid Token');
    });
    expect(() => verifyJsonAutomationToken(mockToken, mockSecretKey)).toThrow(
      ErrorDeviceTokenInvalid
    );
    expect(verifyMock).toHaveBeenNthCalledWith(1, mockToken, mockSecretKey);
  });

  it('should return true on calling checkIfPhoneNumberAndNameIsValid', () => {
    const validateAutomation = checkIfPhoneNumberAndNameIsValid(
      phoneNumberMock,
      automationUserName
    );
    expect(validateAutomation).toEqual(true);
  });
});
