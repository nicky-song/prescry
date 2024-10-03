// Copyright 2018 Prescryptive Health, Inc.

import type { IApiConfig, IConfigState } from '../../utils/api.helper';

export type GuestExperienceConfigApiNames =
  | 'contentManagementApi'
  | 'domainDataApi'
  | 'guestExperienceApi';

const contentManagementApi: IApiConfig = {
  env: {
    host: '127.0.0.1',
    port: '443',
    protocol: 'https',
    version: '',
    url: '',
  },
  paths: {
    learnMore: '/learn-mores/:id',
    uiContent:
      '/ui-content?ExperienceKey=:experience&Version=:version&_limit=-1',
  },
};

const domainDataApi: IApiConfig = {
  env: {
    host: '127.0.0.1',
    port: '443',
    protocol: 'https',
    version: '',
    url: '',
  },
  paths: {
    drugForms: '/dds/1.0/forms',
    drugSearch: `/dds/2.0/drugs?filter=:filter&groupplancode=:rxSubGroup&maxResults=:maxResults`,
    elasticDrugSearch: `/drugsearch/3.0/drugs?filter=:filter&groupplancode=:rxSubGroup&maxResults=:maxResults`,
    elasticDrugSearchAll: `/drugsearch/3.0/drugs?filter=:filter&maxResults=:maxResults`,
  },
};

const guestExperienceApi: IApiConfig = {
  env: {
    host: '127.0.0.1',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    addPin: '/account/add',
    acceptConsent: '/consent',
    accumulators: '/claims/accumulators',
    addRecoveryEmail: '/account/email/add',
    appointmentDetails: '/appointment/:id',
    appointments: '/appointments',
    availableSlots: '/provider-location/get-availability',
    claimHistory: '/claims',
    claimAlert: '/claim-alert/:identifier',
    createAccount: '/accounts',
    createBooking: '/provider-location/create-booking',
    cancelBooking: '/provider-location/cancel-booking',
    lockSlot: '/provider-location/lock-slot',
    unlockSlot: '/provider-location/unlock-slot/:id',
    feed: '/feed',
    content:
      '/content?groupKey=:groupKey&language=:language&version=:version&experienceKey=:experienceKey',
    geolocation:
      '/geolocation?zipcode=:zipCode&latitude=:latitude&longitude=:longitude',
    geolocationPharmacies:
      '/geolocation/pharmacies?zipcode=:zipCode&latitude=:latitude&longitude=:longitude',
    geolocationAutocomplete: '/geolocation/autocomplete?query=:query',
    immunizationRecord: '/immunization/:id',
    inviteCode: '/invite-code/:code',
    joinWaitlist: '/waitlist',
    languageCode: '/account/language-code',
    login: '/login',
    medicineCabinet: '/prescription/get-cabinet',
    members: '/members',
    eventNotifications: '/event/notifications',
    eventErrors: '/event/errors',
    pastProcedures: '/past-procedures-list',
    pendingPrescriptions: '/pending-prescriptions/:id',
    prescriptionInfo: '/prescription/:prescriptionId',
    prescriptionPharmacies:
      '/prescription/search-pharmacy/:prescriptionId?zipcode=:zipCode&latitude=:latitude&longitude=:longitude&sortby=:sortby&distance=:distance',
    prescriptionSend: '/prescription/send-prescription',
    prescriptionTransfer: '/prescription/transfer',
    prescriptionUserStatus: '/prescription/user-status/:identifier',
    providerLocationDetails: '/provider-location/:identifier',
    providerLocations: '/provider-location',
    resetPin: '/pin-reset/reset',
    searchAlternativeDrugPrice:
      '/drug/alternative-search-price?ndc=:ndc&ncpdp=:ncpdp',
    searchDrugPrice:
      '/drug/search-price?zipcode=:zipCode&latitude=:latitude&longitude=:longitude&ndc=:ndc&supply=:supply&quantity=:quantity&sortby=:sortby&distance=:distance',
    searchDrugPriceAuth:
      '/drug/auth-search-price?zipcode=:zipCode&latitude=:latitude&longitude=:longitude&ndc=:ndc&supply=:supply&quantity=:quantity&sortby=:sortby&distance=:distance',
    searchPharmacyAuth: '/pharmacy/auth-search?zipcode=:zipCode&start=:start',
    searchPharmacy: '/pharmacy/search?zipcode=:zipCode&start=:start',
    sendOneTimePassword: '/one-time-password/send',
    sendRegistrationText: '/send-registration-text',
    sendVerificationCode: '/pin-reset/send-code',
    session: '/session',
    testResult: '/test-results',
    updateMember: '/member/:id',
    updatePin: '/account/pin/update',
    updateRecoveryEmail: '/account/email/update',
    favoritedPharmacies: '/account/favorited-pharmacies',
    updateFeatureKnown: '/account/feature-known',
    verifyIdentity: '/pin-reset/verify-identity',
    verifyOneTimePassword: '/one-time-password/verify',
    verifySsoJwt: '/sso/jwt/verify',
    verifyMembership: '/members/verify',
    verifyPin: '/account/pin/verify',
    verifyPrescription: '/prescription/verify/:prescriptionId',
    verifyPatientInfo: '/prescription/verify-patient/:smartContractAddress',
  },
  retryPolicy: {
    pause: 2000,
    remaining: 3,
  },
};

export type IPaymentsConfig = Record<
  'experienceBaseUrl' | 'publicKey' | 'testPublicKey',
  string
>;

export interface IGuestExperienceConfig
  extends IConfigState<GuestExperienceConfigApiNames> {
  supportEmail: string;
  memberSupportEmail: string;
  memberPortalUrl: string;
  payments: IPaymentsConfig;
  cancelAppointmentWindowHours: string;
  childMemberAgeLimit: number;
  cmsRefreshInterval: number;
  domainDataSearchKeyPublic: string;
  talkativeJavascriptUrl: string;
  transPerfectJavascriptUrl: string;
  transPerfectKey: string;
}

export const GuestExperienceConfig: IGuestExperienceConfig = {
  allowedActionTypeList: [
    'SELECT_OFFER',
    'ACCEPT_OFFER',
    'SELECT_RECOMMENDATION',
    'SELECT_PRESCRIPTION_RECOMMENDATION_TYPE',
    'THROW_FATAL_ERROR',
    'OPEN_MODAL_POPUP',
    'SET_WELCOME_MESSAGE ',
    'SET_LOGIN_PHONE_NUMBER',
    'SET_MEMBER_LOGIN_INFO',
    'SET_MISSING_ACCOUNT_ERROR_MESSAGE',
    'OPEN_ADDRESS_MODAL',
    'BUSY_SHOW',
    'GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR',
    'SET_HAS_PIN_MISMATCHED',
    'SET_NUMBER_OF_FAILED_ATTEMPTS_TO_VERIFY',
    'SET_ERROR_CODE',
    'SET_NUMBER_IS_UNSUPPORTED',
    'SET_SEND_ONE_TIME_PASSWORD_STATUS',
    'SET_VERIFICATION_CODE_ERROR_STATE',
    'APPOINTMENT_SET_SELECTED_LOCATION',
    'CREATE_BOOKING_ERROR',
    'Navigation/BACK',
    'Navigation/NAVIGATE',
  ],
  apis: {
    contentManagementApi,
    domainDataApi,
    guestExperienceApi,
  },
  auth: {
    clientId: '<MISSING>',
    tenantId: '<MISSING>',
  },
  currentDate: new Date(),
  location: undefined,
  memberPortalUrl: 'https://prescryptive.com/member',
  memberTerms: ['<MISSING>'],
  supportEmail: 'support@prescryptive.com',
  memberSupportEmail: 'membersupport@prescryptive.com',
  payments: {
    experienceBaseUrl: '<MISSING>',
    publicKey: '<MISSING>',
    testPublicKey: '<MISSING>',
  },
  telemetry: {
    instrumentationKey: '<MISSING>',
    serviceName: '<MISSING>',
  },
  cancelAppointmentWindowHours: '6',
  childMemberAgeLimit: 13,
  cmsRefreshInterval: 1800000,
  domainDataSearchKeyPublic: '<MISSING>',
  talkativeJavascriptUrl: '<MISSING>',
  transPerfectJavascriptUrl: '<MISSING>',
  transPerfectKey: '<MISSING>',
};
