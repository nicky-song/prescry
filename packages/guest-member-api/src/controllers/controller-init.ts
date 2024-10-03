// Copyright 2020 Prescryptive Health, Inc.

import type Twilio from 'twilio';
import type { IConfiguration } from '../configuration';
import type { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import { AccountController } from './account/account.controller';
import { ConsentController } from './consent/consent.controller';
import { DrugPriceController } from './drug-price/drug-price.controller';
import { FeedController } from './feed/feed.controller';
import { HealthController } from './health/health.controller';
import { MembersController } from './members/members.controller';
import { PatientTestResultsController } from './patient-test-results/patient-test-results.controller';
import { MemberContactInfoUpdateController } from './members-contact-info/update-member-contact-info.controller';
import { PendingPrescriptionsController } from './pending-prescriptions/pending-prescriptions.controller';
import { PharmacySearchController } from './pharmacy-search/pharmacy-search.controller';
import { LoginController } from './login/login.controller';
import { SendOneTimePasswordController } from './one-time-password/send-one-time-password/send-one-time-password.controller';
import { VerifyOneTimePasswordController } from './one-time-password/verify-one-time-password/verify-one-time-password.controller';
import { PinController } from './pin/pin.controller';
import { PinResetController } from './pin-reset/pin-reset.controller';
import { PrescriptionController } from './prescription/prescription.controller';
import { ProviderLocationController } from './provider-location/provider-location.controller';
import { SendRegistrationTextController } from './registration/send-registration-text.controller';
import { SessionController } from './session/session.controller';
import { SmartPriceController } from './smart-price/smart-price.controller';
import { SsoController } from './sso/sso.controller';
import { ImmunizationRecordController } from './immunization-record/immunization-record.controller';
import { PatientPastProceduresController } from './patient-past-procedures/patient-past-procedures.controller';
import { InviteCodeController } from './invite-code/invite-code.controller';
import { WaitlistController } from './waitlist/waitlist.controller';
import { GeolocationController } from './geolocation/geolocation.controller';
import { AppointmentController } from './appointment/appointment.controller';
import { ClaimsController } from './claims/claims.controller';
import { CMSContentController } from './content/cms-content.controller';
import { ClaimAlertController } from './claim-alert/claim-alert.controller';
import { EventController } from './event/event.controller';

export function createControllers(
  configuration: IConfiguration,
  database: IDatabase,
  twilioClient: Twilio.Twilio
): IControllers {
  return {
    accountController: new AccountController(
      configuration,
      database,
      twilioClient
    ),
    claimAlertController: new ClaimAlertController(database, configuration),
    consentController: new ConsentController(configuration),
    drugPriceController: new DrugPriceController(configuration),
    feedController: new FeedController(database, configuration),
    geolocationController: new GeolocationController(configuration),
    healthController: new HealthController(),
    loginController: new LoginController(database, configuration),
    memberContactInfoUpdateController: new MemberContactInfoUpdateController(
      configuration
    ),
    membersController: new MembersController(configuration, database),
    patientTestResultsController: new PatientTestResultsController(
      database,
      configuration
    ),
    patientPastProceduresController: new PatientPastProceduresController(
      database
    ),
    pendingPrescriptionsController: new PendingPrescriptionsController(
      database
    ),
    pharmacySearchController: new PharmacySearchController(configuration),
    pinController: new PinController(configuration, database),
    pinResetController: new PinResetController(
      configuration,
      database,
      twilioClient
    ),
    sendOneTimePasswordController: new SendOneTimePasswordController(
      configuration,
      twilioClient
    ),
    prescriptionController: new PrescriptionController(
      configuration,
      database,
      twilioClient
    ),
    providerLocationController: new ProviderLocationController(
      database,
      configuration
    ),
    verifyOneTimePasswordController: new VerifyOneTimePasswordController(
      configuration,
      twilioClient,
      database
    ),
    sessionController: new SessionController(),
    appointmentController: new AppointmentController(database, configuration),
    smartPriceController: new SmartPriceController(
      configuration,
      database,
      twilioClient
    ),
    immunizationRecordController: new ImmunizationRecordController(
      database,
      configuration
    ),
    inviteCodeController: new InviteCodeController(database, configuration),
    waitlistController: new WaitlistController(
      database,
      configuration,
      twilioClient
    ),
    sendRegistrationTextController: new SendRegistrationTextController(
      configuration,
      twilioClient
    ),
    claimsController: new ClaimsController(configuration),
    cmsContentController: new CMSContentController(configuration),
    ssoController: new SsoController(database, configuration, twilioClient),
    eventController: new EventController(),
  };
}

export interface IControllers {
  accountController: AccountController;
  appointmentController: AppointmentController;
  claimAlertController: ClaimAlertController;
  consentController: ConsentController;
  drugPriceController: DrugPriceController;
  feedController: FeedController;
  geolocationController: GeolocationController;
  healthController: HealthController;
  loginController: LoginController;
  memberContactInfoUpdateController: MemberContactInfoUpdateController;
  membersController: MembersController;
  pendingPrescriptionsController: PendingPrescriptionsController;
  prescriptionController: PrescriptionController;
  verifyOneTimePasswordController: VerifyOneTimePasswordController;
  sendOneTimePasswordController: SendOneTimePasswordController;
  pinController: PinController;
  pinResetController: PinResetController;
  patientTestResultsController: PatientTestResultsController;
  patientPastProceduresController: PatientPastProceduresController;
  pharmacySearchController: PharmacySearchController;
  providerLocationController: ProviderLocationController;
  sessionController: SessionController;
  smartPriceController: SmartPriceController;
  ssoController: SsoController;
  immunizationRecordController: ImmunizationRecordController;
  inviteCodeController: InviteCodeController;
  waitlistController: WaitlistController;
  sendRegistrationTextController: SendRegistrationTextController;
  claimsController: ClaimsController;
  cmsContentController: CMSContentController;
  eventController: EventController;
}
