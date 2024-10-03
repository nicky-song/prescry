// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { getClaimAlertHandler } from './handlers/get-claim-alert.handler';

import { IConfiguration } from '../../configuration';

export class ClaimAlertController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(database: IDatabase, configuration: IConfiguration) {
    this.database = database;
    this.configuration = configuration;
  }

  public getClaimAlert = async (request: Request, response: Response) =>
    await getClaimAlertHandler(request, response, this.database);
}
