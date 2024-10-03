// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getClaimAlertHandler } from './handlers/get-claim-alert.handler';

import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { ClaimAlertController } from './claim-alert.controller';
import { configurationMock } from '../../mock-data/configuration.mock';

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('./handlers/get-claim-alert.handler');
const getClaimAlertHandlerMock = getClaimAlertHandler as jest.Mock;

describe('claimAlertController', () => {
  const databaseMock = {
    Models: {},
  } as unknown as IDatabase;
  beforeEach(() => {
    getClaimAlertHandlerMock.mockReset();
  });
  it('should create controller object with route methods', () => {
    expect.assertions(1);

    const claimAlertController = new ClaimAlertController(
      databaseMock,
      configurationMock
    );

    expect(claimAlertController.getClaimAlert).toBeDefined();
  });

  it('should call getClaimAlert handler for getClaimAlert Route', async () => {
    const routerResponseMock = {} as Response;
    const requestMock = {} as Request;
    const routeHandler = new ClaimAlertController(
      databaseMock,
      configurationMock
    ).getClaimAlert;

    await routeHandler(requestMock, routerResponseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      getClaimAlertHandlerMock,
      requestMock,
      routerResponseMock,
      databaseMock
    );
  });
});
