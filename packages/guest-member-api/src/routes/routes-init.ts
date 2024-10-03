// Copyright 2020 Prescryptive Health, Inc.

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
  SEND_ONE_TIME_PASSWORD_ROUTE,
  SEND_REGISTRATION_TEXT_ROUTE,
  SESSION_ROUTE,
  SMART_PRICE_APP_REGISTER_ROUTE,
  SMART_PRICE_REGISTER_ROUTE,
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
  GEOLOCATIONS_ROUTE,
  TRANSFER_PRESCRIPTION_ROUTE,
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
  VERIFY_SSO_JWT_TOKEN_ROUTE,
  ALTERNATIVE_DRUG_PRICE_LOOKUP_ROUTE,
  SEND_NOTIFICATION_EVENT,
  SEND_ERROR_EVENT,
  VERIFY_PATIENT_INFO_ROUTE,
} from '../constants/routes';

import { IControllers } from '../controllers/controller-init';
import { AddPinRequestValidator } from '../validators/add-pin-validator';
import { LoginRequestValidator } from '../validators/login-validator';
import { SendOneTimePasswordRequestValidator } from '../validators/send-one-time-password-validator';
import { UpdatePinRequestValidator } from '../validators/update-pin-validator';
import { VerifyPhoneNumberRequestValidator } from '../validators/verify-phone-number-validator';
import { VerifyPinRequestValidator } from '../validators/verify-pin-validator';
import { ProviderLocationRequestValidator } from '../validators/provider-location-request.validator';
import { AddMembershipRequestValidator } from '../validators/add-membership.validator';
import { SmartPriceRegistrationRequestValidator } from '../controllers/smart-price/helpers/smartprice-registration-request.validator';
import { CreateWaitlistRequestValidator } from '../validators/create-waitlist-request.validator';
import { RecoveryEmailRequestValidator } from '../validators/recovery-email-validator';
import { FavoritedPharmaciesRequestValidator } from '../validators/favorited-pharmacies-validator';
import { PinResetRequestValidator } from '../validators/pin-reset-request.validator';
import { VerifyIdentityRequestValidator } from '../validators/verify-identity-request.validator';
import { SendRegistrationTextRequestValidator } from '../validators/send-registration-text.validator';
import { RemoveWaitlistRequestValidator } from '../validators/remove-waitlist-request.validator';
import { SendPrescriptionRequestValidator } from '../validators/send-prescription.validator';
import { CreateAccountRequestValidator } from '../validators/create-account.request.validator';
import { TransferPrescriptionRequestValidator } from '../validators/transfer-prescription-validator';
import { VerifyMembershipRequestValidator } from '../validators/verify-membership.request.validator';
import { VerifyPrescriptionInfoRequestValidator } from '../validators/verify-prescription-info.validator';
import { LanguageCodeValidator } from '../validators/language-code-validator';
import { VerifySsoJwtTokenRequestValidator } from '../validators/verify-sso-jwt-token-validator';
import { VerifyPatientInfoRequestValidator } from '../validators/verify-patient-info.validator';

export function initializeRoutes(router: Router, controllers: IControllers) {
  get(router, controllers);
  put(router, controllers);
  post(router, controllers);
  del(router, controllers);
}
function put(router: Router, controllers: IControllers) {
  router.put(
    UPDATE_MEMBER_INFO_ROUTE,
    controllers.memberContactInfoUpdateController.updateMemberContactInfo
  );
}

function get(router: Router, controllers: IControllers) {
  router.get(HEALTH_READY_ROUTE, controllers.healthController.readiness);
  router.get(HEALTH_LIVE_ROUTE, controllers.healthController.liveness);
  router.get(GET_MEMBERS_ROUTE, controllers.membersController.getMembers);
  router.get(GET_FEED_ROUTE, controllers.feedController.getFeed);
  router.get(
    GET_PENDING_PRESCRIPTION_ROUTE,
    controllers.pendingPrescriptionsController.getPendingPrescription
  );
  router.get(
    PROVIDER_LOCATIONS_ROUTE,
    controllers.providerLocationController.getProviderLocations
  );
  router.get(
    PATIENT_TEST_RESULTS_ROUTE,
    controllers.patientTestResultsController.getPatientTestResults
  );
  router.get(
    APPOINTMENTS_ROUTE,
    controllers.appointmentController.getAppointments
  );
  router.get(
    APPOINTMENT_INFO_ROUTE,
    controllers.appointmentController.getAppointmentForOrderNumber
  );
  router.get(
    PATIENT_PROCEDURE_LIST_ROUTE,
    controllers.patientPastProceduresController.getAllPastProceduresForPatients
  );
  router.get(
    IMMUNIZATION_RECORD_ROUTE,
    controllers.immunizationRecordController.getImmunizationRecordForOrderNumber
  );
  router.get(
    GET_INVITE_CODE_DETAILS_ROUTE,
    controllers.inviteCodeController.getDetailsForInviteCode
  );
  router.get(
    PROVIDER_LOCATION_BY_IDENTIFIER_ROUTE,
    controllers.providerLocationController.getLocationByIdentifier
  );
  router.get(
    SMART_PRICE_VERIFY_USER_ROUTE,
    controllers.smartPriceController.isSmartPriceUser
  );

  router.get(
    SMART_PRICE_GET_MEMBER_INFO_ROUTE,
    controllers.smartPriceController.getSmartPriceUserMembership
  );
  // TODO: Remove this route after sometime (07/21/2022)
  router.get(
    SEARCH_PRESCRIPTION_PHARMACY_ROUTE,
    controllers.prescriptionController.searchPharmacy
  );
  router.get(
    SEARCH_PRESCRIPTION_PHARMACY_ROUTE_2,
    controllers.prescriptionController.searchPharmacy
  );
  router.get(
    GET_MEDICINE_CABINET,
    controllers.prescriptionController.getMedicineCabinet
  );
  router.get(
    PRESCRIPTION_ROUTE,
    controllers.prescriptionController.getPrescriptionInfo
  );
  router.get(
    GEOLOCATION_PHARMACIES_ROUTE,
    controllers.geolocationController.getGeolocationPharmacies
  );
  router.get(
    GEOLOCATIONS_ROUTE,
    controllers.geolocationController.getGeolocation
  );
  router.get(
    GEOLOCATION_AUTOCOMPLETE_ROUTE,
    controllers.geolocationController.getGeolocationAutocomplete
  );
  router.get(
    DRUG_PRICE_LOOKUP_ROUTE,
    controllers.drugPriceController.searchPharmacyDrugPrices
  );
  router.get(
    DRUG_PRICE_AUTH_LOOKUP_ROUTE,
    controllers.drugPriceController.searchPharmacyDrugPrices
  );
  router.get(
    PHARMACY_SEARCH_ROUTE,
    controllers.pharmacySearchController.searchPharmacies
  );
  router.get(
    PHARMACY_AUTH_SEARCH_ROUTE,
    controllers.pharmacySearchController.searchPharmacies
  );
  router.get(
    PRESCRIPTION_USER_STATUS,
    controllers.prescriptionController.getPrescriptionUserStatus
  );
  router.get(CLAIMS_ROUTE, controllers.claimsController.getClaims);
  router.get(
    CLAIMS_ACCUMULATORS_ROUTE,
    controllers.claimsController.getClaimsAccumulators
  );
  router.get(
    FAVORITED_PHARMACIES_ROUTE,
    controllers.accountController.getFavoritedPharmaciesList
  );
  router.get(CMS_CONTENT_ROUTE, controllers.cmsContentController.getCMSContent);
  router.get(
    GET_CLAIM_ALERT_ROUTE,
    controllers.claimAlertController.getClaimAlert
  );
  router.get(
    ALTERNATIVE_DRUG_PRICE_LOOKUP_ROUTE,
    controllers.drugPriceController.searchAlternativeDrugPrices
  );
}

function post(router: Router, controllers: IControllers) {
  router.post(
    SEND_ONE_TIME_PASSWORD_ROUTE,
    new SendOneTimePasswordRequestValidator().validate,
    controllers.sendOneTimePasswordController.sendOneTimePassword
  );

  router.post(
    VERIFY_ONE_TIME_PASSWORD_ROUTE,
    new VerifyPhoneNumberRequestValidator().validate,
    controllers.verifyOneTimePasswordController.verifyOneTimePassword
  );

  router.post(
    ADD_ACCOUNT_ROUTE,
    new AddPinRequestValidator().validate,
    controllers.pinController.addPin
  );

  router.post(
    LOGIN_ROUTE,
    new LoginRequestValidator().login,
    controllers.loginController.login
  );

  router.post(
    VERIFY_PIN_ROUTE,
    new VerifyPinRequestValidator().validate,
    controllers.pinController.verifyPin
  );

  router.post(
    UPDATE_PIN_ROUTE,
    new UpdatePinRequestValidator().validate,
    controllers.pinController.updatePin
  );

  router.post(
    AVAILABLE_SLOTS_ROUTE,
    new ProviderLocationRequestValidator().getAvailabilityValidate,
    controllers.providerLocationController.getStaffAvailability
  );
  router.post(
    CREATE_BOOKING_ROUTE,
    new ProviderLocationRequestValidator().createBookingValidate,
    controllers.providerLocationController.createBooking
  );
  router.post(
    CONSENT_ACCEPT_ROUTE,
    controllers.consentController.acceptConsent
  );
  router.post(SESSION_ROUTE, controllers.sessionController.getSession);
  router.post(
    ADD_MEMBERSHIP_ROUTE,
    new AddMembershipRequestValidator().addMembershipValidate,
    controllers.membersController.addMembership
  );

  router.post(
    CANCEL_BOOKING_ROUTE,
    new ProviderLocationRequestValidator().cancelBookingValidate,
    controllers.providerLocationController.cancelBooking
  );

  router.post(
    SMART_PRICE_REGISTER_ROUTE,
    new SmartPriceRegistrationRequestValidator().registration,
    controllers.smartPriceController.register
  );
  router.post(
    WAITLIST_ADD_ROUTE,
    new CreateWaitlistRequestValidator().createWaitlistValidate,
    controllers.waitlistController.createWaitlist
  );
  router.post(
    ADD_EMAIL_ROUTE,
    new RecoveryEmailRequestValidator().addRecoveryEmailValidate,
    controllers.accountController.addEmail
  );
  router.post(
    UPDATE_EMAIL_ROUTE,
    new RecoveryEmailRequestValidator().updateRecoveryEmailValidate,
    controllers.accountController.updateEmail
  );
  router.post(
    FAVORITED_PHARMACIES_ROUTE,
    new FavoritedPharmaciesRequestValidator().updateFavoritedPharmaciesValidate,
    controllers.accountController.updateFavoritedPharmacies
  );
  router.post(
    SMART_PRICE_APP_REGISTER_ROUTE,
    new SmartPriceRegistrationRequestValidator().appRegistration,
    controllers.smartPriceController.appRegister
  );
  router.post(
    PIN_RESET_SEND_CODE_ROUTE,
    new PinResetRequestValidator().sendVerificationCodeValidate,
    controllers.pinResetController.sendVerificationCode
  );
  router.post(
    PIN_RESET_ROUTE,
    new PinResetRequestValidator().resetPinValidate,
    controllers.pinResetController.resetPin
  );
  router.post(
    PIN_RESET_VERIFY_IDENTITY_ROUTE,
    new VerifyIdentityRequestValidator().verifyIdentityValidate,
    controllers.pinResetController.verifyIdentity
  );
  router.post(
    SEND_REGISTRATION_TEXT_ROUTE,
    new SendRegistrationTextRequestValidator().validate,
    controllers.sendRegistrationTextController.sendRegistrationText
  );
  router.post(
    WAITLIST_REMOVE_ROUTE,
    new RemoveWaitlistRequestValidator().validate,
    controllers.waitlistController.removeWaitlist
  );
  router.post(
    SEND_PRESCRIPTION_ROUTE,
    new SendPrescriptionRequestValidator().validate,
    controllers.prescriptionController.sendPrescription
  );
  router.post(
    TRANSFER_PRESCRIPTION_ROUTE,
    new TransferPrescriptionRequestValidator().validate,
    controllers.prescriptionController.transferPrescription
  );
  router.post(
    CREATE_ACCOUNT_ROUTE,
    new CreateAccountRequestValidator().createAccount,
    controllers.accountController.createAccount
  );
  router.post(
    CREATE_ACCOUNT_ROUTE_OBSOLETE,
    new CreateAccountRequestValidator().createAccount,
    controllers.accountController.createAccount
  );
  router.post(
    VERIFY_MEMBERSHIP_ROUTE,
    new VerifyMembershipRequestValidator().verifyMembership,
    controllers.membersController.verifyMembership
  );
  router.post(
    LOCK_SLOT_ROUTE,
    new ProviderLocationRequestValidator().lockSlotValidate,
    controllers.providerLocationController.lockSlot
  );
  router.post(
    VERIFY_PRESCRIPTION_INFO_ROUTE,
    new VerifyPrescriptionInfoRequestValidator().verifyIdentityValidate,
    controllers.prescriptionController.verifyPrescriptionInfo
  );
  router.post(
    UPDATE_FEATURE_KNOWN_ROUTE,
    controllers.accountController.updateFeatureKnown
  );
  router.post(
    LANGUAGE_CODE_ROUTE,
    new LanguageCodeValidator().updateLanguageCodeValidate,
    controllers.accountController.updateLanguageCode
  );
  router.post(
    VERIFY_SSO_JWT_TOKEN_ROUTE,
    new VerifySsoJwtTokenRequestValidator().validateRequest,
    controllers.ssoController.partnerSso
  );
  router.post(SEND_NOTIFICATION_EVENT, controllers.eventController.sendEvent);
  router.post(SEND_ERROR_EVENT, controllers.eventController.sendEvent);
  router.post(
    VERIFY_PATIENT_INFO_ROUTE,
    new VerifyPatientInfoRequestValidator().verifyPatientInfoValidate,
    controllers.prescriptionController.verifyPatientInfo
  );
}
function del(router: Router, controllers: IControllers) {
  router.delete(
    UNLOCK_SLOT_ROUTE,
    controllers.providerLocationController.unlockSlot
  );
}
