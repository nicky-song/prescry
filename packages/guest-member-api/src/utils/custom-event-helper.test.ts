// Copyright 2018 Prescryptive Health, Inc.

import { logTelemetryEvent } from './app-insight-helper';
import {
  logExternalApiRequestBody,
  logRedisEventInAppInsight,
  trackAddPinEvent,
  trackIdentityVerificationFailedEvent,
  trackIdentityVerificationLockedEvent,
  trackInvalidData,
  trackMissingData,
  trackNewPhoneNumberRegistrationEvent,
  trackPhoneNumberAssignedToMultipleMembers,
  trackPhoneNumberWithMaxAttemptsReachedEvent,
  trackPinResetLockedEvent,
  trackPinVerificationFailedEvent,
  trackProviderLocationDetailsFailureEvent,
  trackRegistrationFailureEvent,
  trackSessionLockedEvent,
  trackUnsupportedPhoneNumberEvent,
  trackUpdatePinEvent,
  trackUserLoginMechanism,
  trackActivationPersonFailureEvent,
} from './custom-event-helper';

jest.mock('./app-insight-helper', () => ({
  logTelemetryEvent: jest.fn(),
  logTelemetryException: jest.fn(),
}));

const logTelemetryEventMock = logTelemetryEvent as jest.Mock;

beforeEach(() => {
  logTelemetryEventMock.mockReset();
});

describe('trackInvalidData()', () => {
  it('expect logTelemetryEvent and logTelemetryException to be called with expected properties', () => {
    expect(trackInvalidData).toBeDefined();
    trackInvalidData('MockField', 'MockRxID', 'MockCollection');
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('Invalid_MockField', {
      GuestAPI_Collection: 'MockCollection',
      GuestAPI_ErrorCode: '551',
      GuestAPI_ErrorMesage: 'Invalid "MockField" in MockCollection document',
      GuestAPI_ErrorType: 'Internal Server Error',
      GuestAPI_PrimaryMemberRxId: 'MockRxID',
    });
  });
});

describe('trackMissingData()', () => {
  it('expect logTelemetryEvent and logTelemetryException to be called with expected properties', () => {
    expect(trackMissingData).toBeDefined();
    trackMissingData('MockField', 'MockRxID', 'MockCollection');
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('Missing_MockField', {
      GuestAPI_Collection: 'MockCollection',
      GuestAPI_ErrorCode: '551',
      GuestAPI_ErrorMesage: 'Missing "MockField" in MockCollection document',
      GuestAPI_ErrorType: 'Internal Server Error',
      GuestAPI_PrimaryMemberRxId: 'MockRxID',
    });
  });
});

describe('trackUserLoginMechanism()', () => {
  it('expect logTelemetryEvent to be called with expected properties', () => {
    expect(trackUserLoginMechanism).toBeDefined();
    const loginType = 'PrimaryMemberRxId';
    const primaryRxId = 'MockRxID';
    trackUserLoginMechanism(loginType, primaryRxId);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('Login', {
      GuestAPI_Login_Type: loginType,
      GuestAPI_PrimaryMemberRxId: primaryRxId,
    });
  });
});

describe('logRedisEventInAppInsights()', () => {
  it('expect logTelemetryEvent to be called with expected properties', () => {
    expect(logRedisEventInAppInsight).toBeDefined();
    const hostName = 'redisHost';
    const port = 3000;
    const message = 'message';
    logRedisEventInAppInsight(
      'REDIS_CONNECTION_REFUSED',
      hostName,
      port,
      message
    );
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('REDIS_CONNECTION_REFUSED', {
      hostName,
      message,
      port: `${port}`,
    });
  });
});
describe('trackAddPinEvent()', () => {
  it('expect logTelemetryEvent to be called with `PIN_ADDED_SUCCESSFULLY` as key and expected identifier in properties', () => {
    const identifier = 'identifier';
    trackAddPinEvent(identifier);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('PIN_ADDED_SUCCESSFULLY', {
      GuestAPI_Identifier: identifier,
    });
  });
});

describe('trackUpdatePinEvent()', () => {
  it('expect logTelemetryEvent to be called with `PIN_UPDATED_SUCCESSFULLY` as key and expected identifier in properties', () => {
    const identifier = 'identifier';
    trackUpdatePinEvent(identifier);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('PIN_UPDATED_SUCCESSFULLY', {
      GuestAPI_Identifier: identifier,
    });
  });
});

describe('trackPinVerificationFailedEvent()', () => {
  it('expect logTelemetryEvent to be called with `PIN_VERIFICATION_FAILED` as key and expected phone number and attempt in properties', () => {
    const phoneNumber = 'mock-phone-number';
    const attempt = 3;
    trackPinVerificationFailedEvent(phoneNumber, attempt);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('PIN_VERIFICATION_FAILED', {
      GuestAPI_PhoneNumber: phoneNumber,
      GuestAPI_Pin_Verification_Failed_Attempt: '3',
    });
  });
});

describe('trackSessionLockedEvent()', () => {
  it('expect logTelemetryEvent to be called with `SESSION_LOCKED` as key and expected phone number in properties', () => {
    const phoneNumber = 'mock-phone-number';
    trackSessionLockedEvent(phoneNumber);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('SESSION_LOCKED', {
      GuestAPI_PhoneNumber: phoneNumber,
    });
  });
});

describe('trackIdentityVerificationFailedEvent()', () => {
  it('expect logTelemetryEvent to be called with `PIN_RESET_IDENTITY_VERIFICATION_FAILED` as key and expected phone number and attempt in properties', () => {
    const phoneNumber = 'mock-phone-number';
    const attempt = 3;
    trackIdentityVerificationFailedEvent(phoneNumber, attempt);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith(
      'PIN_RESET_IDENTITY_VERIFICATION_FAILED',
      {
        GuestAPI_PhoneNumber: phoneNumber,
        GuestAPI_Identity_Verification_Failed_Attempt: '3',
      }
    );
  });
});

describe('trackIdentityVerificationLockedEvent()', () => {
  it('expect logTelemetryEvent to be called with `PIN_RESET_IDENTITY_VERIFICATION_LOCKED` as key and expected phone number in properties', () => {
    const phoneNumber = 'mock-phone-number';
    trackIdentityVerificationLockedEvent(phoneNumber);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith(
      'PIN_RESET_IDENTITY_VERIFICATION_LOCKED',
      {
        GuestAPI_PhoneNumber: phoneNumber,
      }
    );
  });
});

describe('trackUnsupportedPhoneNumberEvent()', () => {
  it('expect logTelemetryEvent to be called with `UNSUPPORTED_PHONE_NUMBER` as key and expected phoneNumber in properties', () => {
    const phoneNumber = 'mock-phone-number';
    trackUnsupportedPhoneNumberEvent(phoneNumber);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('UNSUPPORTED_PHONE_NUMBER', {
      GuestAPI_PhoneNumber: phoneNumber,
    });
  });
});

describe('trackPhoneNumberWithMaxAttemptsReachedEvent()', () => {
  it('expect logTelemetryEvent to be called with `PHONE_VERIFICATION_MAX_ATTEMPTS_REACHED` as key and expected phoneNumber in properties', () => {
    const phoneNumber = 'mock-phone-number';
    trackPhoneNumberWithMaxAttemptsReachedEvent(phoneNumber);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith(
      'PHONE_VERIFICATION_MAX_ATTEMPTS_REACHED',
      {
        GuestAPI_PhoneNumber: phoneNumber,
      }
    );
  });
});

describe('trackNewPhoneNumberRegistrationEvent()', () => {
  it('expect logTelemetryEvent to be called with `PHONE_NUMBER_REGISTRATION` as key and expected phoneNumber and identifier in properties', () => {
    const phoneNumber = 'mock-phone-number';
    const identifier = 'identifier';
    trackNewPhoneNumberRegistrationEvent(phoneNumber, identifier);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('PHONE_NUMBER_REGISTRATION', {
      GuestAPI_Identifier: identifier,
      GuestAPI_PhoneNumber: phoneNumber,
    });
  });
});

describe('trackPhoneNumberAssignedToMultipleMembers()', () => {
  it('expect logTelemetryEvent to be called with `PHONE_NUMBER_WITH_MULTIPLE_MEMBERS` as key and expected phoneNumber and identifier in properties', () => {
    const phoneNumber = 'mock-phone-number';
    const identifiers = ['identifier1', 'identifier2'];
    trackPhoneNumberAssignedToMultipleMembers(phoneNumber, identifiers);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith(
      'MEMBERS_WITH_SAME_PHONE_NUMBER',
      {
        GuestAPI_Identifiers: 'identifier1,identifier2',
        GuestAPI_PhoneNumber: phoneNumber,
      }
    );
  });
});

describe('trackRegistrationFailureEvent()', () => {
  it('expect logTelemetryEvent to be called with expected properties', () => {
    expect(trackRegistrationFailureEvent).toBeDefined();
    const failureType = 'InvalidMemberRxId';
    const dateOfBirth = '01-05-2000';
    const firstName = 'John';
    const lastName = 'Doe';
    const primaryMemberRxId = 'MockRxID';
    trackRegistrationFailureEvent(
      failureType,
      firstName,
      lastName,
      primaryMemberRxId,
      dateOfBirth
    );
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('REGISTRATION_FAILURE', {
      failureType,
      firstName,
      lastName,
      primaryMemberRxId,
      dateOfBirth,
    });
  });
});

describe('trackPinResetLockedEvent()', () => {
  it('expect logTelemetryEvent to be called with `PIN_RESET_LOCKED` as key and expected phone number in properties', () => {
    const phoneNumber = 'mock-phone-number';
    trackPinResetLockedEvent(phoneNumber);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('PIN_RESET_LOCKED', {
      GuestAPI_PhoneNumber: phoneNumber,
    });
  });
});

describe('trackProviderLocationDetailsFailureEvent', () => {
  it('expects logTelemetryEvent to be called with GET_PROVIDER_LOCATION_DETAILS_FAILURE as key and expected data in the properties', () => {
    const serviceType = 'COVID-19 Test';
    const error = 'test-message';
    const dateOfBirth = '01-01-2000';

    trackProviderLocationDetailsFailureEvent(serviceType, error, dateOfBirth);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith(
      'GET_PROVIDER_LOCATION_DETAILS_FAILURE',
      {
        serviceType,
        dateOfBirth,
        error,
      }
    );
  });
});

describe('logExternalApiRequestBody', () => {
  it('expects logTelemetryEvent to be called with request body and request url ', () => {
    const apiUrl = 'api-url';
    const body = 'req-body';

    logExternalApiRequestBody(apiUrl, body);
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith(
      'EXTERNAL_API_REQUEST_api-url',
      {
        body,
        apiUrl,
      }
    );
  });
});
describe('trackActivationPersonFailureEvent()', () => {
  it('expect logTelemetryEvent to be called with DataMismatch failureType and all required properties', () => {
    const phoneNumber = 'mock-phone-number';
    const eventName = 'LOGIN_CLAIM_ALERT_FAILURE';
    const id = 'claim-alert-id';
    const activationFirstName = 'activation-record-first-name';
    const activationDOB = '2000-01-01';
    const firstName = 'user-entered-first-name';
    const dob = 'user-entered-dob';

    trackActivationPersonFailureEvent(
      eventName,
      activationFirstName,
      activationDOB,
      phoneNumber,
      firstName,
      dob,
      id
    );
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith(eventName, {
      failureType: 'DataMismatch',
      activationFirstName,
      activationDOB,
      firstName,
      dob,
      phoneNumber,
      id,
    });
  });
});
