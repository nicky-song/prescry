// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { createWaitlistHandler } from './handlers/create-waitlist.handler';
import { Twilio } from 'twilio';
import { removeWaitlistHandler } from './handlers/remove-waitlist.handler';
import { IConfiguration } from '../../configuration';

export class WaitlistController {
  public database: IDatabase;
  public configuration: IConfiguration;
  public twilioClient: Twilio;

  constructor(
    database: IDatabase,
    configuration: IConfiguration,
    twilioClient: Twilio
  ) {
    this.database = database;
    this.configuration = configuration;
    this.twilioClient = twilioClient;
  }

  public createWaitlist = async (request: Request, response: Response) =>
    await createWaitlistHandler(
      request,
      response,
      this.database,
      this.configuration,
      this.twilioClient
    );
  public removeWaitlist = async (request: Request, response: Response) =>
    await removeWaitlistHandler(
      request,
      response,
      this.database,
      this.configuration
    );
}
