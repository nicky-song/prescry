// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { getPendingPrescriptionsHandler } from './handlers/get-pending-prescriptions.handler';

export class PendingPrescriptionsController {
  public database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  public getPendingPrescription = async (
    request: Request,
    response: Response
  ) => await getPendingPrescriptionsHandler(request, response, this.database);
}
