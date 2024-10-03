// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { verifyIdentityHandler } from './handlers/verify-identity.handler';
import { pinResetHandler } from './handlers/pin-reset.handler';
import { sendVerificationCodeHandler } from './handlers/send-verification-code.handler';

export class PinResetController {
  public database: IDatabase;
  public configuration: IConfiguration;
  public twilioClient: Twilio;

  constructor(
    configuration: IConfiguration,
    database: IDatabase,
    twilioClient: Twilio,
  ) {
    this.database = database;
    this.configuration = configuration;
    this.twilioClient = twilioClient;
  }

  public sendVerificationCode = async (request: Request, response: Response) =>
    await sendVerificationCodeHandler(
      request,
      response,
      this.database,
      this.configuration,
      this.twilioClient
    );

  public resetPin = async (request: Request, response: Response) =>
    await pinResetHandler(
      request,
      response,
      this.database,
      this.configuration,
      this.twilioClient
    );

  public verifyIdentity = async (request: Request, response: Response) =>
    await verifyIdentityHandler(
      request,
      response,
      this.database,
      this.configuration
    );
}
