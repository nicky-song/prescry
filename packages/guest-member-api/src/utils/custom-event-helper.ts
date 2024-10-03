// Copyright 2018 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import { logTelemetryEvent } from './app-insight-helper';
import { RedisTelemetryKeys } from './redis/redis.helper';

export function trackInvalidData(
  field: string,
  primaryMemberRxId: string,
  collectionName: string
) {
  const message = `Invalid "${field}" in ${collectionName} document`;

  logTelemetryEvent(`Invalid_${field}`, {
    GuestAPI_Collection: collectionName,
    GuestAPI_ErrorCode: HttpStatusCodes.SERVER_DATA_ERROR.toString(),
    GuestAPI_ErrorMesage: message,
    GuestAPI_ErrorType: ErrorConstants.INTERNAL_SERVER_ERROR,
    GuestAPI_PrimaryMemberRxId: primaryMemberRxId,
  });
}

export function trackMissingData(
  field: string,
  primaryMemberRxId: string,
  collectionName: string
) {
  const message = `Missing "${field}" in ${collectionName} document`;

  logTelemetryEvent(`Missing_${field}`, {
    GuestAPI_Collection: collectionName,
    GuestAPI_ErrorCode: HttpStatusCodes.SERVER_DATA_ERROR.toString(),
    GuestAPI_ErrorMesage: message,
    GuestAPI_ErrorType: ErrorConstants.INTERNAL_SERVER_ERROR,
    GuestAPI_PrimaryMemberRxId: primaryMemberRxId,
  });
}

export function trackUserLoginMechanism(
  loginType: 'PrimaryMemberRxId' | 'FamilyId',
  primaryMemberRxId: string
) {
  logTelemetryEvent(`Login`, {
    GuestAPI_Login_Type: loginType,
    GuestAPI_PrimaryMemberRxId: primaryMemberRxId,
  });
}

export const logRedisEventInAppInsight = (
  event: RedisTelemetryKeys,
  hostName: string,
  port: number,
  message: string
) => {
  logTelemetryEvent(event, {
    hostName,
    message,
    port: `${port}`,
  });
};

export const trackAddPinEvent = (identifier: string) => {
  logTelemetryEvent(`PIN_ADDED_SUCCESSFULLY`, {
    GuestAPI_Identifier: identifier,
  });
};

export const trackUpdatePinEvent = (identifier: string) => {
  logTelemetryEvent(`PIN_UPDATED_SUCCESSFULLY`, {
    GuestAPI_Identifier: identifier,
  });
};

export const trackPinVerificationFailedEvent = (
  phoneNumber: string,
  attempt: number
) => {
  logTelemetryEvent(`PIN_VERIFICATION_FAILED`, {
    GuestAPI_PhoneNumber: phoneNumber,
    GuestAPI_Pin_Verification_Failed_Attempt: `${attempt}`,
  });
};

export const trackIdentityVerificationFailedEvent = (
  phoneNumber: string,
  attempt: number
) => {
  logTelemetryEvent(`PIN_RESET_IDENTITY_VERIFICATION_FAILED`, {
    GuestAPI_PhoneNumber: phoneNumber,
    GuestAPI_Identity_Verification_Failed_Attempt: `${attempt}`,
  });
};

export const trackIdentityVerificationLockedEvent = (phoneNumber: string) => {
  logTelemetryEvent(`PIN_RESET_IDENTITY_VERIFICATION_LOCKED`, {
    GuestAPI_PhoneNumber: phoneNumber,
  });
};

export const trackPinResetLockedEvent = (phoneNumber: string) => {
  logTelemetryEvent(`PIN_RESET_LOCKED`, {
    GuestAPI_PhoneNumber: phoneNumber,
  });
};
export const trackSessionLockedEvent = (phoneNumber: string) => {
  logTelemetryEvent(`SESSION_LOCKED`, {
    GuestAPI_PhoneNumber: phoneNumber,
  });
};

export const trackUnsupportedPhoneNumberEvent = (phoneNumber: string) => {
  logTelemetryEvent(`UNSUPPORTED_PHONE_NUMBER`, {
    GuestAPI_PhoneNumber: phoneNumber,
  });
};

export const trackPhoneNumberWithMaxAttemptsReachedEvent = (
  phoneNumber: string
) => {
  logTelemetryEvent(`PHONE_VERIFICATION_MAX_ATTEMPTS_REACHED`, {
    GuestAPI_PhoneNumber: phoneNumber,
  });
};

export const trackNewPhoneNumberRegistrationEvent = (
  phoneNumber: string,
  identifier: string
) => {
  logTelemetryEvent(`PHONE_NUMBER_REGISTRATION`, {
    GuestAPI_Identifier: identifier,
    GuestAPI_PhoneNumber: phoneNumber,
  });
};

export const trackPhoneNumberAssignedToMultipleMembers = (
  phoneNumber: string,
  identifiers: string[]
) => {
  logTelemetryEvent(`MEMBERS_WITH_SAME_PHONE_NUMBER`, {
    GuestAPI_Identifiers: identifiers.toString(),
    GuestAPI_PhoneNumber: phoneNumber,
  });
};

export function trackRegistrationFailureEvent(
  failureType: 'InvalidMemberRxId' | 'InvalidMemberDetails' | 'ChildMember',
  firstName: string,
  lastName: string,
  primaryMemberRxId: string,
  dateOfBirth: string
) {
  logTelemetryEvent('REGISTRATION_FAILURE', {
    failureType,
    firstName,
    lastName,
    primaryMemberRxId,
    dateOfBirth,
  });
}

export function trackActivationPersonFailureEvent(
  eventName: string,
  activationFirstName: string,
  activationDOB: string,
  phoneNumber: string,
  firstName: string,
  dob: string,
  id?: string
) {
  logTelemetryEvent(eventName, {
    failureType: 'DataMismatch',
    activationFirstName,
    activationDOB,
    firstName,
    dob,
    phoneNumber,
    id,
  });
}

export const trackProviderLocationDetailsFailureEvent = (
  serviceType: string,
  error: string,
  dateOfBirth?: string
) => {
  logTelemetryEvent('GET_PROVIDER_LOCATION_DETAILS_FAILURE', {
    serviceType,
    dateOfBirth,
    error,
  });
};

export const logExternalApiRequestBody = (apiUrl: string, body: string) => {
  logTelemetryEvent(`EXTERNAL_API_REQUEST_${apiUrl}`, {
    body,
    apiUrl,
  });
};
