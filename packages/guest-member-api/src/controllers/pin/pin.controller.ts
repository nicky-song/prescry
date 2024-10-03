// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { addPinHandler } from './handlers/add-pin.handler';
import { verifyPinHandler } from './handlers/verify-pin.handler';
import { updatePinHandler } from './handlers/update-pin.handler';
import { getEndpointVersion } from '../../utils/request/get-endpoint-version';
import { addPinHandlerV2 } from './handlers/add-pin-v2.handler';

export class PinController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(
    configuration: IConfiguration,
    database: IDatabase
  ) {
    this.database = database;
    this.configuration = configuration;
  }

  public addPin = async (request: Request, response: Response) =>
    getEndpointVersion(request) === 'v2'
      ? await addPinHandlerV2(request, response, this.configuration)
      : await addPinHandler(
          request,
          response,
          this.database,
          this.configuration
        );

  public verifyPin = async (request: Request, response: Response) =>
    await verifyPinHandler(
      request,
      response,
      this.database,
      this.configuration
    );

  public updatePin = async (request: Request, response: Response) =>
    await updatePinHandler(
      request,
      response,
      this.database,
      this.configuration
    );
}
