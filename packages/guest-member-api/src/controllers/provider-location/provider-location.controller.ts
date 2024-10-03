// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { createAppointmentHandler } from './handlers/create-appointment.handler';
import { getLocationByIdentifierHandler } from './handlers/get-location-by-identifier.handler';
import { lockSlotHandler } from './handlers/lock-slot.handler';
import { unlockSlotHandler } from './handlers/unlock-slot.handler';
import { getStaffAvailabilityHandler } from './handlers/get-staff-availability.handler';
import { getProviderLocationsHandler } from './handlers/get-provider-locations.handler';
import { cancelBookingHandler } from './handlers/cancel-booking.handler';
import { getEndpointVersion } from '../../utils/request/get-endpoint-version';
import { createAppointmentHandlerV2 } from './handlers/create-appointment-v2.handler';

export class ProviderLocationController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(
    database: IDatabase,
    configuration: IConfiguration
  ) {
    this.database = database;
    this.configuration = configuration;
  }

  public getProviderLocations = async (request: Request, response: Response) =>
    await getProviderLocationsHandler(request, response, this.configuration);

  public getLocationByIdentifier = async (
    request: Request,
    response: Response
  ) =>
    await getLocationByIdentifierHandler(request, response, this.configuration);

  public getStaffAvailability = async (request: Request, response: Response) =>
    await getStaffAvailabilityHandler(request, response, this.configuration);

  public createBooking = async (request: Request, response: Response) =>
    getEndpointVersion(request) === 'v2'
      ? await createAppointmentHandlerV2(
        request,
        response,
        this.database,
        this.configuration
      )
      : await createAppointmentHandler(
        request,
        response,
        this.database,
        this.configuration
      );

  public cancelBooking = async (request: Request, response: Response) =>
    await cancelBookingHandler(
      request,
      response,
      this.database,
      this.configuration
    );

  public lockSlot = async (request: Request, response: Response) =>
    await lockSlotHandler(request, response, this.configuration);

  public unlockSlot = async (request: Request, response: Response) =>
    await unlockSlotHandler(request, response, this.configuration);
}
