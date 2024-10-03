// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { sendRegistrationTextHandler } from './handlers/send-registration-text.handler';
import { SendRegistrationTextController } from './send-registration-text.controller';
import { configurationMock } from '../../mock-data/configuration.mock';
import { twilioMock } from '../../mock-data/twilio.mock';

jest.mock('./handlers/send-registration-text.handler');
const responseMock = {} as Response;
const requestMock = {} as Request;

const sendRegistrationTextHandlerMock =
  sendRegistrationTextHandler as jest.Mock;

describe('SendRegistrationTextController', () => {
  beforeEach(() => {
    sendRegistrationTextHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const sendRegistrationTextController = new SendRegistrationTextController(
      configurationMock,
      twilioMock
    );
    expect(sendRegistrationTextController.sendRegistrationText).toBeDefined();
  });
  it('should call sendRegistrationTextHandler handler for register Route', async () => {
    const routeHandler = new SendRegistrationTextController(
      configurationMock,
      twilioMock
    ).sendRegistrationText;
    await routeHandler(requestMock, responseMock);
    expect(sendRegistrationTextHandlerMock).toBeCalledTimes(1);

    expect(sendRegistrationTextHandlerMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      configurationMock,
      twilioMock
    );
  });
});
