// Copyright 2018 Prescryptive Health, Inc.

import { Twilio } from 'twilio';
import {
  sendOneTimePassword,
  sendOneTimeCodeToEmail,
  verifyOneTimePassword,
} from './twilio-helper';

const mockServiceId = 'serviceId';
const mockPhoneNumber = '+911234567890';

const mockCode = '123456';

const mockCreate = jest.fn();
const mockServices = jest.fn();

const mockVerifier = {
  verificationChecks: {
    create: mockCreate,
  },
  verifications: {
    create: mockCreate,
  },
};

const mockTwilioClient = {
  verify: {
    services: mockServices,
  },
} as unknown as Twilio;

beforeEach(() => {
  mockServices.mockReset();
  mockServices.mockReturnValue(mockVerifier);
  mockCreate.mockReset();
});

describe('sendOneTimePassword()', () => {
  it('sendOneTimePassword() should be defined', () => {
    expect(sendOneTimePassword).toBeDefined();
  });

  it('should calls services() with service id', async () => {
    await sendOneTimePassword(mockTwilioClient, mockServiceId, mockPhoneNumber);
    expect(mockServices).toBeCalledTimes(1);
    expect(mockServices).toBeCalledWith(mockServiceId);
  });

  it('should calls create() with phone number and channel as sms', async () => {
    await sendOneTimePassword(mockTwilioClient, mockServiceId, mockPhoneNumber);
    expect(mockCreate).toBeCalledTimes(1);
    expect(mockCreate).toBeCalledWith({
      channel: 'sms',
      to: mockPhoneNumber,
    });
  });
});

describe('verifyOneTimePassword()', () => {
  it('verifyOneTimePassword() should be defined', () => {
    expect(verifyOneTimePassword).toBeDefined();
  });

  it('should calls services() with service id', async () => {
    await verifyOneTimePassword(
      mockTwilioClient,
      mockServiceId,
      mockPhoneNumber,
      mockCode
    );
    expect(mockServices).toBeCalledTimes(1);
    expect(mockServices).toBeCalledWith(mockServiceId);
  });

  it('should calls create() with phone number and code', async () => {
    await verifyOneTimePassword(
      mockTwilioClient,
      mockServiceId,
      mockPhoneNumber,
      mockCode
    );
    expect(mockCreate).toBeCalledTimes(1);
    expect(mockCreate).toBeCalledWith({
      code: mockCode,
      to: mockPhoneNumber,
    });
  });
});

describe('sendOneTimeCodeToEmail()', () => {
  const mockEmail = 'test@test.com';
  it('sendOneTimeCodeToEmail() should be defined', () => {
    expect(sendOneTimeCodeToEmail).toBeDefined();
  });

  it('should calls services() with service id', async () => {
    await sendOneTimeCodeToEmail(mockTwilioClient, mockServiceId, mockEmail);
    expect(mockServices).toBeCalledTimes(1);
    expect(mockServices).toBeCalledWith(mockServiceId);
  });

  it('should calls create() with email and channel as email', async () => {
    await sendOneTimeCodeToEmail(mockTwilioClient, mockServiceId, mockEmail);
    expect(mockCreate).toBeCalledTimes(1);
    expect(mockCreate).toBeCalledWith({
      to: mockEmail,
      channel: 'email',
    });
  });
});
