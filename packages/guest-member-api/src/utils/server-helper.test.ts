// Copyright 2018 Prescryptive Health, Inc.

import bodyParser from 'body-parser';
import cors from 'cors';
import { Application, Router } from 'express';
import { Request, Response } from 'express';
import { Mongoose } from 'mongoose';
import morgan from 'morgan';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { Twilio } from 'twilio';
import { Logger } from 'winston';
import { IConfiguration } from '../configuration';
import { createControllers } from '../controllers/controller-init';
import {
  IDatabase,
  setupDatabase as setupDatabaseMongoV1,
} from '../databases/mongo-database/v1/setup/setup-database';
import { initializeRoutes } from '../routes/routes-init';
import {
  corsError,
  setupDatabase,
  setUpLogger,
  setupOrigin,
  setupRoutes,
  setupServer,
} from './server-helper';
import { validateAccountTokenMiddleware } from '../middlewares/account-token.middleware';
import { validateDeviceTokenMiddleware } from '../middlewares/device-token.middleware';
import { validateTokensMiddleware } from '../middlewares/validate-tokens.middleware';
import { featureSwitchesMiddleware } from '../middlewares/feature-switches.middleware';
import { logRequestBodyMiddleware } from '../middlewares/log-request-body.middleware';

jest.mock('../middlewares/account-token.middleware');
const validateAccountTokenMiddlewareMock =
  validateAccountTokenMiddleware as jest.Mock;

jest.mock('../middlewares/device-token.middleware');
const validateDeviceTokenMiddlewareMock =
  validateDeviceTokenMiddleware as jest.Mock;
jest.mock('../middlewares/validate-tokens.middleware');
const validateTokensMiddlewareMock = validateTokensMiddleware as jest.Mock;

jest.mock('../middlewares/feature-switches.middleware');
const featureSwitchesMiddlewareMock = featureSwitchesMiddleware as jest.Mock;

jest.mock('../middlewares/log-request-body.middleware');
const logRequestBodyMiddlewareMock = logRequestBodyMiddleware as jest.Mock;

const OLD_ENV = process.env;

jest.mock('cors', () => jest.fn());
jest.mock('morgan', () => jest.fn());
jest.mock('express', () => ({
  Router: jest.fn(),
}));

jest.mock('cluster');
jest.mock('../databases/mongo-database/v1/setup/setup-database', () => ({
  setupDatabase: jest.fn(),
}));

jest.mock('../controllers/controller-init', () => ({
  createControllers: jest.fn(),
}));

jest.mock('../routes/routes-init');
const mockInitializeRoutes = initializeRoutes as jest.Mock;

jest.mock('body-parser', () => ({
  json: jest.fn(),
  urlencoded: jest.fn(),
}));

const twilioClient = {} as Twilio;

jest.mock('twilio', () => jest.fn().mockImplementation(() => twilioClient));

jest.mock('./winston-config', () => ({
  LoggerStream: jest.fn().mockReturnValue('mockLoggerStream'),
}));

const corsMock = cors as unknown as jest.Mock;
const morganMock = morgan as unknown as jest.Mock;
const routerMock = Router as unknown as jest.Mock;
const setupDatabaseMongoV1Mock = setupDatabaseMongoV1 as unknown as jest.Mock;
const mockUrlencoded = bodyParser.urlencoded as unknown as jest.Mock;
const mockJson = bodyParser.json as unknown as jest.Mock;

const useMock = jest.fn();
const allMock = jest.fn();
const connectMock = jest.fn();
const listenMock = jest.fn();
const mockCallBack = jest.fn();

const serverMock = {
  all: allMock,
  listen: listenMock,
  use: useMock,
} as unknown as Application;

const mongooseMock = {
  connect: connectMock,
} as unknown as Mongoose;

const mockLogger = {
  info: jest.fn(),
} as unknown as Logger;

const configurationMock: IConfiguration = {
  accountTokenExpiryTime: 1800,
  alwaysAllowedFeatureFlags: [],
  appInsightInstrumentationKey: 'fakeKey',
  appInsightServiceName: 'appInsightServiceName',
  certificates: { pfxFile: 'base64contents', pfxPass: 'localhost' },
  childMemberAgeLimit: 13,
  connectionString: '',
  corsWhiteList: ['test.prescryptive.io', 'test.prescryptive.com', 'localhost'],
  contentApiUrl: 'content.test.prescryptive.io',
  contentApiSmartPricePassword: 'user',
  contentApiSmartPriceUserName: 'pwd',
  deviceTokenExpiryTime: 1999999,
  gearsApiSubscriptionKey: 'mock-gears-key',
  environment: 'fake',
  healthBotAppSecret: 'fakeappsecret',
  healthBotDefaultLocale: 'en-ux',
  healthBotDirectLineTokenEp: 'fakedirectline',
  healthBotWebchatSecret: 'fakewebchat-secret',
  orderNumberBlockLength: 100,
  jwtTokenExpiryTime: 1800,
  jwtTokenSecretKey: '',
  logger: mockLogger,
  maxPinVerificationAttempts: 5,
  maxIdentityVerificationAttempts: 5,
  partnerJwksMap: new Map(),
  paymentsKeyPrivate: 'private payments key',
  paymentsKeyPublic: 'public payments key',
  port: 9999,
  auth0: {
    clientId: 'auth0-client-id',
    clientSecret: 'auth0-client-secret',
    tokenApi: 'auth0-token-api',
    audienceAccumulators: 'auth0-audience-accumulators',
    audienceClaims: 'auth0-audience-claims',
    audienceIdentity: 'auth0-audience-identity',
  },
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
  redisDeviceTokenKeyExpiryTime: 10,
  redisHostName: 'redis-host.redis.cache.windows.net',
  redisPersonCreateKeyExpiryTime: 1800,
  redisPhoneNumberRegistrationKeyExpiryTime: 1800,
  redisPinKeyExpiryTime: 5,
  redisPinVerificationKeyExpiryTime: 30,
  redisIdentityVerificationKeyExpiryTime: 3600,
  redisNearbyPharmaciesKeyExpiryTime: 7200,
  redisCMSContentKeyExpiryTime: 1800,
  redisPort: 6379,
  serviceBusConnectionString: 'fake-connection-string',
  testPaymentsKeyPrivate: 'private test payments key',
  testPaymentsKeyPublic: 'public test payments key',
  topicNameHealthRecordEvent: 'topic-health-record-event-update',
  topicNameAppointmentCancelledEvent: 'fake-appointment-canccelled-topic',
  twilioAccountSid: 'AC-fake-account-sid',
  twilioAuthToken: 'fake-auth-token',
  twilioEmailVerificationServiceId: 'fake-verification-sid',
  twilioVerificationServiceId: 'fake-verification-sid',
  twilioMessagingFromPhoneNumber: 'fake-phone-number',
  twilioRemoveWaitlistUrl: 'fake-twilio-url',
  updateAccountTopicName: 'fake-account-topic',
  updatePersonTopicName: 'fake-azure',
  cancelAppointmentWindowExpiryTimeInHours: 6,
  smartPriceProcessorControllerNumber: 'X01',
  smartPriceRxGroup: '200P32F',
  redisPinResetScanDeleteCount: '1000',
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

const databaseMock = {} as IDatabase;

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

jest.mock('applicationinsights');
beforeEach(() => {
  jest.resetModules(); // this is important
  corsMock.mockReset();
  useMock.mockReset();
  allMock.mockReset();
  connectMock.mockReset();
  routerMock.mockReset();
  routerMock.mockReturnValue({ get: jest.fn() });
  setupDatabaseMongoV1Mock.mockReset();
  setupDatabaseMongoV1Mock.mockReturnValue(mongooseMock);
  mockUrlencoded.mockReset();
  mockUrlencoded.mockReturnValue('mockUrlencodedResponse');
  mockJson.mockReset();
  mockJson.mockReturnValue('mockJsonResponse');
  morganMock.mockReset();
  process.env = { ...OLD_ENV };
  validateAccountTokenMiddlewareMock.mockReset();
  validateDeviceTokenMiddlewareMock.mockReset();
  validateTokensMiddlewareMock.mockReset();
  featureSwitchesMiddlewareMock.mockReset();
  validateDeviceTokenMiddlewareMock.mockReset();
  logRequestBodyMiddlewareMock.mockReset();
});

afterEach(() => {
  process.env = OLD_ENV;
});

describe('setupOrigin', () => {
  it('calls callBack() once', () => {
    setupOrigin(
      configurationMock,
      'https://test.prescryptive.com',
      mockCallBack
    );
    expect(mockCallBack).toBeCalledTimes(1);
  });

  it('calls callBack() with allowed origin as true if origin is whiteListed', () => {
    setupOrigin(
      configurationMock,
      'https://test.prescryptive.com',
      mockCallBack
    );
    expect(mockCallBack).toBeCalledWith(null, true);
  });

  it('calls callBack() with allowed origin as true if origin is provided and it is in the whitelist', () => {
    setupOrigin(configurationMock, 'http://localhost', mockCallBack);
    expect(mockCallBack).toBeCalledWith(null, true);
  });

  it('calls callBack() with corsError if origin is provided and it is not whiteListed', () => {
    const requestOrigin = 'https://test.invalidOrigin.com';
    setupOrigin(configurationMock, requestOrigin, mockCallBack);
    expect(mockCallBack).toBeCalledWith(corsError(requestOrigin));
  });

  it('undefined origin is allowed (browser doesnt care) ', () => {
    setupOrigin(configurationMock, undefined, mockCallBack);
    expect(mockCallBack).toBeCalledWith(null, true);
  });

  it('allows hosts from process.env.GUESTMEMBEREXPERIENCE_CORS_HOSTS and process.env.GUESTMEMBEREXPERIENCE_HOST', () => {
    configurationMock.corsWhiteList = [
      'mywierdhost.com',
      'otherhost.com',
      'oldhost.com',
      'localhost',
    ];
    setupOrigin(configurationMock, 'https://otherhost.com', mockCallBack);
    expect(mockCallBack).toHaveBeenLastCalledWith(null, true);
    setupOrigin(configurationMock, 'https://oldhost.com', mockCallBack);
    expect(mockCallBack).toHaveBeenLastCalledWith(null, true);
    setupOrigin(configurationMock, 'https://notallowedhost.com', mockCallBack);
    expect(mockCallBack).toBeCalledWith(
      corsError('https://notallowedhost.com')
    );
    setupOrigin(configurationMock, 'https://mywierdhost.com', mockCallBack);
    expect(mockCallBack).toHaveBeenLastCalledWith(null, true);
  });
});

describe('setUpLogger()', () => {
  it('calls morgan() once', () => {
    setUpLogger(serverMock, configurationMock);
    expect(morganMock).toBeCalledTimes(1);
    expect(morganMock.mock.calls[0][0]).toBe('short');
    expect(morganMock.mock.calls[0][1].stream).toEqual({ logger: undefined });
    expect(morganMock.mock.calls[0][1]).toHaveProperty('skip');
  });

  it('skip should return true if status is 200', () => {
    setUpLogger(serverMock, configurationMock);
    const errorResponse = { statusCode: 200 } as unknown as Response;
    const mockRequest = {} as Request;
    const mockSkipResponse = morganMock.mock.calls[0][1].skip(
      mockRequest,
      errorResponse
    );
    expect(mockSkipResponse).toBeTruthy();
  });

  it('skip should return false if status is other than 200', () => {
    setUpLogger(serverMock, configurationMock);
    const errorResponse = { statusCode: 400 } as unknown as Response;
    const mockRequest = {} as Request;
    const mockSkipResponse = morganMock.mock.calls[0][1].skip(
      mockRequest,
      errorResponse
    );
    expect(mockSkipResponse).toBeFalsy();
  });
});

describe('setupServer()', () => {
  setUpLogger(serverMock, configurationMock);
  it('calls cors() twice', () => {
    setupServer(serverMock, configurationMock, databaseMock);
    expect(corsMock).toBeCalledTimes(2);
    expect(corsMock.mock.calls[1][0]).toEqual({
      exposedHeaders: [
        RequestHeaders.memberInfoRequestId,
        RequestHeaders.prescriptionInfoRequestId,
        RequestHeaders.deviceTokenRequestHeader,
        RequestHeaders.automationTokenRequestHeader,
        RequestHeaders.refreshAccountToken,
        RequestHeaders.refreshDeviceToken,
        RequestHeaders.apiVersion,
      ],
    });
  });

  it('calls server.use() times', () => {
    setupServer(serverMock, configurationMock, databaseMock);
    expect(serverMock.use).toBeCalledTimes(6);
  });
});

describe('setupDatabase()', () => {
  it('calls setupDatabaseMongoV1 once then call connect', async () => {
    await setupDatabase(configurationMock);
    expect(setupDatabaseMongoV1Mock).toBeCalledTimes(1);
  });
  it('calls mongoose.connect one time with connectionString', async () => {
    await setupDatabase(configurationMock);
    expect(connectMock).toBeCalledTimes(1);
    expect(connectMock).toBeCalledWith(configurationMock.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});

describe('setupRoutes()', () => {
  it('initializes a Router() required times', () => {
    setupRoutes(serverMock, databaseMock, configurationMock);
    expect(routerMock).toBeCalledTimes(1);
  });

  it('calls server.use required times', () => {
    setupRoutes(serverMock, databaseMock, configurationMock);
    expect(useMock).toBeCalledTimes(4);
  });

  it('should call server.use with urlencoded({extended: true})', () => {
    setupRoutes(serverMock, databaseMock, configurationMock);
    expect(mockUrlencoded).toHaveBeenCalledTimes(1);
    expect(mockUrlencoded).toHaveBeenCalledWith({ extended: true });
    expect(useMock.mock.calls[0][0]).toBe('mockUrlencodedResponse');
  });

  it('should call server.use with json', () => {
    setupRoutes(serverMock, databaseMock, configurationMock);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(useMock.mock.calls[1][0]).toBe('mockJsonResponse');
  });
  it('should call server.use with base route /api/session,  validateTokensMiddleware and router', () => {
    setupRoutes(serverMock, databaseMock, configurationMock);
    expect(useMock.mock.calls[2][0]).toBe('/api/session');
    expect(useMock.mock.calls[2][1]).toBe(logRequestBodyMiddlewareMock);
    expect(useMock.mock.calls[2][2]).toBe(validateTokensMiddlewareMock());
    expect(useMock.mock.calls[2][3]).toBe(featureSwitchesMiddlewareMock());
    expect(useMock.mock.calls[2][4]).toBe(routerMock());
  });
  it('should call server.use with base route /api, deviceTokenMiddleware, accountTokenMiddleware and router', () => {
    setupRoutes(serverMock, databaseMock, configurationMock);
    expect(useMock.mock.calls[3][0]).toBe('/api');
    expect(useMock.mock.calls[3][1]).toBe(logRequestBodyMiddlewareMock);
    expect(useMock.mock.calls[3][2]).toBe(validateDeviceTokenMiddlewareMock());
    expect(useMock.mock.calls[3][3]).toBe(validateAccountTokenMiddlewareMock());
    expect(useMock.mock.calls[3][4]).toBe(featureSwitchesMiddlewareMock());
    expect(useMock.mock.calls[3][5]).toBe(routerMock());
  });
});

describe('initializeRoutes', () => {
  setupRoutes(serverMock, databaseMock, configurationMock);
  it('initializeRoutes calls with IController type at 1st position', () => {
    expect(mockInitializeRoutes.mock.calls[0][1]).toEqual(
      createControllers(configurationMock, databaseMock, twilioClient)
    );
  });
});
