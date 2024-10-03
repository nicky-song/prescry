// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { IConfiguration } from '../../configuration';
import { getImmunizationRecordHandler } from './handlers/get-immunization-record.handler';

export class ImmunizationRecordController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(database: IDatabase, configuration: IConfiguration) {
    this.database = database;
    this.configuration = configuration;
  }

  public getImmunizationRecordForOrderNumber = async (
    request: Request,
    response: Response
  ) =>
    await getImmunizationRecordHandler(
      request,
      response,
      this.database,
      this.configuration
    );
}
