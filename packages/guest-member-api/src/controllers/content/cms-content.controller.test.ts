// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { configurationMock } from '../../mock-data/configuration.mock';
import { CMSContentController } from './cms-content.controller';
import { getCMSContentHandler } from './handlers/get-cms-content.handler';

jest.mock('./handlers/get-cms-content.handler');
const getCMSContentHandlerMock = getCMSContentHandler as jest.Mock;

describe('CMSContentController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    getCMSContentHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const cmsContentController = new CMSContentController(configurationMock);
    expect(cmsContentController.getCMSContent).toBeDefined();
  });

  it('should call getCMSContentHandler handler for getCMSContent Route', async () => {
    const routeHandler = new CMSContentController(configurationMock)
      .getCMSContent;
    await routeHandler(requestMock, routerResponseMock);
    expect(getCMSContentHandlerMock).toBeCalledTimes(1);

    expect(getCMSContentHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
});
