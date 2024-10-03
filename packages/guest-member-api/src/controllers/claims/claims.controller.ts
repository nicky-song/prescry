// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { getClaimsAccumulatorsHandler } from './handlers/get-claims-accumulators.handler';
import { getClaimsHandler } from './handlers/get-claims.handler';

export class ClaimsController {
  public configuration: IConfiguration;

  constructor(configuration: IConfiguration) {
    this.configuration = configuration;
  }

  public getClaims = (_request: Request, response: Response) => {
    getClaimsHandler(response, this.configuration);
  };

  public getClaimsAccumulators = async (
    _request: Request,
    response: Response
  ) => await getClaimsAccumulatorsHandler(response, this.configuration);
}
