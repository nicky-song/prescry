// Copyright 2018 Prescryptive Health, Inc.

export const VERIFY_ONE_TIME_PASSWORD_ROUTE = '/one-time-password/verify';

export const LOGIN_ROUTE = '/login';

export const SEND_ONE_TIME_PASSWORD_ROUTE = '/one-time-password/send';

export const GET_MEMBERS_ROUTE = '/members';

export const ADD_MEMBERSHIP_ROUTE = '/members';

export const UPDATE_MEMBER_INFO_ROUTE = '/member/:identifier';

export const GET_PENDING_PRESCRIPTION_ROUTE =
  '/pending-prescriptions/:identifier';

export const HEALTH_READY_ROUTE = '/health/ready';

export const HEALTH_LIVE_ROUTE = '/health/live';

export const ADD_ACCOUNT_ROUTE = '/account/add';

export const UPDATE_PIN_ROUTE = '/account/pin/update';

export const VERIFY_PIN_ROUTE = '/account/pin/verify';

export const ADD_EMAIL_ROUTE = '/account/email/add';

export const UPDATE_EMAIL_ROUTE = '/account/email/update';

export const FAVORITED_PHARMACIES_ROUTE = '/account/favorited-pharmacies';

export const LANGUAGE_CODE_ROUTE = '/account/language-code';

export const UPDATE_FEATURE_KNOWN_ROUTE = '/account/feature-known';

export const PROVIDER_LOCATIONS_ROUTE = '/provider-location';

export const PROVIDER_LOCATION_BY_IDENTIFIER_ROUTE =
  '/provider-location/:identifier';

export const AVAILABLE_SLOTS_ROUTE = '/provider-location/get-availability';

export const CREATE_BOOKING_ROUTE = '/provider-location/create-booking';

export const CANCEL_BOOKING_ROUTE = '/provider-location/cancel-booking';

export const PATIENT_TEST_RESULTS_ROUTE = '/test-results';

export const PATIENT_PROCEDURE_LIST_ROUTE = '/past-procedures-list';

export const GET_FEED_ROUTE = '/feed';

export const CONSENT_ACCEPT_ROUTE = '/consent';

export const SESSION_ROUTE = '/session';

export const APPOINTMENTS_ROUTE = '/appointments';

export const APPOINTMENT_INFO_ROUTE = '/appointment/:identifier';

export const SMART_PRICE_REGISTER_ROUTE = '/smart-price/register';

export const SMART_PRICE_APP_REGISTER_ROUTE = '/smart-price/app-register';

export const SMART_PRICE_VERIFY_USER_ROUTE = '/smart-price/verify-user';

export const SMART_PRICE_GET_MEMBER_INFO_ROUTE =
  '/smart-price/get-smartprice-member-info';

export const IMMUNIZATION_RECORD_ROUTE = '/immunization/:identifier';

export const GET_INVITE_CODE_DETAILS_ROUTE = '/invite-code/:code';

export const WAITLIST_ADD_ROUTE = '/waitlist';

export const WAITLIST_REMOVE_ROUTE = '/waitlist/remove';

export const PIN_RESET_SEND_CODE_ROUTE = '/pin-reset/send-code';

export const PIN_RESET_VERIFY_IDENTITY_ROUTE = '/pin-reset/verify-identity';

export const PIN_RESET_ROUTE = '/pin-reset/reset';

export const SEND_REGISTRATION_TEXT_ROUTE = '/send-registration-text';

export const GET_MEDICINE_CABINET = '/prescription/get-cabinet';

export const PRESCRIPTION_ROUTE = '/prescription/:identifier';

export const VERIFY_PATIENT_INFO_ROUTE =
  '/prescription/verify-patient/:smartContractAddress';

export const VERIFY_PRESCRIPTION_INFO_ROUTE =
  '/prescription/verify/:identifier';

export const LOCK_SLOT_ROUTE = '/provider-location/lock-slot';

export const UNLOCK_SLOT_ROUTE = '/provider-location/unlock-slot/:id';

export const SEARCH_PRESCRIPTION_PHARMACY_ROUTE =
  '/prescription/search-pharmacy';

export const SEARCH_PRESCRIPTION_PHARMACY_ROUTE_2 =
  '/prescription/search-pharmacy/:identifier';

export const SEND_PRESCRIPTION_ROUTE = '/prescription/send-prescription';

export const GEOLOCATIONS_ROUTE = '/geolocation';

export const GEOLOCATION_PHARMACIES_ROUTE = '/geolocation/pharmacies';

export const GEOLOCATION_AUTOCOMPLETE_ROUTE = '/geolocation/autocomplete';

export const DRUG_PRICE_LOOKUP_ROUTE = '/drug/search-price';

export const DRUG_PRICE_AUTH_LOOKUP_ROUTE = '/drug/auth-search-price';

export const ALTERNATIVE_DRUG_PRICE_LOOKUP_ROUTE =
  '/drug/alternative-search-price';

export const PHARMACY_SEARCH_ROUTE = '/pharmacy/search';

export const PHARMACY_AUTH_SEARCH_ROUTE = '/pharmacy/auth-search';

export const CREATE_ACCOUNT_ROUTE_OBSOLETE = '/account/create';

export const CREATE_ACCOUNT_ROUTE = '/accounts';

export const TRANSFER_PRESCRIPTION_ROUTE = '/prescription/transfer';

export const VERIFY_MEMBERSHIP_ROUTE = '/members/verify';

export const PRESCRIPTION_USER_STATUS = '/prescription/user-status/:identifier';

export const CLAIMS_ROUTE = '/claims';

export const CLAIMS_ACCUMULATORS_ROUTE = '/claims/accumulators';

export const CMS_CONTENT_ROUTE = '/content';

export const GET_CLAIM_ALERT_ROUTE = '/claim-alert/:identifier';

export const VERIFY_SSO_JWT_TOKEN_ROUTE = '/sso/jwt/verify';

export const SEND_NOTIFICATION_EVENT = '/event/notifications';
export const SEND_ERROR_EVENT = '/event/errors';
