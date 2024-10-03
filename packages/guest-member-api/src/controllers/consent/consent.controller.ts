// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { acceptConsentHandler } from './handlers/accept-consent.handler';

export class ConsentController {
  public configuration: IConfiguration;

  constructor(configuration: IConfiguration) {
    this.configuration = configuration;
  }
  public acceptConsent = async (request: Request, response: Response) =>
    await acceptConsentHandler(request, response, this.configuration);
}
