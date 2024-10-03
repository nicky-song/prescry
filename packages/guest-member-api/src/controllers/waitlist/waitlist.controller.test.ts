// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { createWaitlistHandler } from './handlers/create-waitlist.handler';
import { WaitlistController } from './waitlist.controller';
import { removeWaitlistHandler } from './handlers/remove-waitlist.handler';
import { configurationMock } from '../../mock-data/configuration.mock';
import { databaseMock } from '../../mock-data/database.mock';
import { twilioMock } from '../../mock-data/twilio.mock';

jest.mock('./handlers/create-waitlist.handler');
const createWaitlistHandlerMock = createWaitlistHandler as jest.Mock;

jest.mock('./handlers/remove-waitlist.handler');
const removeWaitlistHandlerMock = removeWaitlistHandler as jest.Mock;

describe('waitlistController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    createWaitlistHandlerMock.mockReset();
    removeWaitlistHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const waitlistController = new WaitlistController(
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expect(waitlistController.createWaitlist).toBeDefined();
    expect(waitlistController.removeWaitlist).toBeDefined();
  });

  it('should call createWaitlistHandler handler for createWaitlist Route', async () => {
    const routeHandler = new WaitlistController(
      databaseMock,
      configurationMock,
      twilioMock,
    ).createWaitlist;
    await routeHandler(requestMock, routerResponseMock);
    expect(createWaitlistHandlerMock).toBeCalledTimes(1);

    expect(createWaitlistHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );
  });
  it('should call removeWaitlistHandler handler for removeWaitlist Route', async () => {
    const routeHandler = new WaitlistController(
      databaseMock,
      configurationMock,
      twilioMock,
    ).removeWaitlist;
    await routeHandler(requestMock, routerResponseMock);
    expect(removeWaitlistHandlerMock).toBeCalledTimes(1);

    expect(removeWaitlistHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
  });
});
