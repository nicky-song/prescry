// Copyright 2020 Prescryptive Health, Inc.

import { AccountController } from './account/account.controller';
import { ConsentController } from './consent/consent.controller';
import { DrugPriceController } from './drug-price/drug-price.controller';
import { FeedController } from './feed/feed.controller';
import { HealthController } from './health/health.controller';
import { MembersController } from './members/members.controller';
import { MemberContactInfoUpdateController } from './members-contact-info/update-member-contact-info.controller';
import { PatientTestResultsController } from './patient-test-results/patient-test-results.controller';
import { PharmacySearchController } from './pharmacy-search/pharmacy-search.controller';
import { PendingPrescriptionsController } from './pending-prescriptions/pending-prescriptions.controller';
import { createControllers, IControllers } from './controller-init';
import { LoginController } from './login/login.controller';
import { SendOneTimePasswordController } from './one-time-password/send-one-time-password/send-one-time-password.controller';
import { VerifyOneTimePasswordController } from './one-time-password/verify-one-time-password/verify-one-time-password.controller';
import { PinController } from './pin/pin.controller';
import { PinResetController } from './pin-reset/pin-reset.controller';
import { ProviderLocationController } from './provider-location/provider-location.controller';
import { SessionController } from './session/session.controller';
import { AppointmentController } from './appointment/appointment.controller';
import { SmartPriceController } from './smart-price/smart-price.controller';
import { ImmunizationRecordController } from './immunization-record/immunization-record.controller';
import { PatientPastProceduresController } from './patient-past-procedures/patient-past-procedures.controller';
import { InviteCodeController } from './invite-code/invite-code.controller';
import { WaitlistController } from './waitlist/waitlist.controller';
import { SendRegistrationTextController } from './registration/send-registration-text.controller';
import { PrescriptionController } from './prescription/prescription.controller';
import { GeolocationController } from './geolocation/geolocation.controller';
import { ClaimsController } from './claims/claims.controller';
import { CMSContentController } from './content/cms-content.controller';
import { ClaimAlertController } from './claim-alert/claim-alert.controller';
import { SsoController } from './sso/sso.controller';
import { configurationMock } from '../mock-data/configuration.mock';
import { databaseMock } from '../mock-data/database.mock';
import { twilioMock } from '../mock-data/twilio.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { EventController } from './event/event.controller';

jest.mock('./smart-price/smart-price.controller');
const smartPriceControllerMock = SmartPriceController as jest.Mock;

jest.mock('./health/health.controller');
const mockHealthController = HealthController as unknown as jest.Mock;

jest.mock('./pin/pin.controller');
const mockPinController = PinController as jest.Mock;

jest.mock('./login/login.controller');
const loginControllerMock = LoginController as jest.Mock;

jest.mock('./members/members.controller');
const mockMembersController = MembersController as jest.Mock;

jest.mock('./members-contact-info/update-member-contact-info.controller');
const mockMemberContactInfoUpdateController =
  MemberContactInfoUpdateController as jest.Mock;

jest.mock('./pending-prescriptions/pending-prescriptions.controller');
const mockPendingPrescriptionsController =
  PendingPrescriptionsController as jest.Mock;

jest.mock('./provider-location/provider-location.controller');
const mockProviderLocationController = ProviderLocationController as jest.Mock;

jest.mock('./patient-test-results/patient-test-results.controller');
const mockPatientTestResultsController =
  PatientTestResultsController as jest.Mock;

jest.mock('./feed/feed.controller');
const mockFeedController = FeedController as jest.Mock;

jest.mock('./consent/consent.controller');
const mockConsentController = ConsentController as jest.Mock;

jest.mock('./session/session.controller');
const mockSessionController = SessionController as jest.Mock;

jest.mock('./appointment/appointment.controller');
const mockAppointmentController = AppointmentController as jest.Mock;

jest.mock(
  './one-time-password/send-one-time-password/send-one-time-password.controller'
);
const mockSendOneTimePasswordController =
  SendOneTimePasswordController as jest.Mock;

jest.mock(
  './one-time-password/verify-one-time-password/verify-one-time-password.controller'
);
const mockVerifyOneTimePasswordController =
  VerifyOneTimePasswordController as jest.Mock;

jest.mock('./immunization-record/immunization-record.controller');
const mockImmunizationRecordController =
  ImmunizationRecordController as jest.Mock;

jest.mock('./patient-past-procedures/patient-past-procedures.controller');
const mockPatientPastProceduresController =
  PatientPastProceduresController as jest.Mock;

jest.mock('./invite-code/invite-code.controller');
const mockInviteCodeController = InviteCodeController as jest.Mock;

jest.mock('./waitlist/waitlist.controller');
const mockWaitlistController = WaitlistController as jest.Mock;

jest.mock('./account/account.controller');
const mockAccountController = AccountController as jest.Mock;

jest.mock('./pin-reset/pin-reset.controller');
const mockPinResetController = PinResetController as jest.Mock;

jest.mock('./registration/send-registration-text.controller');
const mockSendRegistrationTextController =
  SendRegistrationTextController as jest.Mock;

jest.mock('./prescription/prescription.controller');
const mockPrescriptionController = PrescriptionController as jest.Mock;

jest.mock('./geolocation/geolocation.controller');
const mockGeolocationController = GeolocationController as jest.Mock;

jest.mock('./drug-price/drug-price.controller');
const mockDrugPriceController = DrugPriceController as jest.Mock;

jest.mock('./pharmacy-search/pharmacy-search.controller');
const mockPharmacySearchController = PharmacySearchController as jest.Mock;

jest.mock('./claims/claims.controller');
const mockClaimsController = ClaimsController as jest.Mock;

jest.mock('./content/cms-content.controller');
const mockCMSContentController = CMSContentController as jest.Mock;

jest.mock('./claim-alert/claim-alert.controller');
const mockClaimAlertController = ClaimAlertController as jest.Mock;

jest.mock('./event/event.controller');
const mockEventController = EventController as jest.Mock;

jest.mock('./sso/sso.controller');

describe('createControllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return IControllers object', () => {
    const controllers: IControllers = createControllers(
      configurationMock,
      databaseMock,
      twilioMock
    );

    expect(controllers).toEqual({
      accountController: {} as AccountController,
      appointmentController: {} as AppointmentController,
      consentController: {} as ConsentController,
      feedController: {} as FeedController,
      healthController: {} as HealthController,
      loginController: {} as LoginController,
      memberContactInfoUpdateController:
        {} as MemberContactInfoUpdateController,
      membersController: {} as MembersController,
      patientTestResultsController: {} as PatientTestResultsController,
      pendingPrescriptionsController: {} as PendingPrescriptionsController,
      pinController: {} as PinController,
      pinResetController: {} as PinResetController,
      providerLocationController: {} as ProviderLocationController,
      sendOneTimePasswordController: {} as SendOneTimePasswordController,
      sessionController: {} as SessionController,
      verifyOneTimePasswordController: {} as VerifyOneTimePasswordController,
      smartPriceController: {} as SmartPriceController,
      immunizationRecordController: {} as ImmunizationRecordController,
      patientPastProceduresController: {} as PatientPastProceduresController,
      inviteCodeController: {} as InviteCodeController,
      waitlistController: {} as WaitlistController,
      sendRegistrationTextController: {} as SendRegistrationTextController,
      prescriptionController: {} as PrescriptionController,
      geolocationController: {} as GeolocationController,
      drugPriceController: {} as DrugPriceController,
      pharmacySearchController: {} as PharmacySearchController,
      claimsController: {} as ClaimsController,
      cmsContentController: {} as CMSContentController,
      claimAlertController: {} as ClaimAlertController,
      ssoController: {} as SsoController,
      eventController: {} as EventController,
    });
  });

  it('calls AccountController constructor', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockAccountController).toHaveBeenCalledTimes(1);
    expect(mockAccountController).toHaveBeenCalledWith(
      configurationMock,
      databaseMock,
      twilioMock
    );
  });

  it('calls SendOneTimePasswordController constructor with parameters (endpoint version: %p)', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockSendOneTimePasswordController).toHaveBeenCalledWith(
      configurationMock,
      twilioMock
    );
  });

  it('calls VerifyOneTimePasswordController constructor with parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockVerifyOneTimePasswordController).toHaveBeenCalledWith(
      configurationMock,
      twilioMock,
      databaseMock
    );
  });

  it('calls HealthController constructor without parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockHealthController).toHaveBeenCalledTimes(1);
  });

  it('calls PinController constructor', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockPinController).toHaveBeenCalledWith(
      configurationMock,
      databaseMock
    );
  });

  it('calls ProviderLocationController constructor with parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockProviderLocationController).toHaveBeenCalledWith(
      databaseMock,
      configurationMock
    );
  });

  it('calls loginControllerMock constructor with parameters (version %p)', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(loginControllerMock).toHaveBeenCalledWith(
      databaseMock,
      configurationMock
    );
  });

  it('calls MembersController constructor with parameters (version %p)', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockMembersController).toHaveBeenCalledWith(
      configurationMock,
      databaseMock
    );
  });

  it('calls MemberContactInfoUpdateController constructor with parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockMemberContactInfoUpdateController).toHaveBeenCalledWith(
      configurationMock
    );
  });

  it('calls PendingPrescriptionsController constructor with parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockPendingPrescriptionsController).toHaveBeenCalledWith(
      databaseMock
    );
  });

  it('calls PatientTestResultsController constructor without parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockPatientTestResultsController).toHaveBeenCalledWith(
      databaseMock,
      configurationMock
    );
  });

  it('calls FeedController constructor with database and configuration parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockFeedController).toHaveBeenCalledWith(
      databaseMock,
      configurationMock
    );
  });

  it('calls ConsentController constructor with configuration parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockConsentController).toHaveBeenCalledWith(configurationMock);
  });

  it('calls SessionController constructor without parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockSessionController).toHaveBeenCalled();
  });

  it('calls AppointmentController constructor with parameters (version %p)', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expectToHaveBeenCalledOnceOnlyWith(
      mockAppointmentController,
      databaseMock,
      configurationMock
    );
  });

  it('calls SmartPriceController constructor with parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(smartPriceControllerMock).toHaveBeenCalledWith(
      configurationMock,
      databaseMock,
      twilioMock
    );
  });

  it('calls ImmunizationRecordController constructor with database and configuration parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockImmunizationRecordController).toHaveBeenCalledWith(
      databaseMock,
      configurationMock
    );
  });

  it('calls PatientPastProceduresController constructor with database parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockPatientPastProceduresController).toHaveBeenCalledWith(
      databaseMock
    );
  });

  it('calls InviteCodeController constructor with database parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockInviteCodeController).toHaveBeenCalledWith(
      databaseMock,
      configurationMock
    );
  });

  it('calls WaitlistController constructor with database and configuration parameter', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockWaitlistController).toHaveBeenCalledWith(
      databaseMock,
      configurationMock,
      twilioMock
    );
  });

  it('calls PinResetController constructor with database, configuration and twilio client parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expectToHaveBeenCalledOnceOnlyWith(
      mockPinResetController,
      configurationMock,
      databaseMock,
      twilioMock
    );
  });

  it('calls mockSendRegistrationTextController constructor with configuration and twilio client parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockSendRegistrationTextController).toHaveBeenCalledWith(
      configurationMock,
      twilioMock
    );
  });

  it('calls PrescriptionController constructor', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockPrescriptionController).toHaveBeenCalledWith(
      configurationMock,
      databaseMock,
      twilioMock
    );
  });

  it('calls geolocationController constructor without parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockGeolocationController).toHaveBeenCalledWith(configurationMock);
  });

  it('calls mockDrugPriceController constructor', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockDrugPriceController).toHaveBeenCalledWith(configurationMock);
  });

  it('calls mockPharmacySearchController constructor', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockPharmacySearchController).toHaveBeenCalledWith(
      configurationMock
    );
  });

  it('calls ClaimsController constructor without parameters', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockClaimsController).toHaveBeenCalledTimes(1);
    expect(mockClaimsController).toHaveBeenCalledWith(configurationMock);
  });

  it('calls mockCMSContentController constructor', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockCMSContentController).toHaveBeenCalledWith(configurationMock);
  });

  it('calls claimAlertController constructor', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockClaimAlertController).toHaveBeenCalledWith(
      databaseMock,
      configurationMock
    );
  });

  it('calls eventController constructor', () => {
    createControllers(configurationMock, databaseMock, twilioMock);

    expect(mockEventController).toHaveBeenCalled();
  });
});
