// Copyright 2018 Prescryptive Health, Inc.

import bodyParser from 'body-parser';
import cors from 'cors';
import { Application, Router } from 'express';
import { Request, Response } from 'express';
import morgan from 'morgan';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import Twilio from 'twilio';
import { URL } from 'url';
import { Logger } from 'winston';
import { IConfiguration } from '../configuration';
import { createControllers } from '../controllers/controller-init';
import {
  IDatabase,
  setupDatabase as setupDatabaseMongoV1,
} from '../databases/mongo-database/v1/setup/setup-database';
import { validateAccountTokenMiddleware } from '../middlewares/account-token.middleware';
import { validateDeviceTokenMiddleware } from '../middlewares/device-token.middleware';
import { initializeRoutes } from '../routes/routes-init';
import { LoggerStream } from './winston-config';
import { validateTokensMiddleware } from '../middlewares/validate-tokens.middleware';

import { featureSwitchesMiddleware } from '../middlewares/feature-switches.middleware';
import { logRequestBodyMiddleware } from '../middlewares/log-request-body.middleware';

export let logger: Logger;

export function corsError(origin: string | undefined): Error {
  return new Error(
    'Request from origin "' + origin + '" is not allowed by CORS'
  );
}

export function setupOrigin(
  configuration: IConfiguration,
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void {
  if (!isOptionalOriginValid(configuration, origin)) {
    callback(corsError(origin));
  } else {
    callback(null, true);
  }
}

export function isOptionalOriginValid(
  configuration: IConfiguration,
  origin?: string
) {
  if (!origin) {
    return true;
  }

  const url = new URL(origin);
  const isOriginaWhitelisted =
    configuration.corsWhiteList.indexOf(url.hostname) > -1;
  return isOriginaWhitelisted;
}

export function setupServer(
  server: Application,
  configuration: IConfiguration,
  database: IDatabase
): void {
  server.use(
    cors({
      origin: (origin, callback) =>
        setupOrigin(configuration, origin, callback),
    })
  );
  server.use(
    cors({
      exposedHeaders: [
        RequestHeaders.memberInfoRequestId,
        RequestHeaders.prescriptionInfoRequestId,
        RequestHeaders.deviceTokenRequestHeader,
        RequestHeaders.automationTokenRequestHeader,
        RequestHeaders.refreshAccountToken,
        RequestHeaders.refreshDeviceToken,
        RequestHeaders.apiVersion,
      ],
    })
  );
  setupRoutes(server, database, configuration);
}

export function setUpLogger(
  server: Application,
  configuration: IConfiguration
): void {
  logger = configuration.logger;
  server.use(
    morgan('short', {
      stream: new LoggerStream(logger),

      skip(_request: Request, response: Response) {
        if (response.statusCode === 200) {
          return true;
        } else {
          return response.statusCode < 400;
        }
      },
    })
  );
}

export function setupRoutes(
  server: Application,
  database: IDatabase,
  configuration: IConfiguration
): void {
  logger.info('setting up api routes');

  const twilioClient = Twilio(
    configuration.twilioAccountSid,
    configuration.twilioAuthToken
  );

  const router = Router();

  // TODO: move the base route to configuration
  server.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  server.use(bodyParser.json());

  initializeRoutes(
    router,
    createControllers(configuration, database, twilioClient)
  );

  server.use(
    '/api/session',
    logRequestBodyMiddleware,
    validateTokensMiddleware(configuration, database),
    featureSwitchesMiddleware(),
    router
  );
  server.use(
    '/api',
    logRequestBodyMiddleware,
    validateDeviceTokenMiddleware(configuration, database),
    validateAccountTokenMiddleware(configuration, database),
    featureSwitchesMiddleware(),
    router
  );
}

export async function setupDatabase(
  configuration: IConfiguration
): Promise<IDatabase> {
  logger.info('setting up and connecting to database');

  const database = setupDatabaseMongoV1();

  // TODO: do we always need to connect immediately? holding an open connection for the life of the server doesn't last - does this run every time?
  await database.connect(configuration.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  logger.info('DB Connected');
  return database;
}
