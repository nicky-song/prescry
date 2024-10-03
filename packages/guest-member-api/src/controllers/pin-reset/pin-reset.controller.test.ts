// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { pinResetHandler } from './handlers/pin-reset.handler';
import { sendVerificationCodeHandler } from './handlers/send-verification-code.handler';
import { verifyIdentityHandler } from './handlers/verify-identity.handler';
import { PinResetController } from './pin-reset.controller';
import { configurationMock } from '../../mock-data/configuration.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { databaseMock } from '../../mock-data/database.mock';
import { twilioMock } from '../../mock-data/twilio.mock';

jest.mock('./handlers/pin-reset.handler');
const resetPinHandlerMock = pinResetHandler as jest.Mock;

jest.mock('./handlers/send-verification-code.handler');
const sendVerificationCodeHandlerMock =
  sendVerificationCodeHandler as jest.Mock;

jest.mock('./handlers/verify-identity.handler');
const verifyIdentityHandlerMock = verifyIdentityHandler as jest.Mock;

describe('PinResetController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    resetPinHandlerMock.mockReset();
    sendVerificationCodeHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const pinResetController = new PinResetController(
      configurationMock,
      databaseMock,
      twilioMock,
    );
    expect(pinResetController.sendVerificationCode).toBeDefined();
    expect(pinResetController.resetPin).toBeDefined();
  });

  it('should call sendVerificationCodeHandler handler for sendVerificationCode Route', async () => {
    const routeHandler = new PinResetController(
      configurationMock,
      databaseMock,
      twilioMock,
    ).sendVerificationCode;
    await routeHandler(requestMock, routerResponseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      sendVerificationCodeHandlerMock,
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );
  });

  it('should call resetPinHandler handler for resetPin Route', async () => {
    const routeHandler = new PinResetController(
      configurationMock,
      databaseMock,
      twilioMock,
    ).resetPin;

    await routeHandler(requestMock, routerResponseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      resetPinHandlerMock,
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );
  });

  it('should call verifyIdentityHandler handler for resetPin Route', async () => {
    const routeHandler = new PinResetController(
      configurationMock,
      databaseMock,
      twilioMock,
    ).verifyIdentity;
    await routeHandler(requestMock, routerResponseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      verifyIdentityHandlerMock,
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
  });
});
