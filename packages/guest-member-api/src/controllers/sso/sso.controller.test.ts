// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';

import { partnerSsoHandler } from './handlers/partner-sso.handler';
import { SsoController } from './sso.controller';
import { configurationMock } from '../../mock-data/configuration.mock';

import { databaseMock } from '../../mock-data/database.mock';
import { twilioMock } from '../../mock-data/twilio.mock';
import { JwksManager } from '../../tokens/jwks-manager';

jest.mock('./handlers/partner-sso.handler');
const partnerSsoHandlerMock = partnerSsoHandler as jest.Mock;

describe('SsoController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  it('constructs controller', () => {
    const ssoController = new SsoController(
      databaseMock,
      configurationMock,
      twilioMock
    );

    expect(ssoController).toBeDefined();
  });

  it('Calls partnerSsoHandler for verify sso route', async () => {
    const routeHandler = new SsoController(
      databaseMock,
      configurationMock,
      twilioMock
    ).partnerSso;
    await routeHandler(requestMock, routerResponseMock);
    expect(partnerSsoHandlerMock).toBeCalledTimes(1);
    expect(partnerSsoHandler).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock,
      databaseMock,
      {} as JwksManager,
      twilioMock
    );
  });
});
