// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { getFavoritedPharmaciesHandler } from './handlers/get-favorited-pharmacies.handler';
import { addRecoveryEmailHandler } from './handlers/add-recovery-email.handler';
import { createAccountHandler } from './handlers/create-account.handler';
import { updateFavoritedPharmaciesHandler } from './handlers/update-favorited-pharmacies.handler';
import { updateFeatureKnownHandler } from './handlers/update-feature-known.handler';
import { updateRecoveryEmailHandler } from './handlers/update-recovery-email.handler';
import { updateLanguageCodeHandler } from './handlers/update-language-code.handler';

export class AccountController {
  public configuration: IConfiguration;
  public database: IDatabase;
  public twilioClient: Twilio;

  constructor(
    configuration: IConfiguration,
    database: IDatabase,
    twilioClient: Twilio,
  ) {
    this.configuration = configuration;
    this.twilioClient = twilioClient;
    this.database = database;
  }

  public addEmail = async (request: Request, response: Response) =>
    await addRecoveryEmailHandler(request, response, this.configuration);

  public updateEmail = async (request: Request, response: Response) =>
    await updateRecoveryEmailHandler(request, response, this.configuration);

  public createAccount = async (request: Request, response: Response) =>
    await createAccountHandler(
      request,
      response,
      this.database,
      this.configuration,
      this.twilioClient
    );

  public updateFavoritedPharmacies = async (
    request: Request,
    response: Response
  ) =>
    await updateFavoritedPharmaciesHandler(
      request,
      response,
      this.configuration
    );

  public getFavoritedPharmaciesList = async (
    request: Request,
    response: Response
  ) =>
    await getFavoritedPharmaciesHandler(request, response, this.configuration);

  public updateFeatureKnown = async (_request: Request, response: Response) =>
    await updateFeatureKnownHandler(response);

  public updateLanguageCode = async (request: Request, response: Response) =>
    await updateLanguageCodeHandler(this.configuration, request, response);
}
