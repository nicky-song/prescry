// Copyright 2020 Prescryptive Health, Inc.

import { generate, parse } from 'node-webtokens';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import {
  IAccountTokenPayload,
  IAccountTokenPayloadV2,
} from '../models/account-token-payload';
import { UTCDate } from '@phx/common/src/utils/date-time-helper';

import {
  generateAccountToken,
  verifyAccountToken,
} from './account-token.helper';

jest.mock('node-webtokens');
jest.mock('@phx/common/src/utils/date-time-helper');
const token = 'mock-token';
const jwtTokenSecretKey = 'mock-key';
const dummyPayload = {
  firstName: 'fake-firstName',
  lastName: 'fake-lastName',
  version: 'v2',
} as unknown as IAccountTokenPayload;

const expiryTimeInSeconds = 1800;

const generateMock = generate as jest.Mock;
const parseMock = parse as jest.Mock;
const UTCDateMock = UTCDate as jest.Mock;

beforeEach(() => {
  generateMock.mockReset();
  generateMock.mockReturnValue('generated-token');
  parseMock.mockReset();
  UTCDateMock.mockReset();
  UTCDateMock.mockReturnValue(1585126762);
});

describe('verifyAccountToken', () => {
  it('should return error code as INVALID_ACCOUNT_TOKEN if node-webtoken is unable to parse token', () => {
    const errorMessage = 'Unable to parse token';
    parseMock.mockReturnValue({ error: { message: errorMessage } });
    expect(() => verifyAccountToken(token, jwtTokenSecretKey)).toThrow(
      ErrorAccountTokenInvalid
    );
  });

  it('should return error with error code as TOKEN_EXPIRED if token expired', () => {
    const verifyMock = jest.fn().mockReturnValue({ expired: true });
    parseMock.mockReturnValue({ verify: verifyMock });
    expect(() => verifyAccountToken(token, jwtTokenSecretKey)).toThrow(
      ErrorJsonWebTokenExpired
    );
  });

  it('should return error code as INVALID_ACCOUNT_TOKEN if unable to verify token', () => {
    const errorMessage = 'invalid token';
    const verifyMock = jest
      .fn()
      .mockReturnValue({ error: { message: errorMessage } });
    parseMock.mockReturnValue({ verify: verifyMock });

    expect(() => verifyAccountToken(token, jwtTokenSecretKey)).toThrow(
      ErrorAccountTokenInvalid
    );
  });

  it('should return verified token payload if token is valid', () => {
    const verifyMock = jest
      .fn()
      .mockReturnValue({ payload: { firstName: 'george' } });
    parseMock.mockReturnValue({ verify: verifyMock });
    const payload = verifyAccountToken(token, jwtTokenSecretKey);
    expect(verifyMock).toBeCalledWith(jwtTokenSecretKey);
    expect(payload.firstName).toEqual('george');
  });
});

describe('generateAccountToken', () => {
  it('should call generate method with payload and algorithm and return token', () => {
    const response = generateAccountToken(
      dummyPayload,
      jwtTokenSecretKey,
      expiryTimeInSeconds
    );
    expect(generateMock).toHaveBeenNthCalledWith(
      1,
      'A256KW',
      'A256GCM',
      { ...dummyPayload, exp: 1585128562, version: 'v2' },
      jwtTokenSecretKey
    );
    expect(response).toBe('generated-token');
  });

  it('should call generate method with v2 payload and algorithm and return token', () => {
    const dummyPayloadV2 = {
      patientAccountId: 'patient-account-id',
      cashMasterId: 'cash-master-id',
      phoneNumber: 'phone-number',
    } as unknown as IAccountTokenPayloadV2;

    const response = generateAccountToken(
      dummyPayloadV2,
      jwtTokenSecretKey,
      expiryTimeInSeconds
    );
    expect(generateMock).toHaveBeenNthCalledWith(
      1,
      'A256KW',
      'A256GCM',
      { ...dummyPayloadV2, exp: 1585128562 },
      jwtTokenSecretKey
    );
    expect(response).toBe('generated-token');
  });
});
