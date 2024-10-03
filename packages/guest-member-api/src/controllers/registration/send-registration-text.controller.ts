// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../configuration';
import { sendRegistrationTextHandler } from './handlers/send-registration-text.handler';

export class SendRegistrationTextController {
  public configuration: IConfiguration;
  public twilioClient: Twilio;

  constructor(configuration: IConfiguration, twilioClient: Twilio) {
    this.configuration = configuration;
    this.twilioClient = twilioClient;
  }

  public sendRegistrationText = async (request: Request, response: Response) =>
    await sendRegistrationTextHandler(
      request,
      response,
      this.configuration,
      this.twilioClient
    );
}
