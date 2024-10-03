// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { updateMemberContactInfoHandler } from './handlers/update-member-contact-info.handler';

export class MemberContactInfoUpdateController {
  public configuration: IConfiguration;

  constructor(configuration: IConfiguration) {
    this.configuration = configuration;
  }

  public updateMemberContactInfo = async (
    request: Request,
    response: Response
  ) =>
    await updateMemberContactInfoHandler(request, response, this.configuration);
}
