// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getGeolocationHandler } from './handlers/get-geolocation.handler';
import { IConfiguration } from '../../configuration';
import { getGeolocationPharmaciesHandler } from './handlers/get-geolocation-pharmacies.handler';
import { getGeolocationAutocompleteHandler } from './handlers/get-geolocation-autocomplete.handler';

export class GeolocationController {
  public configuration: IConfiguration;
  constructor(configuration: IConfiguration) {
    this.configuration = configuration;
  }

  public getGeolocation = async (request: Request, response: Response) =>
    await getGeolocationHandler(request, response, this.configuration);

  public getGeolocationPharmacies = async (
    request: Request,
    response: Response
  ) =>
    await getGeolocationPharmaciesHandler(
      request,
      response,
      this.configuration
    );

  public getGeolocationAutocomplete = async (
    request: Request,
    response: Response
  ) =>
    await getGeolocationAutocompleteHandler(
      request,
      response,
      this.configuration
    );
}
