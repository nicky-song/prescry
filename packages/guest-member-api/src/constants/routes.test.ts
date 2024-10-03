// Copyright 2018 Prescryptive Health, Inc.

import {
  ADD_ACCOUNT_ROUTE,
  ADD_EMAIL_ROUTE,
  ADD_MEMBERSHIP_ROUTE,
  APPOINTMENTS_ROUTE,
  APPOINTMENT_INFO_ROUTE,
  AVAILABLE_SLOTS_ROUTE,
  CANCEL_BOOKING_ROUTE,
  CONSENT_ACCEPT_ROUTE,
  CREATE_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE_OBSOLETE,
  CREATE_BOOKING_ROUTE,
  DRUG_PRICE_LOOKUP_ROUTE,
  DRUG_PRICE_AUTH_LOOKUP_ROUTE,
  GEOLOCATIONS_ROUTE,
  GET_FEED_ROUTE,
  GET_INVITE_CODE_DETAILS_ROUTE,
  GET_MEMBERS_ROUTE,
  GET_PENDING_PRESCRIPTION_ROUTE,
  HEALTH_LIVE_ROUTE,
  HEALTH_READY_ROUTE,
  IMMUNIZATION_RECORD_ROUTE,
  LOGIN_ROUTE,
  PATIENT_PROCEDURE_LIST_ROUTE,
  PATIENT_TEST_RESULTS_ROUTE,
  PHARMACY_AUTH_SEARCH_ROUTE,
  PHARMACY_SEARCH_ROUTE,
  PROVIDER_LOCATION_BY_IDENTIFIER_ROUTE,
  PROVIDER_LOCATIONS_ROUTE,
  SEARCH_PRESCRIPTION_PHARMACY_ROUTE,
  SEND_ONE_TIME_PASSWORD_ROUTE,
  SEND_REGISTRATION_TEXT_ROUTE,
  SESSION_ROUTE,
  SMART_PRICE_REGISTER_ROUTE,
  SMART_PRICE_GET_MEMBER_INFO_ROUTE,
  SMART_PRICE_VERIFY_USER_ROUTE,
  SMART_PRICE_APP_REGISTER_ROUTE,
  UPDATE_EMAIL_ROUTE,
  FAVORITED_PHARMACIES_ROUTE,
  UPDATE_FEATURE_KNOWN_ROUTE,
  UPDATE_MEMBER_INFO_ROUTE,
  UPDATE_PIN_ROUTE,
  VERIFY_ONE_TIME_PASSWORD_ROUTE,
  VERIFY_PIN_ROUTE,
  WAITLIST_ADD_ROUTE,
  WAITLIST_REMOVE_ROUTE,
  PRESCRIPTION_ROUTE,
  VERIFY_PRESCRIPTION_INFO_ROUTE,
  LOCK_SLOT_ROUTE,
  UNLOCK_SLOT_ROUTE,
  SEND_PRESCRIPTION_ROUTE,
  TRANSFER_PRESCRIPTION_ROUTE,
  GET_MEDICINE_CABINET,
  VERIFY_MEMBERSHIP_ROUTE,
  GEOLOCATION_PHARMACIES_ROUTE,
  GEOLOCATION_AUTOCOMPLETE_ROUTE,
  CLAIMS_ROUTE,
  CLAIMS_ACCUMULATORS_ROUTE,
  SEARCH_PRESCRIPTION_PHARMACY_ROUTE_2,
  CMS_CONTENT_ROUTE,
  GET_CLAIM_ALERT_ROUTE,
  LANGUAGE_CODE_ROUTE,
  ALTERNATIVE_DRUG_PRICE_LOOKUP_ROUTE,
  SEND_NOTIFICATION_EVENT,
  SEND_ERROR_EVENT,
  VERIFY_PATIENT_INFO_ROUTE,
} from './routes';

describe('routes', () => {
  describe('VERIFY_ONE_TIME_PASSWORD_ROUTE', () => {
    it('should be /OneTimePassword/verify', () => {
      expect(VERIFY_ONE_TIME_PASSWORD_ROUTE).toBe('/one-time-password/verify');
    });
  });

  describe('LOGIN_ROUTE', () => {
    it('should be /login', () => {
      expect(LOGIN_ROUTE).toBe('/login');
    });
  });

  describe('SEND_ONE_TIME_PASSWORD_ROUTE', () => {
    it('should be /one-time-password/send', () => {
      expect(SEND_ONE_TIME_PASSWORD_ROUTE).toBe('/one-time-password/send');
    });
  });

  describe('GET_MEMBERS_ROUTE', () => {
    it('should be /members', () => {
      expect(GET_MEMBERS_ROUTE).toBe('/members');
    });
  });

  describe('UPDATE_MEMBER_INFO_ROUTE', () => {
    it('should be /member/update/:identifier', () => {
      expect(UPDATE_MEMBER_INFO_ROUTE).toBe('/member/:identifier');
    });
  });

  describe('GET_PENDING_PRESCRIPTION_ROUTE', () => {
    it('should be /pending-prescriptions/:identifier', () => {
      expect(GET_PENDING_PRESCRIPTION_ROUTE).toBe(
        '/pending-prescriptions/:identifier'
      );
    });
  });

  describe('HEALTH_READY_ROUTE', () => {
    it('should be /health/ready', () => {
      expect(HEALTH_READY_ROUTE).toBe('/health/ready');
    });
  });

  describe('HEALTH_LIVE_ROUTE', () => {
    it('should be /health/live', () => {
      expect(HEALTH_LIVE_ROUTE).toBe('/health/live');
    });
  });

  describe('ADD_ACCOUNT_ROUTE', () => {
    it('should be /account/add', () => {
      expect(ADD_ACCOUNT_ROUTE).toBe('/account/add');
    });
  });

  describe('VERIFY_PIN_ROUTE', () => {
    it('should be /account/pin/verify', () => {
      expect(VERIFY_PIN_ROUTE).toBe('/account/pin/verify');
    });
  });

  describe('UPDATE_PIN_ROUTE', () => {
    it('should be /account/pin/update', () => {
      expect(UPDATE_PIN_ROUTE).toBe('/account/pin/update');
    });
  });

  describe('PROVIDER_LOCATIONS_ROUTE', () => {
    it('should be /provider-location', () => {
      expect(PROVIDER_LOCATIONS_ROUTE).toBe('/provider-location');
    });
  });

  describe('PROVIDER_LOCATION_BY_IDENTIFIER_ROUTE', () => {
    it('should be /provider-location/:identifier', () => {
      expect(PROVIDER_LOCATION_BY_IDENTIFIER_ROUTE).toBe(
        '/provider-location/:identifier'
      );
    });
  });

  describe('AVAILABLE_SLOTS_ROUTE', () => {
    it('should be /provider-location/get-availability', () => {
      expect(AVAILABLE_SLOTS_ROUTE).toBe('/provider-location/get-availability');
    });
  });

  describe('CREATE_BOOKING_ROUTE', () => {
    it('should be /provider-location/create-booking', () => {
      expect(CREATE_BOOKING_ROUTE).toBe('/provider-location/create-booking');
    });
  });
  describe('PATIENT_TEST_RESULTS_ROUTE', () => {
    it('should be /test-results', () => {
      expect(PATIENT_TEST_RESULTS_ROUTE).toBe('/test-results');
    });
  });

  describe('PATIENT_PROCEDURE_LIST_ROUTE', () => {
    it('should be /past-procedures-list', () => {
      expect(PATIENT_PROCEDURE_LIST_ROUTE).toBe('/past-procedures-list');
    });
  });

  describe('GET_FEED_ROUTE', () => {
    it('should be /feed', () => {
      expect(GET_FEED_ROUTE).toBe('/feed');
    });
  });

  describe('ADD_MEMBERSHIP_ROUTE', () => {
    it('should be /members', () => {
      expect(ADD_MEMBERSHIP_ROUTE).toBe('/members');
    });
  });
  describe('APPOINTMENTS_ROUTE', () => {
    it('should be /appointments', () => {
      expect(APPOINTMENTS_ROUTE).toBe('/appointments');
    });
  });
  describe('APPOINTMENT_INFO_ROUTE', () => {
    it('should be /appointment/:identifier', () => {
      expect(APPOINTMENT_INFO_ROUTE).toBe('/appointment/:identifier');
    });
  });

  describe('IMMUNIZATION_RECORD_ROUTE', () => {
    it('should be /immunization/:identifier', () => {
      expect(IMMUNIZATION_RECORD_ROUTE).toBe('/immunization/:identifier');
    });
  });
  describe('CANCEL_BOOKING_ROUTE', () => {
    it('should be /provider-location/cancel-booking', () => {
      expect(CANCEL_BOOKING_ROUTE).toBe('/provider-location/cancel-booking');
    });
  });
  describe('CONSENT_ACCEPT_ROUTE', () => {
    it('should be /consent', () => {
      expect(CONSENT_ACCEPT_ROUTE).toBe('/consent');
    });
  });
  describe('GET_INVITE_CODE_DETAILS_ROUTE', () => {
    it('should be /invite-code/:code', () => {
      expect(GET_INVITE_CODE_DETAILS_ROUTE).toBe('/invite-code/:code');
    });
  });
  describe('SESSION_ROUTE', () => {
    it('should be /session', () => {
      expect(SESSION_ROUTE).toBe('/session');
    });
  });

  describe('SMART_PRICE_REGISTER_ROUTE', () => {
    it('should be /smart-price/register', () => {
      expect(SMART_PRICE_REGISTER_ROUTE).toBe('/smart-price/register');
    });
  });

  describe('SMART_PRICE_APP_REGISTER_ROUTE', () => {
    it('should be /smart-price/app-register', () => {
      expect(SMART_PRICE_APP_REGISTER_ROUTE).toBe('/smart-price/app-register');
    });
  });

  describe('SMART_PRICE_VERIFY_USER_ROUTE', () => {
    it('should be /smart-price/verify-user', () => {
      expect(SMART_PRICE_VERIFY_USER_ROUTE).toBe('/smart-price/verify-user');
    });
  });

  describe('SMART_PRICE_GET_MEMBER_INFO_ROUTE', () => {
    it('should be /smart-price/get-smartprice-member-info', () => {
      expect(SMART_PRICE_GET_MEMBER_INFO_ROUTE).toBe(
        '/smart-price/get-smartprice-member-info'
      );
    });
  });

  describe('WAITLIST_ADD_ROUTE', () => {
    it('should be /waitlist', () => {
      expect(WAITLIST_ADD_ROUTE).toBe('/waitlist');
    });
  });

  describe('WAITLIST_REMOVE_ROUTE', () => {
    it('should be /waitlist/remove', () => {
      expect(WAITLIST_REMOVE_ROUTE).toBe('/waitlist/remove');
    });
  });
  describe('ADD_EMAIL_ROUTE', () => {
    it('should be /account/email/add', () => {
      expect(ADD_EMAIL_ROUTE).toBe('/account/email/add');
    });
  });

  describe('UPDATE_EMAIL_ROUTE', () => {
    it('should be /account/email/update', () => {
      expect(UPDATE_EMAIL_ROUTE).toBe('/account/email/update');
    });
  });

  describe('FAVORITED_PHARMACIES_ROUTE', () => {
    it('should be /account/favorited-pharmacies', () => {
      expect(FAVORITED_PHARMACIES_ROUTE).toBe('/account/favorited-pharmacies');
    });
  });

  describe('UPDATE_FEATURE_KNOWN_ROUTE', () => {
    it('should be /account/feature-known', () => {
      expect(UPDATE_FEATURE_KNOWN_ROUTE).toBe('/account/feature-known');
    });
  });

  describe('SEND_REGISTRATION_TEXT_ROUTE', () => {
    it('should be /send-registration-text', () => {
      expect(SEND_REGISTRATION_TEXT_ROUTE).toBe('/send-registration-text');
    });
  });
  describe('GET_MEDICINE_CABINET', () => {
    it('should be /prescription/get-cabinet', () => {
      expect(GET_MEDICINE_CABINET).toBe('/prescription/get-cabinet');
    });
  });

  describe('GET_PRESCRIPTION_INFO_ROUTE', () => {
    it('should be /prescription/:identifier', () => {
      expect(PRESCRIPTION_ROUTE).toBe('/prescription/:identifier');
    });
  });

  describe('GET_VERIFY_PATIENT_INFO_ROUTE', () => {
    it('should be /prescription/verify-patient/:smartContractAddress', () => {
      expect(VERIFY_PATIENT_INFO_ROUTE).toBe(
        '/prescription/verify-patient/:smartContractAddress'
      );
    });
  });

  describe('GET_VERIFY_PRESCRIPTION_INFO_ROUTE', () => {
    it('should be /prescription/verify/:identifier', () => {
      expect(VERIFY_PRESCRIPTION_INFO_ROUTE).toBe(
        '/prescription/verify/:identifier'
      );
    });
  });

  describe('SEARCH_PRESCRIPTION_PHARMACY_ROUTE', () => {
    it('should be /prescription/search-pharmacy', () => {
      expect(SEARCH_PRESCRIPTION_PHARMACY_ROUTE).toBe(
        '/prescription/search-pharmacy'
      );
    });
  });

  describe('SEARCH_PRESCRIPTION_PHARMACY_ROUTE_2', () => {
    it('should be /prescription/search-pharmacy/:identifier', () => {
      expect(SEARCH_PRESCRIPTION_PHARMACY_ROUTE_2).toBe(
        '/prescription/search-pharmacy/:identifier'
      );
    });
  });

  describe('SEND_PRESCRIPTION_ROUTE', () => {
    it('should be /prescription/send-prescription', () => {
      expect(SEND_PRESCRIPTION_ROUTE).toBe('/prescription/send-prescription');
    });
  });

  describe('LOCK_SLOT_ROUTE', () => {
    it('shoud be /provider-locations/lock-slot', () => {
      expect(LOCK_SLOT_ROUTE).toBe('/provider-location/lock-slot');
    });
  });

  describe('UNLOCK_SLOT_ROUTE', () => {
    it('should be /provider-locations/unlock-slot', () => {
      expect(UNLOCK_SLOT_ROUTE).toBe('/provider-location/unlock-slot/:id');
    });
  });

  describe('DRUG_PRICE_LOOKUP_ROUTE', () => {
    it('should be /drug/search-price', () => {
      expect(DRUG_PRICE_LOOKUP_ROUTE).toBe('/drug/search-price');
    });
  });

  describe('PHARMACY_SEARCH_ROUTE', () => {
    it('should be /pharmacy/search', () => {
      expect(PHARMACY_SEARCH_ROUTE).toBe('/pharmacy/search');
    });
  });
  describe('GEOLOCATIONS_ROUTE', () => {
    it('should be /geolocation', () => {
      expect(GEOLOCATIONS_ROUTE).toBe('/geolocation');
    });
  });

  describe('GEOLOCATION_PHARMACIES_ROUTE', () => {
    it('should be /geolocation/pharmacies', () => {
      expect(GEOLOCATION_PHARMACIES_ROUTE).toBe('/geolocation/pharmacies');
    });
  });

  describe('GEOLOCATION_AUTOCOMPLETE_ROUTE', () => {
    it('should be /geolocation/autocomplete', () => {
      expect(GEOLOCATION_AUTOCOMPLETE_ROUTE).toBe('/geolocation/autocomplete');
    });
  });

  describe('CREATE_ACCOUNT_ROUTE', () => {
    it('should be /accounts', () => {
      expect(CREATE_ACCOUNT_ROUTE).toBe('/accounts');
    });

    it('should be /account/create (obsolete)', () => {
      expect(CREATE_ACCOUNT_ROUTE_OBSOLETE).toBe('/account/create');
    });
  });

  describe('TRANSFER_PRESCRIPTION_ROUTE', () => {
    it('should be /prescription/transfer', () => {
      expect(TRANSFER_PRESCRIPTION_ROUTE).toBe('/prescription/transfer');
    });
  });

  describe('PHARMACY_AUTH_SEARCH_ROUTE', () => {
    it('should be /pharmacy/auth-search', () => {
      expect(PHARMACY_AUTH_SEARCH_ROUTE).toBe('/pharmacy/auth-search');
    });
  });

  describe('DRUG_PRICE_AUTH_LOOKUP_ROUTE', () => {
    it('should be /drug/search-price', () => {
      expect(DRUG_PRICE_AUTH_LOOKUP_ROUTE).toBe('/drug/auth-search-price');
    });
  });

  describe('VERIFY_MEMBERSHIP_ROUTE', () => {
    it('should be /members/verify', () => {
      expect(VERIFY_MEMBERSHIP_ROUTE).toBe('/members/verify');
    });
  });

  describe('CLAIMS_ROUTE', () => {
    it('should be /claims', () => {
      expect(CLAIMS_ROUTE).toBe('/claims');
    });
  });

  describe('CLAIMS_ACCUMULATORS_ROUTE', () => {
    it('should be /claims/accumulators', () => {
      expect(CLAIMS_ACCUMULATORS_ROUTE).toBe('/claims/accumulators');
    });
  });

  describe('CMS_CONTENT_ROUTE', () => {
    it('should be /content', () => {
      expect(CMS_CONTENT_ROUTE).toBe('/content');
    });
  });

  describe('GET_CLAIM_ALERT_ROUTE', () => {
    it('should be /claim-alert/:identifier', () => {
      expect(GET_CLAIM_ALERT_ROUTE).toBe('/claim-alert/:identifier');
    });
  });

  describe('LANGUAGE_CODE_ROUTE', () => {
    it('should be /account/language-code', () => {
      expect(LANGUAGE_CODE_ROUTE).toBe('/account/language-code');
    });
  });

  describe('ALTERNATIVE_DRUG_PRICE_LOOKUP_ROUTE', () => {
    it('should be /drug/alternative-search-price', () => {
      expect(ALTERNATIVE_DRUG_PRICE_LOOKUP_ROUTE).toBe(
        '/drug/alternative-search-price'
      );
    });
  });

  describe('SEND_NOTIFICATION_EVENT', () => {
    it('should be /event/notifications', () => {
      expect(SEND_NOTIFICATION_EVENT).toBe('/event/notifications');
    });
  });
  describe('SEND_ERROR_EVENT', () => {
    it('should be /event/errors', () => {
      expect(SEND_ERROR_EVENT).toBe('/event/errors');
    });
  });
});
