// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { IConfiguration } from '../../configuration';
import { processInviteCodeHandler } from './handlers/process-invite-code.handler';

export class InviteCodeController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(database: IDatabase, configuration: IConfiguration) {
    this.database = database;
    this.configuration = configuration;
  }
  public getDetailsForInviteCode = async (
    request: Request,
    response: Response
  ) =>
    await processInviteCodeHandler(
      request,
      response,
      this.database,
      this.configuration
    );
}
