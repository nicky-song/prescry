// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { getCMSContentHandler } from './handlers/get-cms-content.handler';

export class CMSContentController {
  public configuration: IConfiguration;
  constructor(configuration: IConfiguration) {
    this.configuration = configuration;
  }

  public getCMSContent = async (request: Request, response: Response) =>
    await getCMSContentHandler(request, response, this.configuration);
}
