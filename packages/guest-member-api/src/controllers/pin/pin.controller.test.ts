// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { addPinHandler } from './handlers/add-pin.handler';
import { verifyPinHandler } from './handlers/verify-pin.handler';
import { updatePinHandler } from './handlers/update-pin.handler';

import { PinController } from './pin.controller';
import { EndpointVersion } from '../../models/endpoint-version';
import { addPinHandlerV2 } from './handlers/add-pin-v2.handler';
import { configurationMock } from '../../mock-data/configuration.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { databaseMock } from '../../mock-data/database.mock';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('./handlers/add-pin.handler');
const addPinHandlerMock = addPinHandler as jest.Mock;

jest.mock('./handlers/add-pin-v2.handler');
const addPinHandlerV2Mock = addPinHandlerV2 as jest.Mock;

jest.mock('./handlers/verify-pin.handler');
const verifyPinHandlerMock = verifyPinHandler as jest.Mock;

jest.mock('./handlers/update-pin.handler');
const updatePinHandlerMock = updatePinHandler as jest.Mock;

describe('PinController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  const v1: EndpointVersion = 'v1';
  const v2: EndpointVersion = 'v2';

  const requestV2Mock = {
    ...requestMock,
    headers: {
      [RequestHeaders.apiVersion]: v2,
    },
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('constructs controller', () => {
    const pinController = new PinController(
      configurationMock,
      databaseMock,
    );

    expect(pinController).toBeDefined();
  });

  it.each([[v1], [v2]])(
    'calls addPinHandler for addPin Route version %p',
    async (endpointVersionMock: EndpointVersion) => {
      const routeHandler = new PinController(
        configurationMock,
        databaseMock,
      ).addPin;

      const mockRequest = endpointVersionMock === v1 ? requestMock : requestV2Mock;

      await routeHandler(mockRequest, routerResponseMock);

      if (endpointVersionMock === 'v2') {
        expectToHaveBeenCalledOnceOnlyWith(
          addPinHandlerV2Mock,
          mockRequest,
          routerResponseMock,
          configurationMock
        );
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          addPinHandlerMock,
          mockRequest,
          routerResponseMock,
          databaseMock,
          configurationMock
        );
      }
    }
  );

  it.each([[v1], [v2]])(
    'calls verifyPinHandler for verifyPin Route for version %p',
    async (endpointVersionMock: EndpointVersion) => {
      const routeHandler = new PinController(
        configurationMock,
        databaseMock,
      ).verifyPin;
      const mockRequest = endpointVersionMock === v1 ? requestMock : requestV2Mock;

      await routeHandler(mockRequest, routerResponseMock);

      expectToHaveBeenCalledOnceOnlyWith(
        verifyPinHandlerMock,
        mockRequest,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
    }
  );

  it.each([[v1], [v2]])(
    'should call updatePinHandler for updatePin Route (version %p)',
    async (versionMock: EndpointVersion) => {
      const routeHandler = new PinController(
        configurationMock,
        databaseMock,
      ).updatePin;
      const mockRequest = versionMock === v1 ? requestMock : requestV2Mock;

      await routeHandler(mockRequest, routerResponseMock);

      expectToHaveBeenCalledOnceOnlyWith(
        updatePinHandlerMock,
        mockRequest,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
    }
  );
});
