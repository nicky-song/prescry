// Copyright 2018 Prescryptive Health, Inc.

import {
  HttpStatusCodes,
  InternalErrorCode,
  InternalResponseCode,
  TwilioErrorCodes,
} from './error-codes';

describe('Http Status Codes', () => {
  it('should have BAD_REQUEST to be 400', () => {
    expect(HttpStatusCodes.BAD_REQUEST).toBe(400);
  });

  it('should have FORBIDDEN_ERROR to be 403', () => {
    expect(HttpStatusCodes.FORBIDDEN_ERROR).toBe(403);
  });

  it('should have INTERNAL_SERVER_ERROR to be 500', () => {
    expect(HttpStatusCodes.INTERNAL_SERVER_ERROR).toBe(500);
  });

  it('should have NOT_FOUND to be 404', () => {
    expect(HttpStatusCodes.NOT_FOUND).toBe(404);
  });

  it('should have SERVER_DATA_ERROR to be 551', () => {
    expect(HttpStatusCodes.SERVER_DATA_ERROR).toBe(551);
  });

  it('should have SUCCESS to be 200', () => {
    expect(HttpStatusCodes.SUCCESS).toBe(200);
  });

  it('should have TOO_MANY_REQUESTS to be 429', () => {
    expect(HttpStatusCodes.TOO_MANY_REQUESTS).toBe(429);
  });

  it('should have UNAUTHORIZED_REQUEST to be 401', () => {
    expect(HttpStatusCodes.UNAUTHORIZED_REQUEST).toBe(401);
  });
});

describe('Twilio Error Codes', () => {
  it('should have MAX_SEND_ATTEMPTS_REACHED to be 60203', () => {
    expect(TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED).toBe(60203);
  });

  it('should have MAX_VERIFICATION_CHECK_ATTEMPTS_REACHED to be 60202', () => {
    expect(TwilioErrorCodes.MAX_VERIFICATION_CHECK_ATTEMPTS_REACHED).toBe(
      60202
    );
  });

  it('should have INVALID_PARAMETER to be 60200', () => {
    expect(TwilioErrorCodes.INVALID_PARAMETER).toBe(60200);
  });

  it('should have PERMISSION_DENIED to be 20003', () => {
    expect(TwilioErrorCodes.PERMISSION_DENIED).toBe(20003);
  });
});

describe('InternalErrorCode', () => {
  it('should have UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED to be 1001', () => {
    expect(InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED).toBe(
      1001
    );
  });
  it('should have INVALID_DEVICE_TOKEN to be 2005', () => {
    expect(InternalErrorCode.INVALID_DEVICE_TOKEN).toBe(2005);
  });
  it('should have TOKEN_EXPIRED to be 2004', () => {
    expect(InternalErrorCode.TOKEN_EXPIRED).toBe(2004);
  });
  it('should have SHOW_FORGET_PIN to be 2007', () => {
    expect(InternalErrorCode.SHOW_FORGET_PIN).toBe(2007);
  });
  it('should have INVALID_ACCOUNT_TOKEN to be 2007', () => {
    expect(InternalErrorCode.INVALID_ACCOUNT_TOKEN).toBe(2008);
  });
});

describe('InternalResponseCode', () => {
  it('should have INVALID_PHONE_NUMBER to be 1003', () => {
    expect(InternalResponseCode.INVALID_PHONE_NUMBER).toBe(1003);
  });

  it('should have PHONE_NUMBER_MISSING to be 1002', () => {
    expect(InternalResponseCode.PHONE_NUMBER_MISSING).toBe(1002);
  });

  it('should have SHOULD_SHOW_PHONE_NUMBER_MISSING to be 2006', () => {
    expect(InternalResponseCode.SHOULD_SHOW_PHONE_NUMBER_MISSING).toBe(2006);
  });

  it('should have REQUIRE_USER_SET_PIN to be 2001', () => {
    expect(InternalResponseCode.REQUIRE_USER_SET_PIN).toBe(2001);
  });

  it('should have REQUIRE_USER_VERIFY_PIN to be 2002', () => {
    expect(InternalResponseCode.REQUIRE_USER_VERIFY_PIN).toBe(2002);
  });

  it('should have REQUIRE_USER_REGISTRATION to be 2003', () => {
    expect(InternalResponseCode.REQUIRE_USER_REGISTRATION).toBe(2003);
  });

  it('should have USE_ANOTHER_PIN to be 2009', () => {
    expect(InternalResponseCode.USE_ANOTHER_PIN).toBe(2009);
  });
});
