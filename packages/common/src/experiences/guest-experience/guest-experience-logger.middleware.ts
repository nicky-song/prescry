// Copyright 2018 Prescryptive Health, Inc.

import { Middleware } from 'redux';
import { setupLogger } from '../store/store-logger.middleware';
import { ICustomPropertiesForLoggingCustomEvent } from './api/ensure-api-response/ensure-api-response';
import { GuestExperienceLogService } from './guest-experience-log-service';
import { ConfigStateActionKeys } from './store/config/config-state-reducer';
import { FeaturesStateActionKeys } from './store/features/features-state.reducer';
import { MemberLoginStateActionKeys } from './store/member-login/member-login-reducer.actions';
import { PhoneNumberLoginActionsKeys } from './store/phone-number-login/phone-number-login.reducer.action';
import { PrescriptionsStateActionKeys } from './store/prescriptions/prescriptions-reducer.actions';
import { SecurePinStateActionKeys } from './store/secure-pin/secure-pin-actions';
import { SettingsActionKeys } from './store/settings/settings-reducer.actions';
import { PhoneNumberVerificationActionsKeys } from './store/phone-number-verification/actions/phone-number-verification.actions';
import { MissingAccountActionKeys } from './store/support-error/support-error.reducer.actions';
import { FeedActionKeysEnum } from './store/feed/actions/feed-action';
import { TestResultActionKeysEnum } from './store/test-result/actions/test-result-actions';
import { AppointmentActionKeysEnum } from './store/appointment/actions/appointment-action';
import { CreateBookingActionKeysEnum } from './store/appointment/actions/create-booking-action';
import { ImmunizationRecordActionKeysEnum } from './store/immunization-record/actions/immunization-record-action';
import { IdentityVerificationActionKeysEnum } from './store/identity-verification/actions/identity-verification.action';

export enum NavigationActionKeysToTrack {
  'NAVIGATION_BACK' = 'Navigation/BACK',
  'NAVIGATION_NAVIGATE' = 'Navigation/NAVIGATE',
}

export const CustomAppInsightEvents = {
  ADDING_ANOTHER_PERSON_TO_WAITLIST: 'ADDING_ANOTHER_PERSON_TO_WAITLIST',
  ADDING_PERSON_TO_WAITLIST: 'ADDING_PERSON_TO_WAITLIST',
  ALTERNATIVE_DRUG_SEARCH_ERROR: 'ALTERNATIVE_DRUG_SEARCH_ERROR',
  CHANGING_PROVIDER_SEARCH_DISTANCE: 'CHANGING_PROVIDER_SEARCH_DISTANCE',
  CLICKED_FORGOT_PIN_LINK: 'CLICKED_FORGOT_PIN_LINK',
  CLICKED_CONTINUE_VERIFY_IDENTITY_SCREEN:
    'CLICKED_CONTINUE_VERIFY_IDENTITY_SCREEN',
  CLICKED_CONTINUE_VERIFY_IDENTITY_SEND_CODE_SCREEN:
    'CLICKED_CONTINUE_VERIFY_IDENTITY_SEND_CODE_SCREEN',
  CLICKED_PIN_RESET_BUTTON: 'CLICKED_PIN_RESET_BUTTON',
  CLICKED_VERIFY_IDENTITY_RESEND_CODE_BUTTON:
    'CLICKED_VERIFY_IDENTITY_RESEND_CODE_BUTTON',
  CLICKED_VERIFY_IDENTITY_VERIFY_BUTTON:
    'CLICKED_VERIFY_IDENTITY_VERIFY_BUTTON',
  EXPAND_CONTAINER_SIZE: 'EXPANDING_CONTAINER_SIZE',
  FOLLOW_LINK: 'FOLLOW_LINK',
  PRESCRIPTION_PERSON_SELECTED: 'PRESCRIPTION_PERSON_SELECTED',
  PRESSED_JOIN_WAITLIST_BUTTON: 'PRESSED_JOIN_WAITLIST_BUTTON',
  PROFILE_NOT_UPDATED_AFTER_JOIN_EMPLOYER_PLAN:
    'PROFILE_NOT_UPDATED_AFTER_JOIN_EMPLOYER_PLAN',
  REACHED_MAX_IDENTITY_VERIFICATION_ATTEMPTS:
    'REACHED_MAX_IDENTITY_VERIFICATION_ATTEMPTS',
  REACHED_MAX_VERIFICATION_CODE_ATTEMPTS:
    'REACHED_MAX_VERIFICATION_CODE_ATTEMPTS',
  REDUCE_CONTAINER_SIZE: 'REDUCING_CONTAINER_SIZE',
  REQUESTED_VERIFICATION_CODE_MAX_ATTEMPTS:
    'REQUESTED_VERIFICATION_CODE_MAX_ATTEMPTS',
  SELECTED_WAITLIST_DISTANCE_VALUE: 'SELECTED_WAITLIST_DISTANCE_VALUE',
  SELECTED_WAITLIST_PERSON: 'SELECTED_WAITLIST_PERSON',
  SERVICE_TYPE_UNDEFINED: 'SERVICE_TYPE_UNDEFINED',
  USER_NAVIGATED_CLAIM_ALERT_SCREEN: 'USER_NAVIGATED_CLAIM_ALERT_SCREEN',
  USER_CLICKED_ON_SERVICE: 'USER_CLICKED_ON_SERVICE',
  USER_CLICKED_ON_PRESCRYPTIVE_LINK: 'USER_CLICKED_ON_PRESCRYPTIVE_LINK',
  USER_CLICKED_ON_SIDEMENU_SIGNIN: 'USER_CLICKED_ON_SIDEMENU_SIGNIN',
  USER_HAS_CLICKED_ON_DRUG_SEARCH_UNAUTH:
    'USER_HAS_CLICKED_ON_DRUG_SEARCH_UNAUTH',
  USER_SENT_CODE: 'USER_SEND_CODE',
  PRESCRIPTION_USER_SEARCHED_ZIPCODE: 'PRESCRIPTION_USER_SEARCHED_ZIPCODE',
  PRESCRIPTION_USER_LOCATION_SERVICE_USED:
    'PRESCRIPTION_USER_LOCATION_SERVICE_USED',
  PRESCRIPTION_USER_GET_PHARMACIES: 'PRESCRIPTION_USER_GET_PHARMACIES',
  PRESCRIPTION_USER_SELECTS_PHARMACY: 'PRESCRIPTION_USER_SELECTS_PHARMACY',
  PRESCRIPTION_USER_SEND_TO_PHARMACY: 'PRESCRIPTION_USER_SEND_TO_PHARMACY',
  PRESCRIPTION_USER_GET_PHARMACIES_ERROR:
    'PRESCRIPTION_USER_GET_PHARMACIES_ERROR',
  DRUG_SEARCH_USER_SELECTS_PHARMACY: 'DRUG_SEARCH_USER_SELECTS_PHARMACY',
  DRUG_SEARCH_USER_SEARCHED_ZIPCODE: 'DRUG_SEARCH_USER_SEARCHED_ZIPCODE',
  DRUG_SEARCH_USER_GET_PHARMACIES_ERROR:
    'DRUG_SEARCH_USER_GET_PHARMACIES_ERROR',
};

const actionType: { [key in string]: string } = {
  ...PrescriptionsStateActionKeys,
  ...ConfigStateActionKeys,
  ...FeaturesStateActionKeys,
  ...SettingsActionKeys,
  ...SecurePinStateActionKeys,
  ...PhoneNumberLoginActionsKeys,
  ...PhoneNumberVerificationActionsKeys,
  ...NavigationActionKeysToTrack,
  ...MemberLoginStateActionKeys,
  ...MissingAccountActionKeys,
  ...FeedActionKeysEnum,
  ...TestResultActionKeysEnum,
  ...AppointmentActionKeysEnum,
  ...CreateBookingActionKeysEnum,
  ...ImmunizationRecordActionKeysEnum,
  ...IdentityVerificationActionKeysEnum,
  Guest_UI_API_RESPONSE_ERROR: 'GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR',
};

export const actionTypeList: string[] = Object.keys(actionType).map(
  (key: string) => actionType[key]
);

export const guestExperienceLogger = (): Middleware =>
  setupLogger(actionTypeList, GuestExperienceLogService.loggerMiddleware);

export const guestExperienceExceptionLogger = (error: Error) => {
  GuestExperienceLogService.logException(error);
};

export const guestExperienceCustomEventLogger = <
  T = ICustomPropertiesForLoggingCustomEvent
>(
  type: string,
  payload: T
) => {
  GuestExperienceLogService.trackEvent(type, payload);
};

export const updateTelemetryId = (operationId?: string): string | undefined => {
  if (operationId) {
    return GuestExperienceLogService.setTelemetryId(operationId);
  }
  return operationId;
};

export const logNavigationEvent = (routeName: string) => {
  const payload = {
    routeName,
  };
  GuestExperienceLogService.trackEvent(
    NavigationActionKeysToTrack.NAVIGATION_NAVIGATE,
    { payload }
  );
};
