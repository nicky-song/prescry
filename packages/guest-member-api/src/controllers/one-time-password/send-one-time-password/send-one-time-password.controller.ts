// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import { sendOneTimePasswordHandler } from './handlers/send-one-time-password.handler';

export class SendOneTimePasswordController {
  public configuration: IConfiguration;
  public twilioClient: Twilio;

  constructor(
    configuration: IConfiguration,
    twilioClient: Twilio,
  ) {
    this.configuration = configuration;
    this.twilioClient = twilioClient;
  }

  public sendOneTimePassword = async (request: Request, response: Response) => {
    await sendOneTimePasswordHandler(
      request,
      response,
      this.twilioClient,
      this.configuration
    );
  };
}
