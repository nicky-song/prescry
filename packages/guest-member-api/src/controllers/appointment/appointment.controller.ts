// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';

import { getAppointmentHandler } from './handlers/get-appointment.handler';
import { getAllAppointmentsHandler } from './handlers/get-all-appointments.handler';
import { IConfiguration } from '../../configuration';

export class AppointmentController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(
    database: IDatabase,
    configuration: IConfiguration,
  ) {
    this.database = database;
    this.configuration = configuration;
  }

  public getAppointments = async (request: Request, response: Response) =>
    await getAllAppointmentsHandler(
      request,
      response,
      this.database,
      this.configuration
    );

  public getAppointmentForOrderNumber = async (
    request: Request,
    response: Response
  ) =>
    await getAppointmentHandler(
      request,
      response,
      this.database,
      this.configuration
    );
}
