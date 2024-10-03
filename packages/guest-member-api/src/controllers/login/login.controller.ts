// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { loginHandler } from './handlers/login.handler';

export class LoginController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(
    database: IDatabase,
    configuration: IConfiguration,
  ) {
    this.database = database;
    this.configuration = configuration;
  }

  public login = async (request: Request, response: Response) =>
    await loginHandler(request, response, this.database, this.configuration);
}
