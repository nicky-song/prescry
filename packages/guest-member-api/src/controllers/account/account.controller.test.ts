// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { addRecoveryEmailHandler } from './handlers/add-recovery-email.handler';
import { updateRecoveryEmailHandler } from './handlers/update-recovery-email.handler';
import { AccountController } from './account.controller';
import { createAccountHandler } from './handlers/create-account.handler';
import { updateFavoritedPharmaciesHandler } from './handlers/update-favorited-pharmacies.handler';
import { updateFeatureKnownHandler } from './handlers/update-feature-known.handler';
import { getFavoritedPharmaciesHandler } from './handlers/get-favorited-pharmacies.handler';
import { updateLanguageCodeHandler } from './handlers/update-language-code.handler';
import { databaseMock } from '../../mock-data/database.mock';
import { configurationMock } from '../../mock-data/configuration.mock';
import { twilioMock } from '../../mock-data/twilio.mock';

jest.mock('./handlers/add-recovery-email.handler');
const addRecoveryEmailHandlerMock = addRecoveryEmailHandler as jest.Mock;

jest.mock('./handlers/update-recovery-email.handler');
const updateRecoveryEmailHandlerMock = updateRecoveryEmailHandler as jest.Mock;

jest.mock('./handlers/create-account.handler');
const createAccountHandlerMock = createAccountHandler as jest.Mock;

jest.mock('./handlers/update-favorited-pharmacies.handler');
const updateFavoritedPharmaciesHandlerMock =
  updateFavoritedPharmaciesHandler as jest.Mock;

jest.mock('./handlers/update-feature-known.handler');
const updateFeatureKnownHandlerMock = updateFeatureKnownHandler as jest.Mock;

jest.mock('../account/handlers/get-favorited-pharmacies.handler');
const getFavoritedPharmaciesHandlerMock =
  getFavoritedPharmaciesHandler as jest.Mock;

jest.mock('./handlers/update-language-code.handler');
const updateLanguageCodeHandlerMock = updateLanguageCodeHandler as jest.Mock;

const routerResponseMock = {} as Response;
const requestMock = {} as Request;

describe('AccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create controller object with route methods', () => {
    const accountController = new AccountController(
      configurationMock,
      databaseMock,
      twilioMock,
    );

    expect(accountController.addEmail).toBeDefined();
    expect(accountController.updateEmail).toBeDefined();
    expect(accountController.updateFavoritedPharmacies).toBeDefined();
  });

  it.each([['v1'], ['v2']])(
    'should call addRecoveryEmailHandler for addEmail route (version %p)',
    async () => {
      const routeHandler = new AccountController(
        configurationMock,
        databaseMock,
        twilioMock,
      ).addEmail;
      await routeHandler(requestMock, routerResponseMock);

      expect(addRecoveryEmailHandlerMock).toBeCalledTimes(1);
      expect(addRecoveryEmailHandlerMock).toHaveBeenNthCalledWith(
        1,
        requestMock,
        routerResponseMock,
        configurationMock,
      );
    }
  );

  it.each([['v1'], ['v2']])(
    'should call updateRecoveryEmailHandler for updateEmail route (version %p)',
    async () => {
      const routeHandler = new AccountController(
        configurationMock,
        databaseMock,
        twilioMock,
      ).updateEmail;
      await routeHandler(requestMock, routerResponseMock);

      expect(updateRecoveryEmailHandlerMock).toBeCalledTimes(1);
      expect(updateRecoveryEmailHandlerMock).toHaveBeenNthCalledWith(
        1,
        requestMock,
        routerResponseMock,
        configurationMock,
      );
    }
  );

  it.each([['v1'], ['v2']])(
    'should call createAccountHandler for createAccount route (version %p)',
    async () => {
      const routeHandler = new AccountController(
        configurationMock,
        databaseMock,
        twilioMock,
      ).createAccount;
      await routeHandler(requestMock, routerResponseMock);

      expect(createAccountHandlerMock).toBeCalledTimes(1);
      expect(createAccountHandlerMock).toHaveBeenNthCalledWith(
        1,
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );
    }
  );

  it.each([['v1'], ['v2']])(
    'should call updateFavoritedPharmaciesHandler handler for favoritedPharmacies route',
    async () => {
      const routeHandler = new AccountController(
        configurationMock,
        databaseMock,
        twilioMock,
      ).updateFavoritedPharmacies;
      await routeHandler(requestMock, routerResponseMock);

      expect(updateFavoritedPharmaciesHandlerMock).toBeCalledTimes(1);
      expect(updateFavoritedPharmaciesHandlerMock).toHaveBeenNthCalledWith(
        1,
        requestMock,
        routerResponseMock,
        configurationMock,
      );
    }
  );

  it('should call updateFeatureKnownHandler handler for updateFeatureKnown route', async () => {
    const routeHandler = new AccountController(
      configurationMock,
      databaseMock,
      twilioMock,
    ).updateFeatureKnown;
    await routeHandler(requestMock, routerResponseMock);

    expect(updateFeatureKnownHandlerMock).toBeCalledTimes(1);
    expect(updateFeatureKnownHandlerMock).toHaveBeenNthCalledWith(
      1,
      routerResponseMock
    );
  });

  it.each([['v1'], ['v2']])(
    'should call getFavoritedPharmacies handler for getFavoritedPharmacies route (version %p)',
    async () => {
      const routeHandler = new AccountController(
        configurationMock,
        databaseMock,
        twilioMock,
      ).getFavoritedPharmaciesList;

      await routeHandler(requestMock, routerResponseMock);

      expect(getFavoritedPharmaciesHandlerMock).toBeCalledTimes(1);
      expect(getFavoritedPharmaciesHandlerMock).toHaveBeenCalledWith(
        requestMock,
        routerResponseMock,
        configurationMock,
      );
    }
  );

  it.each([['v1'], ['v2']])(
    'should call updateLanguageCode handler for updateLanguageCode route (version %p)',
    async () => {
      const routeHandler = new AccountController(
        configurationMock,
        databaseMock,
        twilioMock,
      ).updateLanguageCode;

      await routeHandler(requestMock, routerResponseMock);

      expect(updateLanguageCodeHandlerMock).toBeCalledTimes(1);
      expect(updateLanguageCodeHandlerMock).toHaveBeenCalledWith(
        configurationMock,
        requestMock,
        routerResponseMock,
      );
    }
  );
});
