// Copyright 2018 Prescryptive Health, Inc.

import { config } from 'dotenv';
import {
  getEnvironmentConfiguration,
  IConfiguration,
  DefaultSmartPriceRxGroup,
  DefaultSmartPriceProcessorControllerNumber,
  KnownRxGroup,
  KnownProcessorControllerNumber,
  DefaultTwilioMessagingFromPhoneNumber,
} from './configuration';
import { ApiConstants } from './constants/api-constants';
import { Logger } from 'winston';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));
const configMock = config as unknown as jest.Mock;

beforeEach(() => {
  jest.resetModules(); // this is important
  process.env.DATABASE_CONNECTION = 'fake';
  process.env.ALWAYS_ALLOWED_FEATURE_FLAGS = 'usevaccine';
  process.env.APPINSIGHTS_INSTRUMENTATION_KEY = 'fake-key';
  process.env.APPINSIGHTS_SERVICE_NAME_API = 'fake-name';
  process.env.JWT_TOKEN_SECRET_KEY = 'fake-key';
  process.env.JWT_TOKEN_EXPIRES_IN = '1800';
  process.env.TWILIO_ACCOUNT_SID = 'AC-fake-account-sid';
  process.env.TWILIO_AUTH_TOKEN = 'fake-auth-token';
  process.env.TWILIO_VERIFICATION_SERVICE_ID = 'fake-verification-sid';
  process.env.TWILIO_MESSAGING_FROM_PHONE_NUMBER = 'fake-twilio-phone';
  process.env.SERVICE_BUS_CONNECTION_STRING = 'fake-connection-string';
  process.env.TOPIC_NAME_UPDATE_PERSON = 'fake-person-topic';
  process.env.TWILIO_ACCOUNT_SID = 'fake-account-sid';
  process.env.TWILIO_AUTH_TOKEN = 'fake-auth-token';
  process.env.WINSTON_LOG_FILE_PATH = '/var/log/prescryptive-logs/winston.log';
  process.env.TOPIC_NAME_UPDATE_HEALTH_RECORD_EVENT =
    'fake-health-record-topic';
  process.env.TOPIC_NAME_APPOINTMENT_CANCELLED_EVENT =
    'fake-appointment-cancellation-requested-topic';
  process.env.GUESTMEMBEREXPERIENCE_CORS_HOSTS = 'sometest.prescryptive.io';
  process.env.CERTIFICATE_PFX_FILE = 'ContentOfCrtFile';
  process.env.CERTIFICATE_PFX_PASS = 'password';
  process.env.PORT = '3333';
  process.env.CHILD_MEMBER_AGE_LIMIT = '13';
  process.env.ACCOUNT_TOKEN_EXPIRES_IN = '1800';
  process.env.DEVICE_TOKEN_EXPIRES_IN = '31536000';
  process.env.DRUG_DATA_URL = 'drug-data-url';
  process.env.GEARS_API_SUBSCRIPTION_KEY = 'mock-key';
  process.env.REDIS_PORT = '9999';
  process.env.REDIS_HOST = 'redis-host';
  process.env.REDIS_AUTH_PASS = 'redis-auth-pass';
  process.env.REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN = '30';
  process.env.REDIS_PIN_RESET_SCAN_DELETE_COUNT = '1000';
  process.env.TOPIC_NAME_UPDATE_ACCOUNT = 'fake-account-topic';
  process.env.REDIS_PIN_KEY_EXPIRES_IN = '1200';
  process.env.MAX_PIN_VERIFICATION_ATTEMPTS = '10';
  process.env.HEALTHBOT_WEBCHAT_SECRET = 'fake-healthbot-webchat-secret';
  process.env.HEALTHBOT_APP_SECRET = 'fake-healthboth-app-secret';
  process.env.AUTH0_API_CLIENT_ID = 'auth0-api-client-id';
  process.env.AUTH0_API_CLIENT_SECRET = 'auth0-api-client-secret';
  process.env.AUTH0_TOKEN_API = 'auth0-token-api';
  process.env.AUTH0_AUDIENCE_ACCUMULATORS = 'auth0-audience-accumulators';
  process.env.AUTH0_AUDIENCE_CLAIMS = 'auth0-audience-claims';
  process.env.AUTH0_AUDIENCE_IDENTITY = 'auth0-audience-identity';
  process.env.AUTH0_AUDIENCE_COVERAGE = 'auth0-audience-coverage';
  process.env.PLATFORM_API_URL = 'platform-url';
  process.env.PLATFORM_GEARS_API_URL = 'platform-gears-url';
  process.env.PLATFORM_PHARMACY_LOOKUP_API_KEY = 'pharmacy-api-key';
  process.env.PLATFORM_PRESCRIPTION_API_HEADER_KEY = 'platform-header-key';
  process.env.PLATFORM_API_CLIENT_ID = 'platform-client-id';
  process.env.PLATFORM_API_CLIENT_SECRET = 'platform-client-secret';
  process.env.PLATFORM_API_TENANT_ID = 'platform-tenant-id';
  process.env.PLATFORM_API_RESOURCE = 'platform-resource';
  process.env.PHARMACY_PORTAL_API_CLIENT_ID = 'pharmacy-client-id';
  process.env.PHARMACY_PORTAL_API_TENANT_ID = 'pharmacy-tenant-id';
  process.env.PHARMACY_PORTAL_API_SCOPE = 'pharmacy-api-scope';
  process.env.PHARMACY_PORTAL_API_CLIENT_SECRET = 'pharmacy-client-secret';
  process.env.PHARMACY_PORTAL_API_URL = 'pharmacy-url';
  process.env.PRICING_API_HEADER_KEY = 'pricing-header-key';
  process.env.REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN = '1200';
  process.env.REDIS_PERSON_CREATE_KEY_EXPIRES_IN = '1200';
  process.env.REDIS_PIN_VERIFICATION_KEY_EXPIRES_IN = '1800';
  process.env.REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN = '7200';
  process.env.ORDER_NUMBER_BLOCK_LENGTH = '100';
  process.env.PAYMENTS_KEY_PUBLIC = 'mock public';
  process.env.PAYMENTS_KEY_PRIVATE = 'mock private';
  process.env.PAYMENTS_KEY_PUBLIC_TEST = 'test mock public';
  process.env.PAYMENTS_KEY_PRIVATE_TEST = 'test mock private';
  process.env.ENVIRONMENT = 'production';
  process.env.SMART_PRICE_PROCESSORCONTROLLERNUMBER =
    'mock pcn' as KnownProcessorControllerNumber;
  process.env.SMART_PRICE_RXGROUP = 'mock rxgroup' as KnownRxGroup;
  process.env.TWILIO_EMAIL_VERIFICATION_SERVICE_ID = 'fake-verification-sid';
  process.env.TWILIO_REMOVE_WAITLIST_URL = 'fake-twilio-url';
  process.env.SENDGRID_API_KEY = 'key';
  process.env.IPSTACK_API_URL = 'ipstack-url';
  process.env.IPSTACK_API_KEY = 'ipstack-key';
  process.env.CONTENT_API_URL = 'content-api-url';
  process.env.CONTENT_API_SMARTPRICE_USERNAME = 'user';
  process.env.CONTENT_API_SMARTPRICE_PASSWORD = 'pwd';
  process.env.SUPPORT_EMAIL = 'test-email';
  process.env.INSURANCE_ELIGIBILITY_API_REQUEST_URL =
    'mock-insurance-eligibility-api-request-url';
  process.env.WAYSTAR_INSURANCE_ELIGIBILITY_API_USER_ID =
    'mock-waystar-insurance-eligibility-api-user-id';
  process.env.WAYSTAR_INSURANCE_ELIGIBILITY_API_PASSWORD =
    'mock-waystar-insurance-eligibility-api-password';
  process.env.MAPBOX_API_URL = 'mapbox-url';
  process.env.MAPBOX_ACCESS_TOKEN = 'mapbox-access-token';
  process.env.MYRX_IDENTITY_TENANT_ID = 'myrx-identity-tenant-id';
  process.env.TOPIC_NAME_COMMON_BUSINESS_EVENT = 'fake-common-business-topic';
  process.env.TOPIC_NAME_COMMON_MONITORING_EVENT =
    'fake-common-monitoring-topic';
});

const mockLogger = {
  info: jest.fn(),
} as unknown as Logger;
jest.mock('./utils/winston-config', () => ({
  setLogger: jest.fn().mockImplementation(() => {
    return mockLogger;
  }),
}));

describe('getEnvironmentConfiguration()', () => {
  it('calls dotenv.config() once', () => {
    getEnvironmentConfiguration();
    expect(configMock).toHaveBeenNthCalledWith(1);
    expect(configMock).toHaveBeenNthCalledWith(2, {
      path: './env.guest-member-api.test.md',
    });
  });

  it('gets configuration from process.env', () => {
    const configuration: IConfiguration = {
      accountTokenExpiryTime: 1800,
      alwaysAllowedFeatureFlags: ['usevaccine'],
      appInsightInstrumentationKey: 'fake-key',
      appInsightServiceName: 'fake-name',
      certificates: { pfxFile: 'ContentOfCrtFile', pfxPass: 'password' },
      childMemberAgeLimit: 13,
      connectionString: 'fake',
      corsWhiteList: [
        'sometest.prescryptive.io',
        'test.prescryptive.com',
        'test.prescryptive.io',
        'localhost',
      ],
      contentApiUrl: 'content-api-url',
      contentApiSmartPricePassword: 'pwd',
      contentApiSmartPriceUserName: 'user',
      cancelAppointmentWindowExpiryTimeInHours: 6,
      deviceTokenExpiryTime: 31536000,
      environment: 'production',
      gearsApiSubscriptionKey: 'mock-key',
      healthBotAppSecret: 'fake-healthboth-app-secret',
      healthBotDefaultLocale: 'en-US',
      healthBotDirectLineTokenEp: `https://directline.botframework.com/v3/directline/tokens/generate`,
      healthBotWebchatSecret: 'fake-healthbot-webchat-secret',
      orderNumberBlockLength: 100,
      jwtTokenExpiryTime: 1800,
      jwtTokenSecretKey: 'fake-key',
      logger: mockLogger,
      maxPinVerificationAttempts: 10,
      maxIdentityVerificationAttempts: 5,
      port: 3333,
      auth0: {
        clientId: 'auth0-api-client-id',
        clientSecret: 'auth0-api-client-secret',
        tokenApi: 'auth0-token-api',
        audienceAccumulators: 'auth0-audience-accumulators',
        audienceClaims: 'auth0-audience-claims',
        audienceIdentity: 'auth0-audience-identity',
      },
      partnerJwksMap: new Map(),
      pharmacyPortalApiClientId: 'pharmacy-client-id',
      pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
      pharmacyPortalApiScope: 'pharmacy-api-scope',
      pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
      pharmacyPortalApiUrl: 'pharmacy-url',
      platformApiUrl: 'platform-url',
      platformGearsApiUrl: 'platform-gears-url',
      platformPrescriptionApiHeaderKey: 'platform-header-key',
      platformApiClientId: 'platform-client-id',
      platformApiClientSecret: 'platform-client-secret',
      platformApiResource: 'platform-resource',
      platformApiTenantId: 'platform-tenant-id',
      pricingApiHeaderKey: 'pricing-header-key',
      redisAuthPass: 'redis-auth-pass',
      redisDeviceTokenKeyExpiryTime: 30,
      redisHostName: 'redis-host',
      redisPhoneNumberRegistrationKeyExpiryTime: 1200,
      redisPersonCreateKeyExpiryTime: 1200,
      redisPinKeyExpiryTime: 1200,
      redisPinVerificationKeyExpiryTime: 1800,
      redisIdentityVerificationKeyExpiryTime: 3600,
      redisNearbyPharmaciesKeyExpiryTime: 7200,
      redisCMSContentKeyExpiryTime: 1800,
      redisPort: 9999,
      redisPinResetScanDeleteCount: '1000',
      serviceBusConnectionString: 'fake-connection-string',
      smartPriceRxGroup: 'mock rxgroup' as KnownRxGroup,
      smartPriceProcessorControllerNumber:
        'mock pcn' as KnownProcessorControllerNumber,
      testPaymentsKeyPrivate: 'test mock private',
      testPaymentsKeyPublic: 'test mock public',
      topicNameHealthRecordEvent: 'fake-health-record-topic',
      topicNameAppointmentCancelledEvent:
        'fake-appointment-cancellation-requested-topic',
      twilioAccountSid: 'fake-account-sid',
      twilioAuthToken: 'fake-auth-token',
      twilioEmailVerificationServiceId: 'fake-verification-sid',
      twilioVerificationServiceId: 'fake-verification-sid',
      twilioMessagingFromPhoneNumber: 'fake-twilio-phone',
      twilioRemoveWaitlistUrl: 'fake-twilio-url',
      updateAccountTopicName: 'fake-account-topic',
      updatePersonTopicName: 'fake-person-topic',
      paymentsKeyPrivate: 'mock private',
      paymentsKeyPublic: 'mock public',
      sendgridApiKey: 'key',
      ipStackApiUrl: 'ipstack-url',
      ipStackApiKey: 'ipstack-key',
      supportEmail: 'test-email',
      insuranceEligibilityApiRequestUrl:
        'mock-insurance-eligibility-api-request-url',
      waystarInsuranceEligibilityApiUserId:
        'mock-waystar-insurance-eligibility-api-user-id',
      waystarInsuranceEligibilityApiPassword:
        'mock-waystar-insurance-eligibility-api-password',
      mapboxApiUrl: 'mapbox-url',
      mapboxAccessToken: 'mapbox-access-token',
      myrxIdentityTenantId: 'myrx-identity-tenant-id',
      topicCommonBusinessEvent: 'fake-common-business-topic',
      topicCommonMonitoringEvent: 'fake-common-monitoring-topic',
    };
    expect(getEnvironmentConfiguration()).toEqual(configuration);
  });

  describe('ALWAYS_ALLOWED_FEATURE_FLAGS missing', () => {
    it('use default value when the ALWAYS_ALLOWED_FEATURE_FLAGS is undefined', () => {
      delete process.env.ALWAYS_ALLOWED_FEATURE_FLAGS;
      expect(getEnvironmentConfiguration().alwaysAllowedFeatureFlags).toEqual(
        []
      );
    });
  });

  describe('GUESTMEMBEREXPERIENCE_CORS_HOSTS missing', () => {
    it('throws when the GUESTMEMBEREXPERIENCE_CORS_HOSTS is undefined', () => {
      delete process.env.GUESTMEMBEREXPERIENCE_CORS_HOSTS;
      delete process.env.GUESTMEMBEREXPERIENCE_HOST; // TODO: remove when done implementing CORS_HOSTS in pipeline
      expect(getEnvironmentConfiguration).toThrowError(
        'GUESTMEMBEREXPERIENCE_CORS_HOSTS missing'
      );
    });

    it('throws when GUESTMEMBEREXPERIENCE_CORS_HOSTS is length: 0', () => {
      process.env.GUESTMEMBEREXPERIENCE_CORS_HOSTS = '';
      expect(getEnvironmentConfiguration).toThrowError(
        'GUESTMEMBEREXPERIENCE_CORS_HOSTS missing'
      );
    });
  });

  describe('PORT missing', () => {
    it('throws when the PORT is undefined', () => {
      delete process.env.PORT;
      expect(getEnvironmentConfiguration).toThrowError('PORT missing');
    });

    it('throws when PORT is length: 0', () => {
      process.env.PORT = '';
      expect(getEnvironmentConfiguration).toThrowError('PORT missing');
    });
  });

  describe('PORT invalid', () => {
    it('throws when PORT is not a number', () => {
      process.env.PORT = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError('PORT invalid');
    });
  });

  describe('DATABASE_CONNECTION missing', () => {
    it('throws when DATABASE_CONNECTION is not undefined', () => {
      delete process.env.DATABASE_CONNECTION;
      expect(getEnvironmentConfiguration).toThrowError(
        'DATABASE_CONNECTION missing'
      );
    });
  });

  describe('JWT SECRET KEY missing', () => {
    it('throws when the JWT SECRET KEY is undefined', () => {
      delete process.env.JWT_TOKEN_SECRET_KEY;
      expect(getEnvironmentConfiguration).toThrowError(
        'JWT_TOKEN_SECRET_KEY missing'
      );
    });
  });

  describe('JWT_TOKEN_EXPIRES_IN missing', () => {
    it('throws when the JWT_TOKEN_EXPIRES_IN is undefined', () => {
      delete process.env.JWT_TOKEN_EXPIRES_IN;
      expect(getEnvironmentConfiguration).toThrowError(
        'JWT_TOKEN_EXPIRES_IN missing'
      );
    });

    it('throws when JWT_TOKEN_EXPIRES_IN is length: 0', () => {
      process.env.JWT_TOKEN_EXPIRES_IN = '';
      expect(getEnvironmentConfiguration).toThrowError(
        'JWT_TOKEN_EXPIRES_IN missing'
      );
    });
  });

  describe('JWT_TOKEN_EXPIRES_IN invalid', () => {
    it('throws when JWT_TOKEN_EXPIRES_IN is not a number', () => {
      process.env.JWT_TOKEN_EXPIRES_IN = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'JWT_TOKEN_EXPIRES_IN is invalid. Must be an Integer'
      );
    });
  });

  describe('TWILIO_ACCOUNT_SID KEY missing', () => {
    it('throws when the TWILIO_ACCOUNT_SID is undefined', () => {
      delete process.env.TWILIO_ACCOUNT_SID;
      expect(getEnvironmentConfiguration).toThrowError(
        'TWILIO_ACCOUNT_SID missing'
      );
    });
  });

  describe('TWILIO_AUTH_TOKEN missing', () => {
    it('throws when the TWILIO_AUTH_TOKEN is undefined', () => {
      delete process.env.TWILIO_AUTH_TOKEN;
      expect(getEnvironmentConfiguration).toThrowError(
        'TWILIO_AUTH_TOKEN missing'
      );
    });
  });

  describe('TWILIO_VERIFICATION_SERVICE_ID missing', () => {
    it('throws when the TWILIO_VERIFICATION_SERVICE_ID is undefined', () => {
      delete process.env.TWILIO_VERIFICATION_SERVICE_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'TWILIO_VERIFICATION_SERVICE_ID missing'
      );
    });
  });

  describe('SERVICE_BUS_CONNECTION_STRING missing', () => {
    it('throws when the SERVICE_BUS_CONNECTION_STRING is undefined', () => {
      delete process.env.SERVICE_BUS_CONNECTION_STRING;
      expect(getEnvironmentConfiguration).toThrowError(
        'SERVICE_BUS_CONNECTION_STRING missing'
      );
    });
  });

  describe('TOPIC_NAME_UPDATE_PERSON missing', () => {
    it('throws when the TOPIC_NAME_UPDATE_PERSON is undefined', () => {
      delete process.env.TOPIC_NAME_UPDATE_PERSON;
      expect(getEnvironmentConfiguration).toThrowError(
        'TOPIC_NAME_UPDATE_PERSON missing'
      );
    });
  });

  describe('WINSTON_LOG_FILE_PATH missing', () => {
    it('throws when the WINSTON_LOG_FILE_PATH is undefined', () => {
      delete process.env.WINSTON_LOG_FILE_PATH;
      expect(getEnvironmentConfiguration).toThrowError(
        'WINSTON_LOG_FILE_PATH missing'
      );
    });
  });

  describe('TOPIC_NAME_UPDATE_HEALTH_RECORD_EVENT missing', () => {
    it('throws when the TOPIC_NAME_UPDATE_HEALTH_RECORD_EVENT is undefined', () => {
      delete process.env.TOPIC_NAME_UPDATE_HEALTH_RECORD_EVENT;
      expect(getEnvironmentConfiguration).toThrowError(
        'TOPIC_NAME_UPDATE_HEALTH_RECORD_EVENT missing'
      );
    });
  });

  describe('CERTIFICATE_PFX_FILE missing', () => {
    it('throws when CERTIFICATE_PFX_FILE is undefined', () => {
      delete process.env.CERTIFICATE_PFX_FILE;
      expect(getEnvironmentConfiguration).toThrowError(
        'CERTIFICATE_PFX_FILE missing'
      );
    });
  });

  describe('CERTIFICATE_PFX_PASS missing', () => {
    it('throws when CERTIFICATE_PFX_PASS is undefined', () => {
      delete process.env.CERTIFICATE_PFX_PASS;
      expect(getEnvironmentConfiguration).toThrowError(
        'CERTIFICATE_PFX_PASS missing'
      );
    });
  });

  describe('CHILD_MEMBER_AGE_LIMIT missing', () => {
    it('should assign a value to CHILD_MEMBER_AGE_LIMIT from Api constants if CHILD_MEMBER_AGE_LIMIT is missing from env', () => {
      delete process.env.CHILD_MEMBER_AGE_LIMIT;
      expect(getEnvironmentConfiguration().childMemberAgeLimit).toBe(
        ApiConstants.CHILD_MEMBER_AGE_LIMIT
      );
    });
  });

  describe('CONTENT_API_URL missing', () => {
    it('throws when the CONTENT_API_URL is undefined', () => {
      delete process.env.CONTENT_API_URL;
      expect(getEnvironmentConfiguration).toThrowError(
        'CONTENT_API_URL missing'
      );
    });
  });

  describe('ACCOUNT_TOKEN_EXPIRES_IN', () => {
    it('should use default expiry time as 1800 when ACCOUNT_TOKEN_EXPIRES_IN is missing', () => {
      delete process.env.ACCOUNT_TOKEN_EXPIRES_IN;
      expect(getEnvironmentConfiguration().accountTokenExpiryTime).toBe(1800);
    });

    it('should use expiry time from env ACCOUNT_TOKEN_EXPIRES_IN is provided', () => {
      process.env.ACCOUNT_TOKEN_EXPIRES_IN = '1200';
      expect(getEnvironmentConfiguration().accountTokenExpiryTime).toBe(1200);
    });

    it('throws when ACCOUNT_TOKEN_EXPIRES_IN is not a number', () => {
      process.env.ACCOUNT_TOKEN_EXPIRES_IN = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'ACCOUNT_TOKEN_EXPIRES_IN is invalid. Must be an Integer'
      );
    });
  });

  describe('DEVICE_TOKEN_EXPIRES_IN', () => {
    it('throws when the DEVICE_TOKEN_EXPIRES_IN is undefined', () => {
      delete process.env.DEVICE_TOKEN_EXPIRES_IN;
      expect(getEnvironmentConfiguration).toThrowError(
        'DEVICE_TOKEN_EXPIRES_IN missing'
      );
    });

    it('throws when DEVICE_TOKEN_EXPIRES_IN is length: 0', () => {
      process.env.DEVICE_TOKEN_EXPIRES_IN = '';
      expect(getEnvironmentConfiguration).toThrowError(
        'DEVICE_TOKEN_EXPIRES_IN missing'
      );
    });

    it('throws when DEVICE_TOKEN_EXPIRES_IN is not a number', () => {
      process.env.DEVICE_TOKEN_EXPIRES_IN = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'DEVICE_TOKEN_EXPIRES_IN is invalid. Must be an Integer'
      );
    });
  });

  describe('REDIS_PORT', () => {
    it('throws when the REDIS_PORT is undefined', () => {
      delete process.env.REDIS_PORT;
      expect(getEnvironmentConfiguration).toThrowError('REDIS_PORT missing');
    });

    it('throws when REDIS_PORT is length: 0', () => {
      process.env.REDIS_PORT = '';
      expect(getEnvironmentConfiguration).toThrowError('REDIS_PORT missing');
    });

    it('throws when REDIS_PORT is not a number', () => {
      process.env.REDIS_PORT = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'REDIS_PORT is invalid. Must be an Integer'
      );
    });
  });

  describe('REDIS_HOST missing', () => {
    it('throws when REDIS_HOST is undefined', () => {
      delete process.env.REDIS_HOST;
      expect(getEnvironmentConfiguration).toThrowError('REDIS_HOST missing');
    });
  });

  describe('REDIS_AUTH_PASS missing', () => {
    it('throws when REDIS_AUTH_PASS is undefined', () => {
      delete process.env.REDIS_AUTH_PASS;
      expect(getEnvironmentConfiguration).toThrowError(
        'REDIS_AUTH_PASS missing'
      );
    });
  });

  describe('REDIS_PIN_RESET_SCAN_DELETE_COUNT missing', () => {
    it('use default value when the REDIS_PIN_RESET_SCAN_DELETE_COUNT is undefined', () => {
      delete process.env.REDIS_PIN_RESET_SCAN_DELETE_COUNT;
      expect(
        getEnvironmentConfiguration().redisPinResetScanDeleteCount
      ).toEqual('1000');
    });
  });

  describe('REDIS_CMS_CONTENT_KEY_EXPIRES_IN missing', () => {
    it('use default value when the REDIS_CMS_CONTENT_KEY_EXPIRES_IN is undefined', () => {
      delete process.env.REDIS_CMS_CONTENT_KEY_EXPIRES_IN;
      expect(
        getEnvironmentConfiguration().redisCMSContentKeyExpiryTime
      ).toEqual(1800);
    });
  });

  describe('REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN', () => {
    it('should use default expiry time as 30 days when REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN is missing', () => {
      delete process.env.REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN;
      expect(getEnvironmentConfiguration().redisDeviceTokenKeyExpiryTime).toBe(
        31536000
      );
    });

    it('should use expiry time from env REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN is provided', () => {
      process.env.REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN = '1200';
      expect(getEnvironmentConfiguration().redisDeviceTokenKeyExpiryTime).toBe(
        1200
      );
    });

    it('throws when REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN is not a number', () => {
      process.env.REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'REDIS_DEVICE_TOKEN_KEY_EXPIRES_IN is invalid. Must be an Integer'
      );
    });
  });

  describe('REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN', () => {
    it('should use default expiry time as 2 hours when REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN is missing', () => {
      delete process.env.REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN;
      expect(
        getEnvironmentConfiguration().redisNearbyPharmaciesKeyExpiryTime
      ).toBe(7200);
    });

    it('should use expiry time from env REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN is provided', () => {
      process.env.REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN = '7200';
      expect(
        getEnvironmentConfiguration().redisNearbyPharmaciesKeyExpiryTime
      ).toBe(7200);
    });

    it('throws when REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN is not a number', () => {
      process.env.REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'REDIS_NEARBY_PHARMACIES_KEY_EXPIRES_IN is invalid. Must be an Integer'
      );
    });
  });

  describe('TOPIC_NAME_UPDATE_ACCOUNT missing', () => {
    it('throws when TOPIC_NAME_UPDATE_ACCOUNT is undefined', () => {
      delete process.env.TOPIC_NAME_UPDATE_ACCOUNT;
      expect(getEnvironmentConfiguration).toThrowError(
        'TOPIC_NAME_UPDATE_ACCOUNT missing'
      );
    });
  });

  describe('REDIS_PIN_KEY_EXPIRES_IN', () => {
    it('should use default expiry time as 30 min when REDIS_PIN_KEY_EXPIRES_IN is missing', () => {
      delete process.env.REDIS_PIN_KEY_EXPIRES_IN;
      expect(getEnvironmentConfiguration().redisPinKeyExpiryTime).toBe(1800);
    });

    it('should use expiry time from env REDIS_PIN_KEY_EXPIRES_IN is provided', () => {
      expect(getEnvironmentConfiguration().redisPinKeyExpiryTime).toBe(1200);
    });

    it('throws when REDIS_PIN_KEY_EXPIRES_IN is not a number', () => {
      process.env.REDIS_PIN_KEY_EXPIRES_IN = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'REDIS_PIN_KEY_EXPIRES_IN is invalid. Must be an Integer'
      );
    });
  });

  describe('MAX_PIN_VERIFICATION_ATTEMPTS', () => {
    it('should use default max attempts when MAX_PIN_VERIFICATION_ATTEMPTS is missing', () => {
      delete process.env.MAX_PIN_VERIFICATION_ATTEMPTS;
      expect(getEnvironmentConfiguration().maxPinVerificationAttempts).toBe(5);
    });

    it('should use max attempts from env when MAX_PIN_VERIFICATION_ATTEMPTS is provided', () => {
      expect(getEnvironmentConfiguration().maxPinVerificationAttempts).toBe(10);
    });

    it('throws error when MAX_PIN_VERIFICATION_ATTEMPTS is not a number', () => {
      process.env.MAX_PIN_VERIFICATION_ATTEMPTS = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'MAX_PIN_VERIFICATION_ATTEMPTS is invalid. Must be an Integer'
      );
    });
  });

  describe('REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN', () => {
    it('should use default expiry time as 30 min when REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN is missing', () => {
      delete process.env.REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN;
      expect(
        getEnvironmentConfiguration().redisPhoneNumberRegistrationKeyExpiryTime
      ).toBe(1800);
    });

    it('should use expiry time from env REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN is provided', () => {
      expect(
        getEnvironmentConfiguration().redisPhoneNumberRegistrationKeyExpiryTime
      ).toBe(1200);
    });

    it('throws when REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN is not a number', () => {
      process.env.REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN =
        'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'REDIS_PHONE_NUMBER_REGISTRATION_KEY_EXPIRES_IN is invalid. Must be an Integer'
      );
    });
  });

  describe('REDIS_PERSON_CREATE_KEY_EXPIRES_IN', () => {
    it('should use default expiry time as 30 min when REDIS_PERSON_CREATE_KEY_EXPIRES_IN is missing', () => {
      delete process.env.REDIS_PERSON_CREATE_KEY_EXPIRES_IN;
      expect(getEnvironmentConfiguration().redisPersonCreateKeyExpiryTime).toBe(
        1800
      );
    });

    it('should use expiry time from env REDIS_PERSON_CREATE_KEY_EXPIRES_IN is provided', () => {
      expect(getEnvironmentConfiguration().redisPersonCreateKeyExpiryTime).toBe(
        1200
      );
    });

    it('throws when REDIS_PERSON_CREATE_KEY_EXPIRES_IN is not a number', () => {
      process.env.REDIS_PERSON_CREATE_KEY_EXPIRES_IN = 'not a number';
      expect(getEnvironmentConfiguration).toThrowError(
        'REDIS_PERSON_CREATE_KEY_EXPIRES_IN is invalid. Must be an Integer'
      );
    });
  });

  describe('ORDER_NUMBER_BLOCK_LENGTH missing', () => {
    it('use default value when the ORDER_NUMBER_BLOCK_LENGTH is undefined', () => {
      delete process.env.ORDER_NUMBER_BLOCK_LENGTH;
      expect(getEnvironmentConfiguration().orderNumberBlockLength).toBe(100);
    });
  });

  describe('CANCEL_APPOINTMENT_WINDOW_HOURS missing', () => {
    it('use default value when the CANCEL_APPOINTMENT_WINDOW_HOURS is undefined', () => {
      delete process.env.CANCEL_APPOINTMENT_WINDOW_HOURS;
      expect(
        getEnvironmentConfiguration().cancelAppointmentWindowExpiryTimeInHours
      ).toBe(6);
    });
  });

  describe('PAYMENTS_KEY_PUBLIC missing', () => {
    it('throws when PAYMENTS_KEY_PUBLIC is undefined', () => {
      delete process.env.PAYMENTS_KEY_PUBLIC;
      expect(getEnvironmentConfiguration).toThrowError(
        'PAYMENTS_KEY_PUBLIC missing'
      );
    });
  });

  describe('PAYMENTS_KEY_PRIVATE missing', () => {
    it('throws when PAYMENTS_KEY_PRIVATE is undefined', () => {
      delete process.env.PAYMENTS_KEY_PRIVATE;
      expect(getEnvironmentConfiguration).toThrowError(
        'PAYMENTS_KEY_PRIVATE missing'
      );
    });
  });

  describe('PAYMENTS_KEY_PUBLIC_TEST missing', () => {
    it('throws when PAYMENTS_KEY_PUBLIC_TEST is undefined', () => {
      delete process.env.PAYMENTS_KEY_PUBLIC_TEST;
      expect(getEnvironmentConfiguration).toThrowError(
        'PAYMENTS_KEY_PUBLIC_TEST missing'
      );
    });
  });

  describe('PAYMENTS_KEY_PRIVATE_TEST missing', () => {
    it('throws when PAYMENTS_KEY_PRIVATE_TEST is undefined', () => {
      delete process.env.PAYMENTS_KEY_PRIVATE_TEST;
      expect(getEnvironmentConfiguration).toThrowError(
        'PAYMENTS_KEY_PRIVATE_TEST missing'
      );
    });
  });

  describe('ENVIRONMENT', () => {
    it('should use default environemnt as test when ENVIRONMENT is missing', () => {
      delete process.env.ENVIRONMENT;
      expect(getEnvironmentConfiguration().environment).toBe('test');
    });

    it('should use environment from env ENVIRONMENT if provided', () => {
      expect(getEnvironmentConfiguration().environment).toBe('production');
    });
  });

  describe('SMART_PRICE_PROCESSORCONTROLLERNUMBER', () => {
    it('should use default smart price pcn when Env is missing', () => {
      delete process.env.SMART_PRICE_PROCESSORCONTROLLERNUMBER;
      expect(
        getEnvironmentConfiguration().smartPriceProcessorControllerNumber
      ).toBe(DefaultSmartPriceProcessorControllerNumber);
    });

    it('should use env smart price env when provided', () => {
      expect(
        getEnvironmentConfiguration().smartPriceProcessorControllerNumber
      ).toBe('mock pcn');
    });
  });

  describe('SAMRT_PRICE_RXGROUP', () => {
    it('should use default smart price rxgroup when Env is missing', () => {
      delete process.env.SMART_PRICE_RXGROUP;
      expect(getEnvironmentConfiguration().smartPriceRxGroup).toBe(
        DefaultSmartPriceRxGroup
      );
    });

    it('should use smart price rxgroup from env when provided', () => {
      expect(getEnvironmentConfiguration().smartPriceRxGroup).toBe(
        'mock rxgroup'
      );
    });
  });

  describe('TWILIO_MESSAGING_FROM_PHONE_NUMBER', () => {
    it('should default twilio phone number', () => {
      delete process.env.TWILIO_MESSAGING_FROM_PHONE_NUMBER;
      expect(getEnvironmentConfiguration().twilioMessagingFromPhoneNumber).toBe(
        DefaultTwilioMessagingFromPhoneNumber
      );
    });

    it('should use twilio phone number if not ', () => {
      expect(getEnvironmentConfiguration().twilioMessagingFromPhoneNumber).toBe(
        'fake-twilio-phone'
      );
    });
  });

  describe('PHARMACY_PORTAL_API_CLIENT_ID missing', () => {
    it('throws when PHARMACY_PORTAL_API_CLIENT_ID is undefined', () => {
      delete process.env.PHARMACY_PORTAL_API_CLIENT_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'PHARMACY_PORTAL_API_CLIENT_ID missing'
      );
    });
  });

  describe('PHARMACY_PORTAL_API_TENANT_ID missing', () => {
    it('throws when PHARMACY_PORTAL_API_TENANT_ID is undefined', () => {
      delete process.env.PHARMACY_PORTAL_API_TENANT_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'PHARMACY_PORTAL_API_TENANT_ID missing'
      );
    });
  });

  describe('PHARMACY_PORTAL_API_SCOPE missing', () => {
    it('throws when PHARMACY_PORTAL_API_SCOPE is undefined', () => {
      delete process.env.PHARMACY_PORTAL_API_SCOPE;
      expect(getEnvironmentConfiguration).toThrowError(
        'PHARMACY_PORTAL_API_SCOPE missing'
      );
    });
  });

  describe('PHARMACY_PORTAL_API_CLIENT_SECRET missing', () => {
    it('throws when PHARMACY_PORTAL_API_CLIENT_SECRET is undefined', () => {
      delete process.env.PHARMACY_PORTAL_API_CLIENT_SECRET;
      expect(getEnvironmentConfiguration).toThrowError(
        'PHARMACY_PORTAL_API_CLIENT_SECRET missing'
      );
    });
  });

  describe('PHARMACY_PORTAL_API_URL missing', () => {
    it('throws when PHARMACY_PORTAL_API_URL is undefined', () => {
      delete process.env.PHARMACY_PORTAL_API_URL;
      expect(getEnvironmentConfiguration).toThrowError(
        'PHARMACY_PORTAL_API_URL missing'
      );
    });
  });

  describe('TWILIO_EMAIL_VERIFICATION_SERVICE_ID missing', () => {
    it('throws when TWILIO_EMAIL_VERIFICATION_SERVICE_ID is undefined', () => {
      delete process.env.TWILIO_EMAIL_VERIFICATION_SERVICE_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'TWILIO_EMAIL_VERIFICATION_SERVICE_ID missing'
      );
    });
  });

  describe('REDIS_IDENTITY_VERIFICATION_KEY_EXPIRES_IN missing', () => {
    it('throws when REDIS_IDENTITY_VERIFICATION_KEY_EXPIRES_IN is undefined', () => {
      delete process.env.REDIS_IDENTITY_VERIFICATION_KEY_EXPIRES_IN;
      expect(
        getEnvironmentConfiguration().redisIdentityVerificationKeyExpiryTime
      ).toBe(3600);
    });
  });

  describe('TWILIO_REMOVE_WAITLIST_URL missing', () => {
    it('throws when the TWILIO_REMOVE_WAITLIST_URL is undefined', () => {
      delete process.env.TWILIO_REMOVE_WAITLIST_URL;
      expect(getEnvironmentConfiguration).toThrowError(
        'TWILIO_REMOVE_WAITLIST_URL missing'
      );
    });
  });

  describe('SENDGRID_API_KEY missing', () => {
    it('throws when the SENDGRID_API_KEY is undefined', () => {
      delete process.env.SENDGRID_API_KEY;
      expect(getEnvironmentConfiguration).toThrowError(
        'SENDGRID_API_KEY missing'
      );
    });
  });

  describe('IPSTACK_API_URL missing', () => {
    it('throws when the IPSTACK_API_URL is undefined', () => {
      delete process.env.IPSTACK_API_URL;
      expect(getEnvironmentConfiguration).toThrowError(
        'IPSTACK_API_URL missing'
      );
    });
  });

  describe('IPSTACK_API_KEY missing', () => {
    it('throws when the IPSTACK_API_KEY is undefined', () => {
      delete process.env.IPSTACK_API_KEY;
      expect(getEnvironmentConfiguration).toThrowError(
        'IPSTACK_API_KEY missing'
      );
    });
  });

  describe('Auth0 variable validation', () => {
    it('throws when the AUTH0_API_CLIENT_ID is undefined', () => {
      delete process.env.AUTH0_API_CLIENT_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'AUTH0_API_CLIENT_ID missing'
      );
    });

    it('throws when the AUTH0_API_CLIENT_SECRET is undefined', () => {
      delete process.env.AUTH0_API_CLIENT_SECRET;
      expect(getEnvironmentConfiguration).toThrowError(
        'AUTH0_API_CLIENT_SECRET missing'
      );
    });

    it('throws when the AUTH0_TOKEN_API is undefined', () => {
      delete process.env.AUTH0_TOKEN_API;
      expect(getEnvironmentConfiguration).toThrowError(
        'AUTH0_TOKEN_API missing'
      );
    });

    it('throws when the AUTH0_AUDIENCE_ACCUMULATORS is undefined', () => {
      delete process.env.AUTH0_AUDIENCE_ACCUMULATORS;
      expect(getEnvironmentConfiguration).toThrowError(
        'AUTH0_AUDIENCE_ACCUMULATORS missing'
      );
    });

    it('throws when the AUTH0_AUDIENCE_CLAIMS is undefined', () => {
      delete process.env.AUTH0_AUDIENCE_CLAIMS;
      expect(getEnvironmentConfiguration).toThrowError(
        'AUTH0_AUDIENCE_CLAIMS missing'
      );
    });

    it('throws when the AUTH0_AUDIENCE_IDENTITY is undefined', () => {
      delete process.env.AUTH0_AUDIENCE_IDENTITY;
      expect(getEnvironmentConfiguration).toThrowError(
        'AUTH0_AUDIENCE_IDENTITY missing'
      );
    });
  });

  describe('PLATFORM_API_URL missing', () => {
    it('throws when the PLATFORM_API_URL is undefined', () => {
      delete process.env.PLATFORM_API_URL;
      expect(getEnvironmentConfiguration).toThrowError(
        'PLATFORM_API_URL missing'
      );
    });
  });

  describe('PLATFORM_GEARS_API_URL missing', () => {
    it('throws when the PLATFORM_GEARS_API_URL is undefined', () => {
      delete process.env.PLATFORM_GEARS_API_URL;
      expect(getEnvironmentConfiguration).toThrowError(
        'PLATFORM_GEARS_API_URL missing'
      );
    });
  });

  describe('GEARS_API_SUBSCRIPTION_KEY missing', () => {
    it('throws when the GEARS_API_SUBSCRIPTION_KEY is undefined', () => {
      delete process.env.GEARS_API_SUBSCRIPTION_KEY;
      expect(getEnvironmentConfiguration).toThrowError(
        'GEARS_API_SUBSCRIPTION_KEY missing'
      );
    });
  });

  describe('PLATFORM_API_CLIENT_ID missing', () => {
    it('throws when the PLATFORM_API_CLIENT_ID is undefined', () => {
      delete process.env.PLATFORM_API_CLIENT_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'PLATFORM_API_CLIENT_ID missing'
      );
    });
  });

  describe('PLATFORM_API_CLIENT_SECRET missing', () => {
    it('throws when the PLATFORM_API_CLIENT_SECRET is undefined', () => {
      delete process.env.PLATFORM_API_CLIENT_SECRET;
      expect(getEnvironmentConfiguration).toThrowError(
        'PLATFORM_API_CLIENT_SECRET missing'
      );
    });
  });

  describe('PLATFORM_API_TENANT_ID missing', () => {
    it('throws when the PLATFORM_API_TENANT_ID is undefined', () => {
      delete process.env.PLATFORM_API_TENANT_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'PLATFORM_API_TENANT_ID missing'
      );
    });
  });

  describe('PLATFORM_API_RESOURCE missing', () => {
    it('throws when the PLATFORM_API_RESOURCE is undefined', () => {
      delete process.env.PLATFORM_API_RESOURCE;
      expect(getEnvironmentConfiguration).toThrowError(
        'PLATFORM_API_RESOURCE missing'
      );
    });
  });

  describe('PLATFORM_PRESCRIPTION_API_HEADER_KEY missing', () => {
    it('throws when the PLATFORM_PRESCRIPTION_API_HEADER_KEY is undefined', () => {
      delete process.env.PLATFORM_PRESCRIPTION_API_HEADER_KEY;
      expect(getEnvironmentConfiguration).toThrowError(
        'PLATFORM_PRESCRIPTION_API_HEADER_KEY missing'
      );
    });
  });

  describe('PRICING_API_HEADER_KEY missing', () => {
    it('throws when the PRICING_API_HEADER_KEY is undefined', () => {
      delete process.env.PRICING_API_HEADER_KEY;
      expect(getEnvironmentConfiguration).toThrowError(
        'PRICING_API_HEADER_KEY missing'
      );
    });
  });

  describe('CONTENT_API_SMARTPRICE_USERNAME missing', () => {
    it('throws when the CONTENT_API_SMARTPRICE_USERNAME is undefined', () => {
      delete process.env.CONTENT_API_SMARTPRICE_USERNAME;
      expect(getEnvironmentConfiguration).toThrowError(
        'CONTENT_API_SMARTPRICE_USERNAME missing'
      );
    });
  });

  describe('CONTENT_API_SMARTPRICE_PASSWORD missing', () => {
    it('throws when the CONTENT_API_SMARTPRICE_PASSWORD is undefined', () => {
      delete process.env.CONTENT_API_SMARTPRICE_PASSWORD;
      expect(getEnvironmentConfiguration).toThrowError(
        'CONTENT_API_SMARTPRICE_PASSWORD missing'
      );
    });
  });

  describe('SUPPORT_EMAIL missing', () => {
    it('gives default value when SUPPORT_EMAIL is missing from env', () => {
      delete process.env.SUPPORT_EMAIL;
      expect(getEnvironmentConfiguration().supportEmail).toEqual(
        'support@prescryptive.com'
      );
    });
  });

  describe('INSURANCE_ELIGIBILITY_API_REQUEST_URL missing', () => {
    it('throws when the INSURANCE_ELIGIBILITY_API_REQUEST_URL is undefined', () => {
      delete process.env.INSURANCE_ELIGIBILITY_API_REQUEST_URL;
      expect(getEnvironmentConfiguration).toThrowError(
        'INSURANCE_ELIGIBILITY_API_REQUEST_URL missing'
      );
    });
  });

  describe('WAYSTAR_INSURANCE_ELIGIBILITY_API_USER_ID missing', () => {
    it('throws when the WAYSTAR_INSURANCE_ELIGIBILITY_API_USER_ID is undefined', () => {
      delete process.env.WAYSTAR_INSURANCE_ELIGIBILITY_API_USER_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'WAYSTAR_INSURANCE_ELIGIBILITY_API_USER_ID missing'
      );
    });
  });

  describe('WAYSTAR_INSURANCE_ELIGIBILITY_API_PASSWORD missing', () => {
    it('throws when the WAYSTAR_INSURANCE_ELIGIBILITY_API_PASSWORD is undefined', () => {
      delete process.env.WAYSTAR_INSURANCE_ELIGIBILITY_API_PASSWORD;
      expect(getEnvironmentConfiguration).toThrowError(
        'WAYSTAR_INSURANCE_ELIGIBILITY_API_PASSWORD missing'
      );
    });
  });

  describe('MAPBOX_API_URL missing', () => {
    it('throws when the MAPBOX_API_URL is undefined', () => {
      delete process.env.MAPBOX_API_URL;
      expect(getEnvironmentConfiguration).toThrowError(
        'MAPBOX_API_URL missing'
      );
    });
  });

  describe('MAPBOX_ACCESS_TOKEN missing', () => {
    it('throws when the MAPBOX_ACCESS_TOKEN is undefined', () => {
      delete process.env.MAPBOX_ACCESS_TOKEN;
      expect(getEnvironmentConfiguration).toThrowError(
        'MAPBOX_ACCESS_TOKEN missing'
      );
    });
  });
  describe('MYRX_IDENTITY_TENANT_ID missing', () => {
    it('throws when the MYRX_IDENTITY_TENANT_ID is undefined', () => {
      delete process.env.MYRX_IDENTITY_TENANT_ID;
      expect(getEnvironmentConfiguration).toThrowError(
        'MYRX_IDENTITY_TENANT_ID missing'
      );
    });
  });
});
