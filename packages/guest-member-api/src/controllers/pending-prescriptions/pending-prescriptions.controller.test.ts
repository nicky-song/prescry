// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { PendingPrescriptionsController } from './pending-prescriptions.controller';
import { getPendingPrescriptionsHandler } from './handlers/get-pending-prescriptions.handler';
import { databaseMock } from '../../mock-data/database.mock';

jest.mock('./handlers/get-pending-prescriptions.handler');
const getPendingPrescriptionHandlerMock =
  getPendingPrescriptionsHandler as jest.Mock;

describe('PendingPrescriptionsController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    getPendingPrescriptionHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const pendingPrescriptionsController = new PendingPrescriptionsController(
      databaseMock
    );
    expect(pendingPrescriptionsController.getPendingPrescription).toBeDefined();
  });
  it('should call getPendingPrescriptionHandler handler for getPendingPrescription Route', async () => {
    const routeHandler = new PendingPrescriptionsController(databaseMock)
      .getPendingPrescription;
    await routeHandler(requestMock, routerResponseMock);
    expect(getPendingPrescriptionHandlerMock).toBeCalledTimes(1);

    expect(getPendingPrescriptionHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock
    );
  });
});
