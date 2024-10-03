// Copyright 2018 Prescryptive Health, Inc.

import { Application } from 'express';
import { createServer } from 'https';
import { getEnvironmentConfiguration, IConfiguration } from './configuration';
import { startServer } from './server';
import { setupAppInsightService } from './utils/app-insight-helper';
import { initializeRedisClient } from './utils/redis/redis.helper';
import { setupDatabase, setUpLogger, setupServer } from './utils/server-helper';
import { initializeServiceBus } from './utils/service-bus/service-bus-helper';
import { setLogger } from './utils/winston-config';

const applicationMock = jest.fn() as unknown as Application;

jest.mock('express', () => () => applicationMock);

jest.mock('./utils/server-helper', () => ({
  setUpLogger: jest.fn(),
  setupDatabase: jest.fn(),
  setupServer: jest.fn(),
}));

jest.mock('./utils/app-insight-helper', () => ({
  setupAppInsightService: jest.fn(),
}));
jest.mock('./utils/service-bus/service-bus-helper', () => ({
  initializeServiceBus: jest.fn(),
}));

jest.mock('https', () => ({
  createServer: jest.fn().mockReturnValue({
    listen: jest.fn(),
  }),
}));

jest.mock('./utils/redis/redis.helper', () => ({
  initializeRedisClient: jest.fn(),
}));

jest.mock('./utils/redis/redis-order-number.helper', () => ({
  initiateValueForOrderNumber: jest.fn(),
}));

const setupAppInsightServiceMock = setupAppInsightService as jest.Mock;
const setupDatabaseMock = setupDatabase as unknown as jest.Mock;
const setupServerMock = setupServer as unknown as jest.Mock;
const setupLoggerMock = setUpLogger as unknown as jest.Mock;
const mockInitializeServiceBusClientAndTopic =
  initializeServiceBus as jest.Mock;
const createServerHttpsMock = createServer as unknown as jest.Mock;
const initializeRedisClientMock = initializeRedisClient as jest.Mock;

const configurationMock = {
  appInsightInstrumentationKey: 'fakeKey',
  appInsightServiceName: 'appInsightServiceName',
  certificates: { pfxFile: 'ContentOfCrtFile', pfxPass: 'password' },
  connectionString: '',
  corsWhiteList: ['localhost'],
  environment: 'development',
  jwtTokenExpiryTime: 1800,
  jwtTokenSecretKey: 'fakeKey',
  logger: setLogger('./test.log'),
  port: 4300,
  redisAuthPass: 'redis-auth-pass',
  redisDeviceTokenKeyExpiryTime: 30,
  redisHostName: 'redis-host',
  redisPinKeyExpiryTime: 1800,
  redisPort: 9999,
  serviceBusConnectionString: 'fake-connection-string',
  twilioAccountSid: 'fake-account-sid',
  twilioAuthToken: 'fake-auth-token',
  twilioVerificationServiceId: 'fake-verification-sid',
  updateAccountTopicName: 'fake-account-topic',
  updatePersonTopicName: 'fake-person-topic',
  topicNameHealthRecordEvent: 'fake-health-record-topic',
  topicNameAppointmentCancelledEvent:
    'fake-appointment-cancellation-requested-topic',
  orderNumberBlockLength: 100,
  redisPinResetScanDeleteCount: '1000',
  partnerJwksMap: new Map(),
} as IConfiguration;

jest.mock('./configuration', () => ({
  getEnvironmentConfiguration: jest.fn(),
}));

const databaseMock = {};

const getEnvironmentConfigurationMock =
  getEnvironmentConfiguration as unknown as jest.Mock;
getEnvironmentConfigurationMock.mockReturnValue(configurationMock);

setupDatabaseMock.mockReturnValue(databaseMock);

createServerHttpsMock.mockReturnValue({
  listen: jest.fn(),
});

describe('startServer() - If process is master process and environment is development', () => {
  beforeAll(async () => {
    await startServer();
  });

  it('calls setupLogger() once with configuration', () => {
    expect(setupLoggerMock).toBeCalledTimes(1);
  });

  it('calls createServer()', () => {
    expect(createServerHttpsMock).toBeCalledTimes(1);
  });

  it('calls setupDatabase() once with configuration', () => {
    expect(setupDatabaseMock).toBeCalledTimes(1);
  });

  it('calls setupServer() once with configuration', () => {
    expect(setupServerMock).toBeCalledTimes(1);
    expect(setupServerMock).toBeCalledWith(
      applicationMock,
      configurationMock,
      databaseMock
    );
  });

  it('calls getEnvironmentConfiguration() once', () => {
    expect(getEnvironmentConfigurationMock).toBeCalledTimes(1);
  });

  it('should call setupAppInsightServiceMock', () => {
    expect(setupAppInsightServiceMock).toHaveBeenCalledWith(configurationMock);
  });

  it('calls initializeServiceBusClientAndTopic once ', () => {
    expect(mockInitializeServiceBusClientAndTopic).toHaveBeenNthCalledWith(
      1,
      configurationMock.serviceBusConnectionString,
      configurationMock.updatePersonTopicName,
      configurationMock.updateAccountTopicName,
      configurationMock.topicNameHealthRecordEvent,
      configurationMock.topicNameAppointmentCancelledEvent,
      configurationMock.topicCommonBusinessEvent,
      configurationMock.topicCommonMonitoringEvent
    );
  });

  it('should call initializeRedisClientMock', () => {
    expect(initializeRedisClientMock).toHaveBeenNthCalledWith(
      1,
      configurationMock.redisPort,
      configurationMock.redisHostName,
      configurationMock.redisAuthPass,
      configurationMock.redisDeviceTokenKeyExpiryTime,
      configurationMock.redisPinKeyExpiryTime,
      configurationMock.redisPinVerificationKeyExpiryTime,
      configurationMock.redisPinResetScanDeleteCount
    );
  });
});
