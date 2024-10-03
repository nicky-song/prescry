// Copyright 2018 Prescryptive Health, Inc.

import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { ErrorDeviceTokenInvalid } from '@phx/common/src/errors/error-device-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';
import { generateJsonWebToken, verifyJsonWebToken } from './jwt-device-helper';

jest.mock('jsonwebtoken', () => ({
  TokenExpiredError: jest.fn(),
  sign: jest.fn(),
  verify: jest.fn(),
}));

const verifyMock = verify as jest.Mock;
const signMock = sign as jest.Mock;
const mockToken = 'token';
const mockSecretKey = 'secret-key';

beforeEach(() => {
  verifyMock.mockReset();
  signMock.mockReset();
});

describe('verifyJsonWebToken', () => {
  it('should return success response with payload if token verified successfully', () => {
    verifyMock.mockImplementation(() => {
      return {
        device: encodeAscii('cryptoPhone'),
      };
    });
    const result = verifyJsonWebToken(mockToken, mockSecretKey);
    expect(verifyMock).toHaveBeenNthCalledWith(1, mockToken, mockSecretKey);
    expect(result.device).toEqual('cryptoPhone');
  });

  it('should return TOKEN_EXPIRED error if token is expired', () => {
    verifyMock.mockImplementation(() => {
      throw new TokenExpiredError('Token Expired', new Date());
    });

    expect(() => verifyJsonWebToken(mockToken, mockSecretKey)).toThrow(
      ErrorJsonWebTokenExpired
    );
    expect(verifyMock).toHaveBeenNthCalledWith(1, mockToken, mockSecretKey);
  });

  it('should return INVALID_TOKEN error if token verification failed', () => {
    verifyMock.mockImplementation(() => {
      throw new Error('Invalid Token');
    });
    expect(() => verifyJsonWebToken(mockToken, mockSecretKey)).toThrow(
      ErrorDeviceTokenInvalid
    );
    expect(verifyMock).toHaveBeenNthCalledWith(1, mockToken, mockSecretKey);
  });
});

describe('generateJsonWebToken', () => {
  const payload = {
    device: 'mock-phoneNumber',
    deviceIdentifier: 'id-1',
    deviceKey: 'some-key',
    deviceType: 'phone',
  };
  const payloadWithPatientAccountId = {
    device: 'mock-phoneNumber',
    deviceIdentifier: 'id-1',
    deviceKey: 'some-key',
    deviceType: 'phone',
    patientAccountId: 'account-id1',
  };
  const expiryTimeInSeconds = 1800;

  it('should return jwt token without patientAccountId if not passed', () => {
    signMock.mockImplementation(() => 'jwt-token');
    generateJsonWebToken(payload, mockSecretKey, expiryTimeInSeconds);
    expect(signMock).toHaveBeenNthCalledWith(
      1,
      {
        device: 'bW9jay1waG9uZU51bWJlcg==',
        deviceIdentifier: 'id-1',
        deviceKey: 'some-key',
        deviceType: 'phone',
      },
      mockSecretKey,
      { expiresIn: expiryTimeInSeconds }
    );
  });
  it('should return jwt token with patientAccountId if passed', () => {
    signMock.mockImplementation(() => 'jwt-token');
    generateJsonWebToken(
      payloadWithPatientAccountId,
      mockSecretKey,
      expiryTimeInSeconds
    );
    expect(signMock).toHaveBeenNthCalledWith(
      1,
      {
        device: 'bW9jay1waG9uZU51bWJlcg==',
        deviceIdentifier: 'id-1',
        deviceKey: 'some-key',
        deviceType: 'phone',
        patientAccountId: 'account-id1',
      },
      mockSecretKey,
      { expiresIn: expiryTimeInSeconds }
    );
  });
});
