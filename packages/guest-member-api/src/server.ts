// Copyright 2018 Prescryptive Health, Inc.

import express from 'express';
import { createServer, ServerOptions } from 'https';
import { getEnvironmentConfiguration } from './configuration';
import { JwksManager } from './tokens/jwks-manager';
import { setupAppInsightService } from './utils/app-insight-helper';
import { convertBase64ToBinary } from './utils/convert-helper';
import { initializeRedisClient } from './utils/redis/redis.helper';
import { setupDatabase, setUpLogger, setupServer } from './utils/server-helper';
import { initializeServiceBus } from './utils/service-bus/service-bus-helper';

export async function startServer() {
  const app = express();
  const configuration = getEnvironmentConfiguration();
  const jwksManager = JwksManager.getInstance();
  jwksManager.updateClientInstances(configuration.partnerJwksMap);
  await setUpLogger(app, configuration);

  setupAppInsightService(configuration);

  initializeServiceBus(
    configuration.serviceBusConnectionString,
    configuration.updatePersonTopicName,
    configuration.updateAccountTopicName,
    configuration.topicNameHealthRecordEvent,
    configuration.topicNameAppointmentCancelledEvent,
    configuration.topicCommonBusinessEvent,
    configuration.topicCommonMonitoringEvent
  );

  initializeRedisClient(
    configuration.redisPort,
    configuration.redisHostName,
    configuration.redisAuthPass,
    configuration.redisDeviceTokenKeyExpiryTime,
    configuration.redisPinKeyExpiryTime,
    configuration.redisPinVerificationKeyExpiryTime,
    configuration.redisPinResetScanDeleteCount
  );

  const pfx = convertBase64ToBinary(configuration.certificates.pfxFile);
  const certificates: ServerOptions = {
    passphrase: configuration.certificates.pfxPass,
    pfx,
    rejectUnauthorized: false,
    requestCert: false,
  };

  const database = await setupDatabase(configuration);
  setupServer(app, configuration, database);
  const server = createServer(certificates, app);
  server.listen(configuration.port);
  return;
}
