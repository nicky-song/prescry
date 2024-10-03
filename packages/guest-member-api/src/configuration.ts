// Copyright 2018 Prescryptive Health, Inc.

import dotenv from 'dotenv';
import { Logger } from 'winston';
import { ApiConstants } from './constants/api-constants';
import { setLogger } from './utils/winston-config';

export type KnownProcessorControllerNumber = 'X01' | 'T01' | 'P01';
export type KnownRxBin = '610749';
export type KnownRxGroup = '200P32F';
export type KnownPlanId = 'SMARTPRICE';
export type KnownPersonCode = '01' | '02' | '03';
export type KnownTwilioMessagingFromPhoneNumber =
  | '+14252306131'
  | '+14254904211';

export const DefaultSmartPriceProcessorControllerNumber: KnownProcessorControllerNumber =
  'X01';
export const DefaultSmartPriceRxGroup: KnownRxGroup = '200P32F';
export const DefaultTwilioMessagingFromPhoneNumber: KnownTwilioMessagingFromPhoneNumber =
  '+14254904211';

export const gearsAccountAuthPath = '/myrx-account/auth';
export const gearsAccountsPath = '/myrx-account/accounts';
export const gearsValidateIdentityPath = (smartContractAddress: string) =>
  `/myrx-account/digital-rx/${smartContractAddress}/validate`;
export const gearsValidateAndAddConsentPath = (smartContractAddress: string) =>
  `/myrx-account/digital-rx/${smartContractAddress}/consent`;
export const gearsClaimsPath = '/claim-history/claims';
export const gearsCoveragePath = '/eligibility/coverage';
export const gearsPatientPath = '/identity/patient';

export interface ICertificate {
  pfxFile: string;
  pfxPass: string;
}

export interface IAuth0Config {
  clientId: string;
  clientSecret: string;
  tokenApi: string;
  audienceAccumulators: string;
  audienceClaims: string;
  audienceIdentity: string;
}

export interface IConfiguration {
  smartPriceRxGroup: KnownRxGroup;
  smartPriceProcessorControllerNumber: KnownProcessorControllerNumber;
  accountTokenExpiryTime: number;
  alwaysAllowedFeatureFlags: string[];
  appInsightInstrumentationKey: string;
  appInsightServiceName: string;
  connectionString: string;
  corsWhiteList: string[];
  contentApiUrl: string;
  contentApiSmartPriceUserName: string;
  contentApiSmartPricePassword: string;
  environment: string;
  gearsApiSubscriptionKey: string;
  jwtTokenSecretKey: string;
  jwtTokenExpiryTime: number;
  logger: Logger;
  maxIdentityVerificationAttempts: number;
  maxPinVerificationAttempts: number;
  port: number;
  auth0: IAuth0Config;
  pharmacyPortalApiClientId: string;
  pharmacyPortalApiClientSecret: string;
  pharmacyPortalApiScope: string;
  pharmacyPortalApiTenantId: string;
  pharmacyPortalApiUrl: string;
  platformApiUrl: string;
  platformGearsApiUrl: string;
  platformPrescriptionApiHeaderKey: string;
  platformApiClientId: string;
  platformApiClientSecret: string;
  platformApiResource: string;
  platformApiTenantId: string;
  pricingApiHeaderKey: string;
  serviceBusConnectionString: string;
  topicNameHealthRecordEvent: string;
  topicNameAppointmentCancelledEvent: string;
  topicCommonBusinessEvent: string;
  topicCommonMonitoringEvent: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioEmailVerificationServiceId: string;
  twilioMessagingFromPhoneNumber: string;
  twilioVerificationServiceId: string;
  updatePersonTopicName: string;
  certificates: ICertificate;
  childMemberAgeLimit: number;
  deviceTokenExpiryTime: number;
  redisPort: number;
  redisHostName: string;
  redisAuthPass: string;
  redisDeviceTokenKeyExpiryTime: number;
  updateAccountTopicName: string;
  redisPinKeyExpiryTime: number;
  healthBotDefaultLocale: string;
  healthBotWebchatSecret: string;
  healthBotDirectLineTokenEp: string;
  healthBotAppSecret: string;
  redisPhoneNumberRegistrationKeyExpiryTime: number;
  redisPersonCreateKeyExpiryTime: number;
  redisPinVerificationKeyExpiryTime: number;
  redisIdentityVerificationKeyExpiryTime: number;
  redisNearbyPharmaciesKeyExpiryTime: number;
  redisCMSContentKeyExpiryTime: number;
  paymentsKeyPublic: string;
  paymentsKeyPrivate: string;
  orderNumberBlockLength: number;
  testPaymentsKeyPublic: string;
  testPaymentsKeyPrivate: string;
  cancelAppointmentWindowExpiryTimeInHours: number;
  redisPinResetScanDeleteCount: string;
  twilioRemoveWaitlistUrl: string;
  sendgridApiKey: string;
  ipStackApiUrl: string;
  ipStackApiKey: string;
  supportEmail: string;
  insuranceEligibilityApiRequestUrl: string;
  waystarInsuranceEligibilityApiUserId: string;
  waystarInsuranceEligibilityApiPassword: string;
  mapboxApiUrl: string;
  mapboxAccessToken: string;
  myrxIdentityTenantId: string;
  partnerJwksMap: Map<string, string>;
}

const defaultHealthBotDefaultLocale = 'en-US';
const defaultHealthBotDirectLineTokenEp = `https://directline.botframework.com/v3/directline/tokens/generate`;

const otherCorsHosts = 'test.prescryptive.com,test.prescryptive.io,localhost';

export function getEnvironmentConfiguration(): IConfiguration {
  dotenv.config();
  dotenv.config({
    path: './env.guest-member-api.test.md',
  });
  dotenv.config({
    path: './.env.guest-member-api.test.md',
  });
  const connectionString = process.env.DATABASE_CONNECTION;
  if (!connectionString) {
    throw new Error('DATABASE_CONNECTION missing');
  }

  const jwtTokenSecretKey = process.env.JWT_TOKEN_SECRET_KEY;
  if (!jwtTokenSecretKey) {
    throw new Error('JWT_TOKEN_SECRET_KEY missing');
  }

  if (!process.env.JWT_TOKEN_EXPIRES_IN) {
    throw new Error('JWT_TOKEN_EXPIRES_IN missing');
  }

  const jwtTokenExpiryTime = parseInt(process.env.JWT_TOKEN_EXPIRES_IN, 10);
  if (isNaN(jwtTokenExpiryTime)) {
    throw new Error('JWT_TOKEN_EXPIRES_IN is invalid. Must be an Integer');
  }

  const appInsightInstrumentationKey =
    process.env.APPINSIGHTS_INSTRUMENTATION_KEY;
  if (!appInsightInstrumentationKey) {
    throw new Error('APPINSIGHTS_INSTRUMENTATION_KEY missing');
  }

  const appInsightServiceName =
    process.env.APPINSIGHTS_SERVICE_NAME_API || 'rxassistant-api';

  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  if (!twilioAccountSid) {
    throw new Error('TWILIO_ACCOUNT_SID missing');
  }

  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  if (!twilioAuthToken) {
    throw new Error('TWILIO_AUTH_TOKEN missing');
  }

  const twilioVerificationServiceId =
    process.env.TWILIO_VERIFICATION_SERVICE_ID;
  if (!twilioVerificationServiceId) {
    throw new Error('TWILIO_VERIFICATION_SERVICE_ID missing');
  }

  const twilioEmailVerificationServiceId =
    process.env.TWILIO_EMAIL_VERIFICATION_SERVICE_ID;
  if (!twilioEmailVerificationServiceId) {
    throw new Error('TWILIO_EMAIL_VERIFICATION_SERVICE_ID missing');
  }
  const serviceBusConnectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
  if (!serviceBusConnectionString) {
    throw new Error('SERVICE_BUS_CONNECTION_STRING missing');
  }

  const updatePersonTopicName = process.env.TOPIC_NAME_UPDATE_PERSON;
  if (!updatePersonTopicName) {
    throw new Error('TOPIC_NAME_UPDATE_PERSON missing');
  }

  const winstonLogFilePath = process.env.WINSTON_LOG_FILE_PATH;
  if (!winstonLogFilePath) {
    throw new Error('WINSTON_LOG_FILE_PATH missing');
  }
  const logger = setLogger(winstonLogFilePath);
  const environment = process.env.ENVIRONMENT || 'test';
  logger.info(
    `Initializing environment NODE_ENV ${process.env.NODE_ENV}, ENVIRONMENT ${process.env.ENVIRONMENT} and environment ${environment}`
  );

  const topicNameHealthRecordEvent =
    process.env.TOPIC_NAME_UPDATE_HEALTH_RECORD_EVENT;
  if (!topicNameHealthRecordEvent) {
    throw new Error('TOPIC_NAME_UPDATE_HEALTH_RECORD_EVENT missing');
  }

  const topicNameAppointmentCancelledEvent =
    process.env.TOPIC_NAME_APPOINTMENT_CANCELLED_EVENT;

  if (!topicNameAppointmentCancelledEvent) {
    throw new Error('TOPIC_NAME_APPOINTMENT_CANCELLED_EVENT missing');
  }

  const pfxFile = process.env.CERTIFICATE_PFX_FILE;
  const pfxPass = process.env.CERTIFICATE_PFX_PASS;
  if (!pfxFile) {
    throw new Error('CERTIFICATE_PFX_FILE missing');
  }
  if (!pfxPass) {
    throw new Error('CERTIFICATE_PFX_PASS missing');
  }
  const certificates: ICertificate = { pfxFile, pfxPass };

  let port;
  if (process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
    if (isNaN(port)) {
      throw new Error('PORT invalid');
    }
  } else {
    throw new Error('PORT missing');
  }

  const corsHostsConfig = process.env.GUESTMEMBEREXPERIENCE_CORS_HOSTS || '';
  const oldHostConfig = process.env.GUESTMEMBEREXPERIENCE_HOST || ''; // remove old env when done implementing the new key
  if (!corsHostsConfig && !oldHostConfig) {
    throw new Error('GUESTMEMBEREXPERIENCE_CORS_HOSTS missing');
  }
  const corsWhiteList = `${corsHostsConfig},${oldHostConfig},${otherCorsHosts}`
    .split(',')
    .filter((f) => f);

  let childMemberAgeLimit = ApiConstants.CHILD_MEMBER_AGE_LIMIT;
  if (process.env.CHILD_MEMBER_AGE_LIMIT) {
    childMemberAgeLimit = parseInt(process.env.CHILD_MEMBER_AGE_LIMIT, 10);
  }

  const defaultAccountTokenExpiryTime = '1800';

  const accountTokenExpiryTime = parseInt(
    process.env.ACCOUNT_TOKEN_EXPIRES_IN || defaultAccountTokenExpiryTime,
    10
  );

  if (isNaN(accountTokenExpiryTime)) {
    throw new Error('ACCOUNT_TOKEN_EXPIRES_IN is invalid. Must be an Integer');
  }

  if (!process.env.DEVICE_TOKEN_EXPIRES_IN) {
    throw new Error('DEVICE_TOKEN_EXPIRES_IN missing');
  }

  const deviceTokenExpiryTime = parseInt(
    process.env.DEVICE_TOKEN_EXPIRES_IN,
    10
  );
  if (isNaN(deviceTokenExpiryTime)) {
    throw new Error('DEVICE_TOKEN_EXPIRES_IN is invalid. Must be an Integer');
  }

  if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT missing');
  }

  const redisPort = parseInt(process.env.REDIS_PORT, 10);
  if (isNaN(redisPort)) {
    throw new Error('REDIS_PORT is invalid. Must be an Integer');
  }

  const redisHostName = process.env.REDIS_HOST;
  if (!redisHostName) {
    throw new Error('REDIS_HOST missing');
  }

  const redisAuthPass = process.env.REDIS_AUTH_PASS;
  if (!redisAuthPass) {
    throw new Error('REDIS_AUTH_PASS missing');
  }

  const defaultRedisPhoneKeyExpiryTime = '31536000';

  const redisDeviceTokenKeyExpiryTime = parseInt(
    process.env.REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN ||
      defaultRedisPhoneKeyExpiryTime,
    10
  );

  if (isNaN(redisDeviceTokenKeyExpiryTime)) {
    throw new Error(
      'REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN is invalid. Must be an Integer'
    );
  }

  const updateAccountTopicName = process.env.TOPIC_NAME_UPDATE_ACCOUNT;
  if (!updateAccountTopicName) {
    throw new Error('TOPIC_NAME_UPDATE_ACCOUNT missing');
  }

  const topicCommonBusinessEvent = process.env.TOPIC_NAME_COMMON_BUSINESS_EVENT;
  if (!topicCommonBusinessEvent) {
    throw new Error('TOPIC_NAME_COMMON_BUSINESS_EVENT missing');
  }

  const topicCommonMonitoringEvent =
    process.env.TOPIC_NAME_COMMON_MONITORING_EVENT;
  if (!topicCommonMonitoringEvent) {
    throw new Error('TOPIC_NAME_COMMON_MONITORING_EVENT missing');
  }

  const defaultRedisPinKeyExpiryTime = '1800';

  const redisPinKeyExpiryTime = parseInt(
    process.env.REDIS_PIN_KEY_EXPIRES_IN || defaultRedisPinKeyExpiryTime,
    10
  );

  if (isNaN(redisPinKeyExpiryTime)) {
    throw new Error('REDIS_PIN_KEY_EXPIRES_IN is invalid. Must be an Integer');
  }

  const defaultMaxPinVerificationAttempts = '5';
  const maxPinVerificationAttempts = parseInt(
    process.env.MAX_PIN_VERIFICATION_ATTEMPTS ||
      defaultMaxPinVerificationAttempts,
    10
  );

  const defaultMaxIdentityVerificationAttempts = '5';
  const maxIdentityVerificationAttempts = parseInt(
    process.env.MAX_IDENTITY_VERIFICATION_ATTEMPTS ||
      defaultMaxIdentityVerificationAttempts,
    10
  );

  if (isNaN(maxPinVerificationAttempts)) {
    throw new Error(
      'MAX_PIN_VERIFICATION_ATTEMPTS is invalid. Must be an Integer'
    );
  }

  const healthBotWebchatSecret = process.env.HEALTHBOT_WEBCHAT_SECRET;
  if (!healthBotWebchatSecret) {
    throw new Error('HEALTHBOT_WEBCHAT_SECRET missing');
  }

  const healthBotAppSecret = process.env.HEALTHBOT_APP_SECRET;
  if (!healthBotAppSecret) {
    throw new Error('HEALTHBOT_APP_SECRET missing');
  }
  const defaultRedisPhoneNumberRegistrationKeyExpiryTime = '1800';

  const redisPhoneNumberRegistrationKeyExpiryTime = parseInt(
    process.env.REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN ||
      defaultRedisPhoneNumberRegistrationKeyExpiryTime,
    10
  );

  if (isNaN(redisPhoneNumberRegistrationKeyExpiryTime)) {
    throw new Error(
      'REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN is invalid. Must be an Integer'
    );
  }
  const defaultRedisPersonCreateKeyExpiryTime = '1800';

  const redisPersonCreateKeyExpiryTime = parseInt(
    process.env.REDIS_PERSON_CREATE_KEY_EXPIRES_IN ||
      defaultRedisPersonCreateKeyExpiryTime,
    10
  );

  if (isNaN(redisPersonCreateKeyExpiryTime)) {
    throw new Error(
      'REDIS_PERSON_CREATE_KEY_EXPIRES_IN is invalid. Must be an Integer'
    );
  }

  const defaultRedisPinVerificationKeyExpiryTime = '3600';

  const redisPinVerificationKeyExpiryTime = parseInt(
    process.env.REDIS_PIN_VERIFICATION_KEY_EXPIRES_IN ||
      defaultRedisPinVerificationKeyExpiryTime,
    10
  );

  if (isNaN(redisPinVerificationKeyExpiryTime)) {
    throw new Error(
      'REDIS_PIN_VERIFICATION_KEY_EXPIRES_IN is invalid. Must be an Integer'
    );
  }

  const defaultRedisIdentityVerificationKeyExpiryTime = '3600';

  const redisIdentityVerificationKeyExpiryTime = parseInt(
    process.env.REDIS_IDENTITY_VERIFICATION_KEY_EXPIRES_IN ||
      defaultRedisIdentityVerificationKeyExpiryTime,
    10
  );

  if (isNaN(redisIdentityVerificationKeyExpiryTime)) {
    throw new Error(
      'REDIS_IDENTITY_VERIFICATION_KEY_EXPIRES_IN is invalid. Must be an Integer'
    );
  }

  const defaultNearbyPharmaciesKeyExpiryTime = '7200';

  const redisNearbyPharmaciesKeyExpiryTime = parseInt(
    process.env.REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN ||
      defaultNearbyPharmaciesKeyExpiryTime,
    10
  );

  if (isNaN(redisNearbyPharmaciesKeyExpiryTime)) {
    throw new Error(
      'REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN is invalid. Must be an Integer'
    );
  }

  const defaultCMSContentKeyExpiryTime = '1800';

  const redisCMSContentKeyExpiryTime = parseInt(
    process.env.REDIS_CMS_CONTENT_KEY_EXPIRES_IN ||
      defaultCMSContentKeyExpiryTime,
    10
  );

  if (isNaN(redisCMSContentKeyExpiryTime)) {
    throw new Error(
      'REDIS_CMS_CONTENT_KEY_EXPIRES_IN is invalid. Must be an Integer'
    );
  }

  const redisPinResetScanDeleteCount =
    process.env.REDIS_PIN_RESET_SCAN_DELETE_COUNT ?? '1000';

  const defaultOrderNumberBlockLength = '100';

  const orderNumberBlockLength = parseInt(
    process.env.ORDER_NUMBER_BLOCK_LENGTH || defaultOrderNumberBlockLength,
    10
  );

  const defaultCancelAppointmentWindowExpiryInHours = '6';

  const cancelAppointmentWindowExpiryTimeInHours = parseInt(
    process.env.CANCEL_APPOINTMENT_WINDOW_EXPIRY_IN_HOURS ||
      defaultCancelAppointmentWindowExpiryInHours,
    10
  );

  const paymentsKeyPublic = process.env.PAYMENTS_KEY_PUBLIC;
  if (!paymentsKeyPublic) {
    throw new Error('PAYMENTS_KEY_PUBLIC missing');
  }

  const paymentsKeyPrivate = process.env.PAYMENTS_KEY_PRIVATE;
  if (!paymentsKeyPrivate) {
    throw new Error('PAYMENTS_KEY_PRIVATE missing');
  }

  const testPaymentsKeyPublic = process.env.PAYMENTS_KEY_PUBLIC_TEST;
  if (!testPaymentsKeyPublic) {
    throw new Error('PAYMENTS_KEY_PUBLIC_TEST missing');
  }

  const testPaymentsKeyPrivate = process.env.PAYMENTS_KEY_PRIVATE_TEST;
  if (!testPaymentsKeyPrivate) {
    throw new Error('PAYMENTS_KEY_PRIVATE_TEST missing');
  }

  const smartPriceRxGroup: KnownRxGroup = (process.env.SMART_PRICE_RXGROUP ||
    DefaultSmartPriceRxGroup) as KnownRxGroup;

  const smartPriceProcessorControllerNumber: KnownProcessorControllerNumber =
    (process.env.SMART_PRICE_PROCESSORCONTROLLERNUMBER ||
      DefaultSmartPriceProcessorControllerNumber) as KnownProcessorControllerNumber;

  const twilioMessagingFromPhoneNumber: KnownTwilioMessagingFromPhoneNumber =
    (process.env.TWILIO_MESSAGING_FROM_PHONE_NUMBER ||
      DefaultTwilioMessagingFromPhoneNumber) as KnownTwilioMessagingFromPhoneNumber;

  const alwaysAllowedFeatureFlags = process.env.ALWAYS_ALLOWED_FEATURE_FLAGS
    ? process.env.ALWAYS_ALLOWED_FEATURE_FLAGS.split(',')
    : [];

  const auth0ApiClientId = process.env.AUTH0_API_CLIENT_ID;
  if (!auth0ApiClientId) {
    throw new Error('AUTH0_API_CLIENT_ID missing');
  }

  const auth0ApiClientSecret = process.env.AUTH0_API_CLIENT_SECRET;
  if (!auth0ApiClientSecret) {
    throw new Error('AUTH0_API_CLIENT_SECRET missing');
  }

  const auth0TokenApi = process.env.AUTH0_TOKEN_API;
  if (!auth0TokenApi) {
    throw new Error('AUTH0_TOKEN_API missing');
  }

  const auth0AudienceAccumulators = process.env.AUTH0_AUDIENCE_ACCUMULATORS;
  if (!auth0AudienceAccumulators) {
    throw new Error('AUTH0_AUDIENCE_ACCUMULATORS missing');
  }

  const auth0AudienceClaims = process.env.AUTH0_AUDIENCE_CLAIMS;
  if (!auth0AudienceClaims) {
    throw new Error('AUTH0_AUDIENCE_CLAIMS missing');
  }

  const auth0AudienceIdentity = process.env.AUTH0_AUDIENCE_IDENTITY;
  if (!auth0AudienceIdentity) {
    throw new Error('AUTH0_AUDIENCE_IDENTITY missing');
  }

  const pharmacyPortalApiClientId = process.env.PHARMACY_PORTAL_API_CLIENT_ID;
  if (!pharmacyPortalApiClientId) {
    throw new Error('PHARMACY_PORTAL_API_CLIENT_ID missing');
  }

  const pharmacyPortalApiTenantId = process.env.PHARMACY_PORTAL_API_TENANT_ID;
  if (!pharmacyPortalApiTenantId) {
    throw new Error('PHARMACY_PORTAL_API_TENANT_ID missing');
  }

  const pharmacyPortalApiScope = process.env.PHARMACY_PORTAL_API_SCOPE;
  if (!pharmacyPortalApiScope) {
    throw new Error('PHARMACY_PORTAL_API_SCOPE missing');
  }

  const pharmacyPortalApiClientSecret =
    process.env.PHARMACY_PORTAL_API_CLIENT_SECRET;
  if (!pharmacyPortalApiClientSecret) {
    throw new Error('PHARMACY_PORTAL_API_CLIENT_SECRET missing');
  }

  const pharmacyPortalApiUrl = process.env.PHARMACY_PORTAL_API_URL;
  if (!pharmacyPortalApiUrl) {
    throw new Error('PHARMACY_PORTAL_API_URL missing');
  }

  const twilioRemoveWaitlistUrl = process.env.TWILIO_REMOVE_WAITLIST_URL;
  if (!twilioRemoveWaitlistUrl) {
    throw new Error('TWILIO_REMOVE_WAITLIST_URL missing');
  }
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  if (!sendgridApiKey) {
    throw new Error('SENDGRID_API_KEY missing');
  }

  const ipStackApiUrl = process.env.IPSTACK_API_URL;
  if (!ipStackApiUrl) {
    throw new Error('IPSTACK_API_URL missing');
  }
  const ipStackApiKey = process.env.IPSTACK_API_KEY;
  if (!ipStackApiKey) {
    throw new Error('IPSTACK_API_KEY missing');
  }

  const platformApiUrl = process.env.PLATFORM_API_URL;
  if (!platformApiUrl) {
    throw new Error('PLATFORM_API_URL missing');
  }

  const platformGearsApiUrl = process.env.PLATFORM_GEARS_API_URL;
  if (!platformGearsApiUrl) {
    throw new Error('PLATFORM_GEARS_API_URL missing');
  }

  const gearsApiSubscriptionKey = process.env.GEARS_API_SUBSCRIPTION_KEY;
  if (!gearsApiSubscriptionKey) {
    throw new Error('GEARS_API_SUBSCRIPTION_KEY missing');
  }

  const contentApiUrl = process.env.CONTENT_API_URL;
  if (!contentApiUrl) {
    throw new Error('CONTENT_API_URL missing');
  }

  const platformPrescriptionApiHeaderKey =
    process.env.PLATFORM_PRESCRIPTION_API_HEADER_KEY;
  if (!platformPrescriptionApiHeaderKey) {
    throw new Error('PLATFORM_PRESCRIPTION_API_HEADER_KEY missing');
  }

  const platformApiClientId = process.env.PLATFORM_API_CLIENT_ID;
  if (!platformApiClientId) {
    throw new Error('PLATFORM_API_CLIENT_ID missing');
  }

  const platformApiClientSecret = process.env.PLATFORM_API_CLIENT_SECRET;
  if (!platformApiClientSecret) {
    throw new Error('PLATFORM_API_CLIENT_SECRET missing');
  }
  const platformApiTenantId = process.env.PLATFORM_API_TENANT_ID;
  if (!platformApiTenantId) {
    throw new Error('PLATFORM_API_TENANT_ID missing');
  }

  const platformApiResource = process.env.PLATFORM_API_RESOURCE;
  if (!platformApiResource) {
    throw new Error('PLATFORM_API_RESOURCE missing');
  }

  const pricingApiHeaderKey = process.env.PRICING_API_HEADER_KEY;
  if (!pricingApiHeaderKey) {
    throw new Error('PRICING_API_HEADER_KEY missing');
  }

  const contentApiSmartPriceUserName =
    process.env.CONTENT_API_SMARTPRICE_USERNAME;
  if (!contentApiSmartPriceUserName) {
    throw new Error('CONTENT_API_SMARTPRICE_USERNAME missing');
  }

  const contentApiSmartPricePassword =
    process.env.CONTENT_API_SMARTPRICE_PASSWORD;
  if (!contentApiSmartPricePassword) {
    throw new Error('CONTENT_API_SMARTPRICE_PASSWORD missing');
  }

  const insuranceEligibilityApiRequestUrl =
    process.env.INSURANCE_ELIGIBILITY_API_REQUEST_URL;
  if (!insuranceEligibilityApiRequestUrl) {
    throw new Error('INSURANCE_ELIGIBILITY_API_REQUEST_URL missing');
  }

  const waystarInsuranceEligibilityApiUserId =
    process.env.WAYSTAR_INSURANCE_ELIGIBILITY_API_USER_ID;
  if (!waystarInsuranceEligibilityApiUserId) {
    throw new Error('WAYSTAR_INSURANCE_ELIGIBILITY_API_USER_ID missing');
  }

  const waystarInsuranceEligibilityApiPassword =
    process.env.WAYSTAR_INSURANCE_ELIGIBILITY_API_PASSWORD;
  if (!waystarInsuranceEligibilityApiPassword) {
    throw new Error('WAYSTAR_INSURANCE_ELIGIBILITY_API_PASSWORD missing');
  }

  const supportEmail = process.env.SUPPORT_EMAIL ?? ApiConstants.SUPPORT_EMAIL;

  const mapboxApiUrl = process.env.MAPBOX_API_URL;
  if (!mapboxApiUrl) {
    throw new Error('MAPBOX_API_URL missing');
  }

  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!mapboxAccessToken) {
    throw new Error('MAPBOX_ACCESS_TOKEN missing');
  }

  const myrxIdentityTenantId = process.env.MYRX_IDENTITY_TENANT_ID;
  if (!myrxIdentityTenantId) {
    throw new Error('MYRX_IDENTITY_TENANT_ID missing');
  }

  const partnerJwksMap = new Map();

  if (process.env.PARTNER_JWKS_ENDPOINTS) {
    const endPoints = process.env.PARTNER_JWKS_ENDPOINTS.split(',');

    endPoints.forEach((entry) => {
      const endPoint = entry.split(';');
      if (endPoint.length > 1) {
        partnerJwksMap.set(endPoint[0], endPoint[1]);
      }
    });
  }

  return {
    accountTokenExpiryTime,
    alwaysAllowedFeatureFlags,
    appInsightInstrumentationKey,
    appInsightServiceName,
    certificates,
    childMemberAgeLimit,
    connectionString,
    corsWhiteList,
    contentApiUrl,
    contentApiSmartPricePassword,
    contentApiSmartPriceUserName,
    deviceTokenExpiryTime,
    environment,
    gearsApiSubscriptionKey,
    healthBotAppSecret,
    healthBotDefaultLocale: defaultHealthBotDefaultLocale,
    healthBotDirectLineTokenEp: defaultHealthBotDirectLineTokenEp,
    healthBotWebchatSecret,
    jwtTokenExpiryTime,
    jwtTokenSecretKey,
    logger,
    maxIdentityVerificationAttempts,
    maxPinVerificationAttempts,
    paymentsKeyPrivate,
    paymentsKeyPublic,
    auth0: {
      clientId: auth0ApiClientId,
      clientSecret: auth0ApiClientSecret,
      tokenApi: auth0TokenApi,
      audienceAccumulators: auth0AudienceAccumulators,
      audienceClaims: auth0AudienceClaims,
      audienceIdentity: auth0AudienceIdentity,
    },
    pharmacyPortalApiClientId,
    pharmacyPortalApiClientSecret,
    pharmacyPortalApiScope,
    pharmacyPortalApiTenantId,
    pharmacyPortalApiUrl,
    platformApiUrl,
    platformGearsApiUrl,
    platformPrescriptionApiHeaderKey,
    platformApiClientId,
    platformApiClientSecret,
    platformApiResource,
    platformApiTenantId,
    pricingApiHeaderKey,
    port,
    redisAuthPass,
    redisDeviceTokenKeyExpiryTime,
    redisHostName,
    redisPersonCreateKeyExpiryTime,
    redisPhoneNumberRegistrationKeyExpiryTime,
    redisPinKeyExpiryTime,
    redisPinVerificationKeyExpiryTime,
    redisIdentityVerificationKeyExpiryTime,
    redisNearbyPharmaciesKeyExpiryTime,
    redisCMSContentKeyExpiryTime,
    redisPort,
    serviceBusConnectionString,
    smartPriceProcessorControllerNumber,
    smartPriceRxGroup,
    supportEmail,
    topicNameHealthRecordEvent,
    topicNameAppointmentCancelledEvent,
    topicCommonBusinessEvent,
    topicCommonMonitoringEvent,
    twilioAccountSid,
    twilioAuthToken,
    twilioEmailVerificationServiceId,
    twilioMessagingFromPhoneNumber,
    twilioVerificationServiceId,
    twilioRemoveWaitlistUrl,
    updateAccountTopicName,
    updatePersonTopicName,
    orderNumberBlockLength,
    cancelAppointmentWindowExpiryTimeInHours,
    testPaymentsKeyPublic,
    testPaymentsKeyPrivate,
    redisPinResetScanDeleteCount,
    sendgridApiKey,
    ipStackApiUrl,
    ipStackApiKey,
    insuranceEligibilityApiRequestUrl,
    waystarInsuranceEligibilityApiUserId,
    waystarInsuranceEligibilityApiPassword,
    mapboxApiUrl,
    mapboxAccessToken,
    myrxIdentityTenantId,
    partnerJwksMap,
  };
}
