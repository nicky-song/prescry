// Copyright 2018 Prescryptive Health, Inc.

import { GuestExperienceLogService } from './guest-experience-log-service';
import {
  actionTypeList,
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
  guestExperienceExceptionLogger,
  guestExperienceLogger,
  logNavigationEvent,
  NavigationActionKeysToTrack,
  updateTelemetryId,
} from './guest-experience-logger.middleware';
import { ConfigStateActionKeys } from './store/config/config-state-reducer';
import { FeaturesStateActionKeys } from './store/features/features-state.reducer';
import { MemberLoginStateActionKeys } from './store/member-login/member-login-reducer.actions';
import { PhoneNumberLoginActionsKeys } from './store/phone-number-login/phone-number-login.reducer.action';
import { PrescriptionsStateActionKeys } from './store/prescriptions/prescriptions-reducer.actions';
import { SecurePinStateActionKeys } from './store/secure-pin/secure-pin-actions';
import { SettingsActionKeys } from './store/settings/settings-reducer.actions';
import { PhoneNumberVerificationActionsKeys } from './store/phone-number-verification/actions/phone-number-verification.actions';
import { FeedActionKeysEnum } from './store/feed/actions/feed-action';
import { TestResultActionKeysEnum } from './store/test-result/actions/test-result-actions';
import { MissingAccountActionKeys } from './store/support-error/support-error.reducer.actions';
import { AppointmentActionKeysEnum } from './store/appointment/actions/appointment-action';
import { CreateBookingActionKeysEnum } from './store/appointment/actions/create-booking-action';
import { ImmunizationRecordActionKeysEnum } from './store/immunization-record/actions/immunization-record-action';
import { IdentityVerificationActionKeysEnum } from './store/identity-verification/actions/identity-verification.action';

jest.mock('./guest-experience-log-service', () => ({
  GuestExperienceLogService: {
    logException: jest.fn(),
    logService: {
      logger: {
        middleware: jest.fn(),
      },
    },
    loggerMiddleware: jest.fn(),
    setTelemetryId: jest.fn().mockReturnValue('newOperationId'),
    trackEvent: jest.fn(),
  },
}));

const guestExperienceLogServiceMiddlewareMock =
  GuestExperienceLogService.loggerMiddleware as jest.Mock;
const guestExperienceLogServiceExceptionMock =
  GuestExperienceLogService.logException as jest.Mock;
const guestExperienceCustomEventLoggerMock =
  GuestExperienceLogService.trackEvent as jest.Mock;
const setTelemetryIdMock =
  GuestExperienceLogService.setTelemetryId as jest.Mock;

beforeEach(() => {
  guestExperienceLogServiceMiddlewareMock.mockReset();
  guestExperienceLogServiceExceptionMock.mockReset();
  guestExperienceCustomEventLoggerMock.mockReset();
  setTelemetryIdMock.mockReset();
});

describe('guestExperienceLogger', () => {
  it('should return middleware', () => {
    const logger = () => 'hi';
    guestExperienceLogServiceMiddlewareMock.mockReturnValue(logger);
    const mockValue = guestExperienceLogger();
    expect(mockValue).toBe(logger);
  });
});

describe('guestExperienceExceptionLogger', () => {
  it('should call logException with error object', () => {
    const error = new Error();
    guestExperienceExceptionLogger(error);
    expect(guestExperienceLogServiceExceptionMock).toHaveBeenNthCalledWith(
      1,
      error
    );
  });
});

describe('guestExperienceCustomEventLogger', () => {
  it('should call trackEvent with action and payload', () => {
    guestExperienceCustomEventLogger('fake-action', {
      ExpectedFrom: 'fake ExpectedFrom',
      ExpectedInterface: 'fake ExpectedInterface',
      Message: 'fake Message',
    });
    expect(guestExperienceCustomEventLoggerMock).toBeCalledTimes(1);
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenNthCalledWith(
      1,
      'fake-action',
      {
        ExpectedFrom: 'fake ExpectedFrom',
        ExpectedInterface: 'fake ExpectedInterface',
        Message: 'fake Message',
      }
    );
  });
});

describe('updateTelemetryId()', () => {
  it('should call setTelemetryId with operationId', () => {
    const operationId = 'operationId';
    updateTelemetryId(operationId);
    expect(setTelemetryIdMock).toHaveBeenNthCalledWith(1, operationId);
  });

  it('should not call setTelemetryId if operationId is undefined', () => {
    const operationId = undefined;
    updateTelemetryId(operationId);
    expect(setTelemetryIdMock).not.toHaveBeenCalled();
  });
});

describe('actionTypeList', () => {
  it('should have all the action names provided', () => {
    const mockActionTypeList: string[] = Object.values({
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
    });
    expect(actionTypeList).toEqual(mockActionTypeList);
  });
});

describe('CustomAppInsightEvents', () => {
  it('should have the correct values', () => {
    const CustomAppInsightEventsMock = {
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
    expect(CustomAppInsightEvents).toEqual(CustomAppInsightEventsMock);
  });
});

describe('logNavigationEvent', () => {
  it('logs tracking event', () => {
    const routeNameMock = 'route-name';

    logNavigationEvent(routeNameMock);

    const expectedPayload = {
      routeName: routeNameMock,
    };
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      NavigationActionKeysToTrack.NAVIGATION_NAVIGATE,
      { payload: expectedPayload }
    );
  });
});
