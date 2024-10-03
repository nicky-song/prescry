// Copyright 2018 Prescryptive Health, Inc.

import { Router } from 'express';
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
  PIN_RESET_SEND_CODE_ROUTE,
  PIN_RESET_ROUTE,
  PIN_RESET_VERIFY_IDENTITY_ROUTE,
  PRESCRIPTION_ROUTE,
  PROVIDER_LOCATION_BY_IDENTIFIER_ROUTE,
  PROVIDER_LOCATIONS_ROUTE,
  SEARCH_PRESCRIPTION_PHARMACY_ROUTE,
  SESSION_ROUTE,
  SEND_ONE_TIME_PASSWORD_ROUTE,
  SEND_REGISTRATION_TEXT_ROUTE,
  SMART_PRICE_REGISTER_ROUTE,
  SMART_PRICE_APP_REGISTER_ROUTE,
  SMART_PRICE_VERIFY_USER_ROUTE,
  SMART_PRICE_GET_MEMBER_INFO_ROUTE,
  UPDATE_EMAIL_ROUTE,
  FAVORITED_PHARMACIES_ROUTE,
  UPDATE_FEATURE_KNOWN_ROUTE,
  UPDATE_MEMBER_INFO_ROUTE,
  UPDATE_PIN_ROUTE,
  VERIFY_ONE_TIME_PASSWORD_ROUTE,
  VERIFY_PIN_ROUTE,
  WAITLIST_ADD_ROUTE,
  WAITLIST_REMOVE_ROUTE,
  SEND_PRESCRIPTION_ROUTE,
  TRANSFER_PRESCRIPTION_ROUTE,
  GEOLOCATIONS_ROUTE,
  GET_MEDICINE_CABINET,
  VERIFY_MEMBERSHIP_ROUTE,
  LOCK_SLOT_ROUTE,
  UNLOCK_SLOT_ROUTE,
  PRESCRIPTION_USER_STATUS,
  VERIFY_PRESCRIPTION_INFO_ROUTE,
  GEOLOCATION_PHARMACIES_ROUTE,
  GEOLOCATION_AUTOCOMPLETE_ROUTE,
  CLAIMS_ROUTE,
  CLAIMS_ACCUMULATORS_ROUTE,
  SEARCH_PRESCRIPTION_PHARMACY_ROUTE_2,
  CMS_CONTENT_ROUTE,
  GET_CLAIM_ALERT_ROUTE,
  LANGUAGE_CODE_ROUTE,
  ALTERNATIVE_DRUG_PRICE_LOOKUP_ROUTE,
  VERIFY_SSO_JWT_TOKEN_ROUTE,
  SEND_NOTIFICATION_EVENT,
  SEND_ERROR_EVENT,
  VERIFY_PATIENT_INFO_ROUTE,
} from '../constants/routes';

import { createControllers } from '../controllers/controller-init';
import { AddPinRequestValidator } from '../validators/add-pin-validator';
import { LoginRequestValidator } from '../validators/login-validator';
import { SendOneTimePasswordRequestValidator } from '../validators/send-one-time-password-validator';
import { UpdatePinRequestValidator } from '../validators/update-pin-validator';
import { VerifyPhoneNumberRequestValidator } from '../validators/verify-phone-number-validator';
import { VerifyPinRequestValidator } from '../validators/verify-pin-validator';
import { initializeRoutes } from './routes-init';
import { ProviderLocationRequestValidator } from '../validators/provider-location-request.validator';
import { AddMembershipRequestValidator } from '../validators/add-membership.validator';
import { SmartPriceRegistrationRequestValidator } from '../controllers/smart-price/helpers/smartprice-registration-request.validator';
import { CreateWaitlistRequestValidator } from '../validators/create-waitlist-request.validator';
import { RecoveryEmailRequestValidator } from '../validators/recovery-email-validator';
import { PinResetRequestValidator } from '../validators/pin-reset-request.validator';
import { SendRegistrationTextRequestValidator } from '../validators/send-registration-text.validator';
import { VerifyIdentityRequestValidator } from '../validators/verify-identity-request.validator';
import { RemoveWaitlistRequestValidator } from '../validators/remove-waitlist-request.validator';
import { SendPrescriptionRequestValidator } from '../validators/send-prescription.validator';
import { CreateAccountRequestValidator } from '../validators/create-account.request.validator';
import { TransferPrescriptionRequestValidator } from '../validators/transfer-prescription-validator';
import { VerifyMembershipRequestValidator } from '../validators/verify-membership.request.validator';
import { VerifyPrescriptionInfoRequestValidator } from '../validators/verify-prescription-info.validator';
import { FavoritedPharmaciesRequestValidator } from '../validators/favorited-pharmacies-validator';
import { twilioMock } from '../mock-data/twilio.mock';
import { databaseMock } from '../mock-data/database.mock';
import { configurationMock } from '../mock-data/configuration.mock';
import { LanguageCodeValidator } from '../validators/language-code-validator';
import { VerifySsoJwtTokenRequestValidator } from '../validators/verify-sso-jwt-token-validator';
import { VerifyPatientInfoRequestValidator } from '../validators/verify-patient-info.validator';

jest.mock('express-validator', () => {
  const validationChain = jest.fn();
  validationChain.mockReturnValue({
    not: validationChain,
    withMessage: validationChain,
    isEmpty: validationChain,
    equals: validationChain,
    bail: validationChain,
    trim: validationChain,
    custom: validationChain,
    isLength: validationChain,
    isIn: validationChain,
  });
  return {
    body: validationChain,
    param: validationChain,
  };
});

jest.mock('../utils/twilio-helper');

jest.mock('../controllers/smart-price/smart-price.controller');
jest.mock('../controllers/members/members.controller');
jest.mock('../controllers/health/health.controller');
jest.mock(
  '../controllers/patient-test-results/patient-test-results.controller'
);
jest.mock(
  '../controllers/patient-past-procedures/patient-past-procedures.controller'
);
jest.mock('../controllers/provider-location/provider-location.controller');
jest.mock('../controllers/feed/feed.controller');
jest.mock('../controllers/login/login.controller');
jest.mock('../controllers/pin/pin.controller');
jest.mock('../controllers/consent/consent.controller');
jest.mock('../controllers/session/session.controller');
jest.mock('../controllers/appointment/appointment.controller');
jest.mock(
  '../controllers/members-contact-info/update-member-contact-info.controller'
);
jest.mock(
  '../controllers/pending-prescriptions/pending-prescriptions.controller'
);
jest.mock(
  '../controllers/one-time-password/send-one-time-password/send-one-time-password.controller'
);
jest.mock(
  '../controllers/one-time-password/verify-one-time-password/verify-one-time-password.controller'
);
jest.mock('../controllers/immunization-record/immunization-record.controller');
jest.mock('../controllers/invite-code/invite-code.controller');
jest.mock('../controllers/waitlist/waitlist.controller');
jest.mock('../controllers/account/account.controller');
jest.mock('../controllers/pin-reset/pin-reset.controller');
jest.mock('../controllers/prescription/prescription.controller');
jest.mock('../controllers/drug-price/drug-price.controller');
jest.mock('../controllers/pharmacy-search/pharmacy-search.controller');
jest.mock('../controllers/claims/claims.controller');
jest.mock('../controllers/content/cms-content.controller');
jest.mock('../controllers/claim-alert/claim-alert.controller');
jest.mock('../controllers/geolocation/geolocation.controller');

describe('initializeRoutes', () => {
  const routerPostFunctionMock = jest.fn();
  const routerGetFunctionMock = jest.fn();
  const routerPutFunctionMock = jest.fn();
  const routerDeleteFunctionMock = jest.fn();

  const routerMock = {
    get: routerGetFunctionMock,
    post: routerPostFunctionMock,
    put: routerPutFunctionMock,
    delete: routerDeleteFunctionMock,
  } as unknown as Router;

  const controllers = createControllers(
    configurationMock,
    databaseMock,
    twilioMock
  );

  initializeRoutes(routerMock, controllers);

  it('router.put', () => {
    expect.assertions(1);
    expect(routerPutFunctionMock).toHaveBeenNthCalledWith(
      1,
      UPDATE_MEMBER_INFO_ROUTE,
      controllers.memberContactInfoUpdateController.updateMemberContactInfo
    );
  });

  it('router.get', () => {
    expect.assertions(33);

    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      1,
      HEALTH_READY_ROUTE,
      controllers.healthController.readiness
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      2,
      HEALTH_LIVE_ROUTE,
      controllers.healthController.liveness
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      3,
      GET_MEMBERS_ROUTE,
      controllers.membersController.getMembers
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      4,
      GET_FEED_ROUTE,
      controllers.feedController.getFeed
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      5,
      GET_PENDING_PRESCRIPTION_ROUTE,
      controllers.pendingPrescriptionsController.getPendingPrescription
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      6,
      PROVIDER_LOCATIONS_ROUTE,
      controllers.providerLocationController.getProviderLocations
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      7,
      PATIENT_TEST_RESULTS_ROUTE,
      controllers.patientTestResultsController.getPatientTestResults
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      8,
      APPOINTMENTS_ROUTE,
      controllers.appointmentController.getAppointments
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      9,
      APPOINTMENT_INFO_ROUTE,
      controllers.appointmentController.getAppointmentForOrderNumber
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      10,
      PATIENT_PROCEDURE_LIST_ROUTE,
      controllers.patientPastProceduresController
        .getAllPastProceduresForPatients
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      11,
      IMMUNIZATION_RECORD_ROUTE,
      controllers.immunizationRecordController
        .getImmunizationRecordForOrderNumber
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      12,
      GET_INVITE_CODE_DETAILS_ROUTE,
      controllers.inviteCodeController.getDetailsForInviteCode
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      13,
      PROVIDER_LOCATION_BY_IDENTIFIER_ROUTE,
      controllers.providerLocationController.getLocationByIdentifier
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      14,
      SMART_PRICE_VERIFY_USER_ROUTE,
      controllers.smartPriceController.isSmartPriceUser
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      15,
      SMART_PRICE_GET_MEMBER_INFO_ROUTE,
      controllers.smartPriceController.getSmartPriceUserMembership
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      16,
      SEARCH_PRESCRIPTION_PHARMACY_ROUTE,
      controllers.prescriptionController.searchPharmacy
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      17,
      SEARCH_PRESCRIPTION_PHARMACY_ROUTE_2,
      controllers.prescriptionController.searchPharmacy
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      18,
      GET_MEDICINE_CABINET,
      controllers.prescriptionController.getMedicineCabinet
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      19,
      PRESCRIPTION_ROUTE,
      controllers.prescriptionController.getPrescriptionInfo
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      20,
      GEOLOCATION_PHARMACIES_ROUTE,
      controllers.geolocationController.getGeolocationPharmacies
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      21,
      GEOLOCATIONS_ROUTE,
      controllers.geolocationController.getGeolocation
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      22,
      GEOLOCATION_AUTOCOMPLETE_ROUTE,
      controllers.geolocationController.getGeolocationAutocomplete
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      23,
      DRUG_PRICE_LOOKUP_ROUTE,
      controllers.drugPriceController.searchPharmacyDrugPrices
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      24,
      DRUG_PRICE_AUTH_LOOKUP_ROUTE,
      controllers.drugPriceController.searchPharmacyDrugPrices
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      25,
      PHARMACY_SEARCH_ROUTE,
      controllers.pharmacySearchController.searchPharmacies
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      26,
      PHARMACY_AUTH_SEARCH_ROUTE,
      controllers.pharmacySearchController.searchPharmacies
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      27,
      PRESCRIPTION_USER_STATUS,
      controllers.prescriptionController.getPrescriptionUserStatus
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      28,
      CLAIMS_ROUTE,
      controllers.claimsController.getClaims
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      29,
      CLAIMS_ACCUMULATORS_ROUTE,
      controllers.claimsController.getClaimsAccumulators
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      30,
      FAVORITED_PHARMACIES_ROUTE,
      controllers.accountController.getFavoritedPharmaciesList
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      31,
      CMS_CONTENT_ROUTE,
      controllers.cmsContentController.getCMSContent
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      32,
      GET_CLAIM_ALERT_ROUTE,
      controllers.claimAlertController.getClaimAlert
    );
    expect(routerGetFunctionMock).toHaveBeenNthCalledWith(
      33,
      ALTERNATIVE_DRUG_PRICE_LOOKUP_ROUTE,
      controllers.drugPriceController.searchAlternativeDrugPrices
    );
  });

  it('router.post', () => {
    expect(routerPostFunctionMock).toHaveBeenCalledTimes(36);

    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      1,
      SEND_ONE_TIME_PASSWORD_ROUTE,
      new SendOneTimePasswordRequestValidator().validate,
      controllers.sendOneTimePasswordController.sendOneTimePassword
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      2,
      VERIFY_ONE_TIME_PASSWORD_ROUTE,
      new VerifyPhoneNumberRequestValidator().validate,
      controllers.verifyOneTimePasswordController.verifyOneTimePassword
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      3,
      ADD_ACCOUNT_ROUTE,
      new AddPinRequestValidator().validate,
      controllers.pinController.addPin
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      4,
      LOGIN_ROUTE,
      new LoginRequestValidator().login,
      controllers.loginController.login
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      5,
      VERIFY_PIN_ROUTE,
      new VerifyPinRequestValidator().validate,
      controllers.verifyOneTimePasswordController.verifyOneTimePassword
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      6,
      UPDATE_PIN_ROUTE,
      new UpdatePinRequestValidator().validate,
      controllers.pinController.updatePin
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      7,
      AVAILABLE_SLOTS_ROUTE,
      new ProviderLocationRequestValidator().getAvailabilityValidate,
      controllers.providerLocationController.getStaffAvailability
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      8,
      CREATE_BOOKING_ROUTE,
      new ProviderLocationRequestValidator().createBookingValidate,
      controllers.providerLocationController.createBooking
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      9,
      CONSENT_ACCEPT_ROUTE,
      controllers.consentController.acceptConsent
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      10,
      SESSION_ROUTE,
      controllers.sessionController.getSession
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      11,
      ADD_MEMBERSHIP_ROUTE,
      new AddMembershipRequestValidator().addMembershipValidate,
      controllers.membersController.addMembership
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      12,
      CANCEL_BOOKING_ROUTE,
      new ProviderLocationRequestValidator().cancelBookingValidate,
      controllers.providerLocationController.cancelBooking
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      13,
      SMART_PRICE_REGISTER_ROUTE,
      new SmartPriceRegistrationRequestValidator().registration,
      controllers.smartPriceController.register
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      14,
      WAITLIST_ADD_ROUTE,
      new CreateWaitlistRequestValidator().createWaitlistValidate,
      controllers.waitlistController.createWaitlist
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      15,
      ADD_EMAIL_ROUTE,
      new RecoveryEmailRequestValidator().addRecoveryEmailValidate,
      controllers.accountController.addEmail
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      16,
      UPDATE_EMAIL_ROUTE,
      new RecoveryEmailRequestValidator().updateRecoveryEmailValidate,
      controllers.accountController.updateEmail
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      17,
      FAVORITED_PHARMACIES_ROUTE,
      new FavoritedPharmaciesRequestValidator()
        .updateFavoritedPharmaciesValidate,
      controllers.accountController.updateFavoritedPharmacies
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      18,
      SMART_PRICE_APP_REGISTER_ROUTE,
      new SmartPriceRegistrationRequestValidator().appRegistration,
      controllers.smartPriceController.appRegister
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      19,
      PIN_RESET_SEND_CODE_ROUTE,
      new PinResetRequestValidator().sendVerificationCodeValidate,
      controllers.pinResetController.sendVerificationCode
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      20,
      PIN_RESET_ROUTE,
      new PinResetRequestValidator().resetPinValidate,
      controllers.pinResetController.resetPin
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      21,
      PIN_RESET_VERIFY_IDENTITY_ROUTE,
      new VerifyIdentityRequestValidator().verifyIdentityValidate,
      controllers.pinResetController.verifyIdentity
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      22,
      SEND_REGISTRATION_TEXT_ROUTE,
      new SendRegistrationTextRequestValidator().validate,
      controllers.sendRegistrationTextController.sendRegistrationText
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      23,
      WAITLIST_REMOVE_ROUTE,
      new RemoveWaitlistRequestValidator().validate,
      controllers.waitlistController.removeWaitlist
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      24,
      SEND_PRESCRIPTION_ROUTE,
      new SendPrescriptionRequestValidator().validate,
      controllers.prescriptionController.sendPrescription
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      25,
      TRANSFER_PRESCRIPTION_ROUTE,
      new TransferPrescriptionRequestValidator().validate,
      controllers.prescriptionController.transferPrescription
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      26,
      CREATE_ACCOUNT_ROUTE,
      new CreateAccountRequestValidator().createAccount,
      controllers.accountController.createAccount
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      27,
      CREATE_ACCOUNT_ROUTE_OBSOLETE,
      new CreateAccountRequestValidator().createAccount,
      controllers.accountController.createAccount
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      28,
      VERIFY_MEMBERSHIP_ROUTE,
      new VerifyMembershipRequestValidator().verifyMembership,
      controllers.membersController.verifyMembership
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      29,
      LOCK_SLOT_ROUTE,
      new ProviderLocationRequestValidator().lockSlotValidate,
      controllers.providerLocationController.lockSlot
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      30,
      VERIFY_PRESCRIPTION_INFO_ROUTE,
      new VerifyPrescriptionInfoRequestValidator().verifyIdentityValidate,
      controllers.prescriptionController.verifyPrescriptionInfo
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      31,
      UPDATE_FEATURE_KNOWN_ROUTE,
      controllers.accountController.updateFeatureKnown
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      32,
      LANGUAGE_CODE_ROUTE,
      new LanguageCodeValidator().updateLanguageCodeValidate,
      controllers.accountController.updateLanguageCode
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      33,
      VERIFY_SSO_JWT_TOKEN_ROUTE,
      new VerifySsoJwtTokenRequestValidator().validateRequest,
      controllers.ssoController.partnerSso
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      34,
      SEND_NOTIFICATION_EVENT,
      controllers.eventController.sendEvent
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      35,
      SEND_ERROR_EVENT,
      controllers.eventController.sendEvent
    );
    expect(routerPostFunctionMock).toHaveBeenNthCalledWith(
      36,
      VERIFY_PATIENT_INFO_ROUTE,
      new VerifyPatientInfoRequestValidator().verifyPatientInfoValidate,
      controllers.prescriptionController.verifyPatientInfo
    );
  });

  it('router.delete', () => {
    expect.assertions(1);
    expect(routerDeleteFunctionMock).toHaveBeenNthCalledWith(
      1,
      UNLOCK_SLOT_ROUTE,
      controllers.providerLocationController.unlockSlot
    );
  });
});
