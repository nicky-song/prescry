// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { configurationMock } from '../../mock-data/configuration.mock';
import { databaseMock } from '../../mock-data/database.mock';
import { InviteCodeController } from './invite-code.controller';
import { processInviteCodeHandler } from './handlers/process-invite-code.handler';

jest.mock('./handlers/process-invite-code.handler');
const processInviteCodeHandlerMock = processInviteCodeHandler as jest.Mock;

describe('InviteCodeController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    processInviteCodeHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const inviteCodeController = new InviteCodeController(
      databaseMock,
      configurationMock
    );
    expect(inviteCodeController.getDetailsForInviteCode).toBeDefined();
  });

  it('should call processInviteCodeHandler handler for  getDetailsForInviteCode Route', async () => {
    const routeHandler = new InviteCodeController(
      databaseMock,
      configurationMock
    ).getDetailsForInviteCode;
    await routeHandler(requestMock, routerResponseMock);
    expect(processInviteCodeHandlerMock).toBeCalledTimes(1);

    expect(processInviteCodeHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
  });
});
