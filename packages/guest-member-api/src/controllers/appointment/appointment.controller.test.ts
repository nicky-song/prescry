// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getAppointmentHandler } from './handlers/get-appointment.handler';
import { getAllAppointmentsHandler } from './handlers/get-all-appointments.handler';
import { AppointmentController } from './appointment.controller';
import { configurationMock } from '../../mock-data/configuration.mock';
import { databaseMock } from '../../mock-data/database.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('./handlers/get-appointment.handler');
const getAppointmentHandlerMock = getAppointmentHandler as jest.Mock;

jest.mock('./handlers/get-all-appointments.handler');
const getAllAppointmentsHandlerMock = getAllAppointmentsHandler as jest.Mock;

describe('AppointmentController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;
  const requestV2Mock = {
    headers: {
      [RequestHeaders.apiVersion]: 'v2',
    }
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getAllAppointmentsHandler handler for getAppointments Route', async () => {
    const routeHandler = new AppointmentController(
      databaseMock,
      configurationMock,
    ).getAppointments;

    await routeHandler(requestMock, routerResponseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      getAllAppointmentsHandlerMock,
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
  });

  it('should call getAppointmentHandler handler for getAppointment Route', async () => {
    const routeHandler = new AppointmentController(
      databaseMock,
      configurationMock,
    ).getAppointmentForOrderNumber;

    await routeHandler(requestV2Mock, routerResponseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      getAppointmentHandlerMock,
      requestV2Mock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
  });
});
