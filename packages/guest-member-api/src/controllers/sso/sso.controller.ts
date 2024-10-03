// Copyright 2022 Prescryptive Health, Inc.

import type { Request, Response } from 'express';
import type { Twilio } from 'twilio';

import type { IConfiguration } from '../../configuration';
import type { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';

import { JwksManager } from '../../tokens/jwks-manager';

import { partnerSsoHandler } from './handlers/partner-sso.handler';

export class SsoController {
  public database: IDatabase;
  public configuration: IConfiguration;
  public jwksManger: JwksManager;
  public twilioClient: Twilio;

  constructor(
    database: IDatabase,
    configuration: IConfiguration,
    twilioClient: Twilio
  ) {
    this.database = database;
    this.configuration = configuration;
    this.jwksManger = JwksManager.getInstance();
    this.twilioClient = twilioClient;
  }

  public partnerSso = async (request: Request, response: Response) =>
    await partnerSsoHandler(
      request,
      response,
      this.configuration,
      this.database,
      this.jwksManger,
      this.twilioClient
    );
}
