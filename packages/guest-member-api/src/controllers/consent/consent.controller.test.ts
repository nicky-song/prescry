// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { configurationMock } from '../../mock-data/configuration.mock';
import { ConsentController } from './consent.controller';
import { acceptConsentHandler } from './handlers/accept-consent.handler';

jest.mock('./handlers/accept-consent.handler');
const acceptConsentHandlerMock = acceptConsentHandler as jest.Mock;

describe('ConsentController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    acceptConsentHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const consentController = new ConsentController(configurationMock);
    expect(consentController.acceptConsent).toBeDefined();
  });
  it('should call acceptConsentHandler for acceptConsent Route', async () => {
    const routeHandler = new ConsentController(configurationMock).acceptConsent;
    await routeHandler(requestMock, routerResponseMock);
    expect(acceptConsentHandlerMock).toBeCalledTimes(1);

    expect(acceptConsentHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
});
