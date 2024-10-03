// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { registerSmartPriceHandler } from './handlers/register-smart-price.handler';
import { SmartPriceController } from './smart-price.controller';
import { getSmartPriceUserMembershipHandler } from './handlers/get-smart-price-user-membership.handler';
import { isRegisteredUserHandler } from './handlers/is-registered-user.handler';
import { appRegisterSmartPriceHandler } from './handlers/app-register-smart-price.handler';
import { configurationMock } from '../../mock-data/configuration.mock';
import { databaseMock } from '../../mock-data/database.mock';
import { twilioMock } from '../../mock-data/twilio.mock';

jest.mock('./handlers/register-smart-price.handler');
const registerSmartPriceHandlerMock = registerSmartPriceHandler as jest.Mock;

jest.mock('./handlers/get-smart-price-user-membership.handler');
const getSmartPriceUserMembershipHandlerMock =
  getSmartPriceUserMembershipHandler as jest.Mock;

jest.mock('./handlers/is-registered-user.handler');
const isRegisteredUserHandlerMock = isRegisteredUserHandler as jest.Mock;

jest.mock('./handlers/app-register-smart-price.handler');
const appRegisterSmartPriceHandlerMock =
  appRegisterSmartPriceHandler as jest.Mock;

describe('SmartPriceController', () => {
  const responseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    registerSmartPriceHandlerMock.mockReset();
    getSmartPriceUserMembershipHandlerMock.mockReset();
    isRegisteredUserHandlerMock.mockReset();
    appRegisterSmartPriceHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const smartPriceController = new SmartPriceController(
      configurationMock,
      databaseMock,
      twilioMock
    );
    expect(smartPriceController.register).toBeDefined();
  });

  it('should call registerSmartPriceHandler handler for register Route', async () => {
    const routeHandler = new SmartPriceController(
      configurationMock,
      databaseMock,
      twilioMock
    ).register;
    await routeHandler(requestMock, responseMock);
    expect(registerSmartPriceHandlerMock).toBeCalledTimes(1);

    expect(registerSmartPriceHandlerMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock
    );
  });

  it('should call isRegisteredUserHandler handler for isSmartPriceUser Route', async () => {
    const routeHandler = new SmartPriceController(
      configurationMock,
      databaseMock,
      twilioMock
    ).isSmartPriceUser;
    await routeHandler(requestMock, responseMock);
    expect(isRegisteredUserHandlerMock).toBeCalledTimes(1);

    expect(isRegisteredUserHandlerMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      databaseMock
    );
  });

  it('should call getSmartPriceUserMembershiphandler for getSmartPriceUserMembership  Route', async () => {
    const routeHandler = new SmartPriceController(
      configurationMock,
      databaseMock,
      twilioMock
    ).getSmartPriceUserMembership;
    await routeHandler(requestMock, responseMock);
    expect(getSmartPriceUserMembershipHandlerMock).toBeCalledTimes(1);
    expect(getSmartPriceUserMembershipHandlerMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      databaseMock
    );
  });

  it('should call appRegisterSmartPriceHandler for appRegister Route', async () => {
    const routeHandler = new SmartPriceController(
      configurationMock,
      databaseMock,
      twilioMock
    ).appRegister;
    await routeHandler(requestMock, responseMock);
    expect(appRegisterSmartPriceHandlerMock).toBeCalledTimes(1);
    expect(appRegisterSmartPriceHandlerMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock
    );
  });
});
