// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { registerSmartPriceHandler } from './handlers/register-smart-price.handler';
import { Twilio } from 'twilio';
import { getSmartPriceUserMembershipHandler } from './handlers/get-smart-price-user-membership.handler';
import { isRegisteredUserHandler } from './handlers/is-registered-user.handler';
import { appRegisterSmartPriceHandler } from './handlers/app-register-smart-price.handler';

export class SmartPriceController {
  public database: IDatabase;
  public configuration: IConfiguration;
  public twilio: Twilio;

  constructor(
    configuration: IConfiguration,
    database: IDatabase,
    twilioClient: Twilio
  ) {
    this.database = database;
    this.configuration = configuration;
    this.twilio = twilioClient;
  }

  public register = async (request: Request, response: Response) =>
    await registerSmartPriceHandler(
      request,
      response,
      this.database,
      this.configuration,
      this.twilio
    );

  public appRegister = async (request: Request, response: Response) =>
    await appRegisterSmartPriceHandler(
      request,
      response,
      this.database,
      this.configuration,
      this.twilio
    );

  public getSmartPriceUserMembership = async (
    request: Request,
    response: Response
  ) =>
    await getSmartPriceUserMembershipHandler(request, response, this.database);

  public isSmartPriceUser = async (request: Request, response: Response) =>
    await isRegisteredUserHandler(request, response, this.database);
}
