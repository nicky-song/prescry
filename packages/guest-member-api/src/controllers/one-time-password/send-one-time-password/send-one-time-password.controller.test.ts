// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { SendOneTimePasswordController } from './send-one-time-password.controller';
import { sendOneTimePasswordHandler } from './handlers/send-one-time-password.handler';
import { configurationMock } from '../../../mock-data/configuration.mock';

jest.mock('./handlers/send-one-time-password.handler');
const sendOneTimePasswordHandlerMock = sendOneTimePasswordHandler as jest.Mock;

const routerResponseMock = {
  locals: {
    automationPhone: 'X1112223333',
    code: '123456',
  },
} as unknown as Response;

const mockNumber = 'phone-number';
const requestMock = {
  body: { phoneNumber: mockNumber },
  headers: {
    authorization: 'token',
  },
} as Request;

const twilioClient = {} as Twilio;

describe('one-time-password/send controller', () => {
  it('should create controller object with route methods', () => {
    const sendOneTimePasswordController = new SendOneTimePasswordController(
      configurationMock,
      twilioClient,
    );
    expect(sendOneTimePasswordController.sendOneTimePassword).toBeDefined();
  });

  it('should call sendOneTimePasswordHandler handler for send Route', async () => {
    const routeHandler = new SendOneTimePasswordController(
      configurationMock,
      twilioClient,
    ).sendOneTimePassword;
    await routeHandler(requestMock, routerResponseMock);
    expect(sendOneTimePasswordHandlerMock).toBeCalledTimes(1);

    expect(sendOneTimePasswordHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      twilioClient,
      configurationMock,
    );
  });
});
