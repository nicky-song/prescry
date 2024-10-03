// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getImmunizationRecordHandler } from './handlers/get-immunization-record.handler';

import { ImmunizationRecordController } from './immunization-record.controller';
import { configurationMock } from '../../mock-data/configuration.mock';
import { databaseMock } from '../../mock-data/database.mock';

jest.mock('./handlers/get-immunization-record.handler');
const getImmunizationRecordHandlerMock =
  getImmunizationRecordHandler as jest.Mock;

describe('ImmunizationRecordController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    getImmunizationRecordHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const immunizationController = new ImmunizationRecordController(
      databaseMock,
      configurationMock
    );
    expect(
      immunizationController.getImmunizationRecordForOrderNumber
    ).toBeDefined();
  });

  it('should call getImmunizationRecordHandler for immunization Route', async () => {
    const routeHandler = new ImmunizationRecordController(
      databaseMock,
      configurationMock
    ).getImmunizationRecordForOrderNumber;
    await routeHandler(requestMock, routerResponseMock);
    expect(getImmunizationRecordHandlerMock).toBeCalledTimes(1);

    expect(getImmunizationRecordHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
  });
});
