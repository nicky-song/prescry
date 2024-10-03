// Copyright 2018 Prescryptive Health, Inc.

import { generate, parse } from 'node-webtokens';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { IJwtTokenPayload } from '../models/token-payload';
import { generateJwtToken, verifyJwtToken } from './jwt-account-helper';

jest.mock('node-webtokens', () => ({
  generate: jest.fn(),
  parse: jest.fn(),
}));

const token = 'mock-token';
const jwtTokenSecretKey = 'mock-key';
const dummyPayload = {
  firstName: 'fake-firstName',
  isPhoneNumberVerified: false,
  lastName: 'fake-lastName',
} as unknown as IJwtTokenPayload;
const currentUtcTimeInSeconds = 1585126762;
const expiryTimeInSeconds = 1800;

const generateMock = generate as jest.Mock;
const parseMock = parse as jest.Mock;

beforeEach(() => {
  generateMock.mockReset();
  generateMock.mockReturnValue('generated-token');
  parseMock.mockReset();
});

describe('verifyJwtToken', () => {
  it('should return error code as INVALID_ACCOUNT_TOKEN if node-webtoken is unable to parse token', () => {
    const errorMessage = 'Unable to parse token';
    parseMock.mockReturnValue({ error: { message: errorMessage } });
    expect(() => verifyJwtToken(token, jwtTokenSecretKey)).toThrow(
      ErrorAccountTokenInvalid
    );
  });

  it('should return error with error code as TOKEN_EXPIRED if token expired', () => {
    const verifyMock = jest.fn().mockReturnValue({ expired: true });
    parseMock.mockReturnValue({ verify: verifyMock });
    expect(() => verifyJwtToken(token, jwtTokenSecretKey)).toThrow(
      ErrorJsonWebTokenExpired
    );
  });

  it('should return error code as INVALID_ACCOUNT_TOKEN if unable to verify token', () => {
    const errorMessage = 'invalid token';
    const verifyMock = jest
      .fn()
      .mockReturnValue({ error: { message: errorMessage } });
    parseMock.mockReturnValue({ verify: verifyMock });

    expect(() => verifyJwtToken(token, jwtTokenSecretKey)).toThrow(
      ErrorAccountTokenInvalid
    );
  });

  it('should return verified token payload if token is valid', () => {
    const verifyMock = jest
      .fn()
      .mockReturnValue({ payload: { firstName: 'george' } });
    parseMock.mockReturnValue({ verify: verifyMock });
    const payload = verifyJwtToken(token, jwtTokenSecretKey);
    expect(verifyMock).toBeCalledWith(jwtTokenSecretKey);
    expect(payload.firstName).toEqual('george');
  });
});

describe('generateJwtToken', () => {
  it('should call generate method with payload and algorithm and return token', () => {
    const response = generateJwtToken(
      dummyPayload,
      jwtTokenSecretKey,
      currentUtcTimeInSeconds,
      expiryTimeInSeconds
    );
    expect(generateMock).toHaveBeenNthCalledWith(
      1,
      'A256KW',
      'A256GCM',
      { ...dummyPayload, exp: 1585128562 },
      jwtTokenSecretKey
    );
    expect(response).toBe('generated-token');
  });

  it('should update isPhoneNumberVerified and version in payload if provided in argument', () => {
    const phoneNumberVerifiedFlag = true;
    const response = generateJwtToken(
      dummyPayload,
      jwtTokenSecretKey,
      currentUtcTimeInSeconds,
      expiryTimeInSeconds,
      phoneNumberVerifiedFlag
    );
    expect(generateMock).toHaveBeenNthCalledWith(
      1,
      'A256KW',
      'A256GCM',
      {
        ...dummyPayload,
        exp: 1585128562,
        isPhoneNumberVerified: true,
      },
      jwtTokenSecretKey
    );
    expect(response).toBe('generated-token');
  });
});
