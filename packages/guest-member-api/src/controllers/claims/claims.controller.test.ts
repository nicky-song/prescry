// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ClaimsController } from './claims.controller';
import { getClaimsHandler } from './handlers/get-claims.handler';
import { getClaimsAccumulatorsHandler } from './handlers/get-claims-accumulators.handler';
import { configurationMock } from '../../mock-data/configuration.mock';

jest.mock('./handlers/get-claims-accumulators.handler');
const getClaimAccumulatorsHandlerMock =
  getClaimsAccumulatorsHandler as jest.Mock;

const responseMock = {} as Response;
const requestMock = {} as Request;

jest.mock('./handlers/get-claims.handler');
const getClaimsHandlerMock = getClaimsHandler as jest.Mock;

describe('ClaimsController', () => {
  it('should create controller object with route methods', () => {
    const claimsController = new ClaimsController(configurationMock);
    expect(claimsController.getClaims).toBeDefined();
    expect(claimsController.getClaimsAccumulators);
  });

  it('should call getClaims handler for getClaims Route', async () => {
    const routeHandler = new ClaimsController(configurationMock).getClaims;
    await routeHandler(requestMock, responseMock);
    expect(getClaimsHandlerMock).toBeCalledTimes(1);

    expect(getClaimsHandlerMock).toHaveBeenCalledWith(
      responseMock,
      configurationMock
    );
  });

  it('should call getClaimsAccumulatorsHandler handler for getClaimsAccumulators Route', async () => {
    const routeHandler = new ClaimsController(configurationMock)
      .getClaimsAccumulators;
    await routeHandler(requestMock, responseMock);
    expect(getClaimAccumulatorsHandlerMock).toBeCalledTimes(1);

    expect(getClaimAccumulatorsHandlerMock).toHaveBeenCalledWith(
      responseMock,
      configurationMock
    );
  });
});
