// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { cancelBookingHandler } from './handlers/cancel-booking.handler';
import { createAppointmentHandler } from './handlers/create-appointment.handler';
import { getLocationByIdentifierHandler } from './handlers/get-location-by-identifier.handler';
import { getProviderLocationsHandler } from './handlers/get-provider-locations.handler';
import { lockSlotHandler } from './handlers/lock-slot.handler';
import { unlockSlotHandler } from './handlers/unlock-slot.handler';
import { ProviderLocationController } from './provider-location.controller';
import { getStaffAvailabilityHandler } from './handlers/get-staff-availability.handler';
import { EndpointVersion } from '../../models/endpoint-version';
import { createAppointmentHandlerV2 } from './handlers/create-appointment-v2.handler';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('./handlers/get-provider-locations.handler');
jest.mock('./handlers/get-staff-availability.handler');
jest.mock('./handlers/cancel-booking.handler');
jest.mock('./handlers/lock-slot.handler');
jest.mock('./handlers/unlock-slot.handler');
jest.mock('./handlers/get-location-by-identifier.handler');
jest.mock('./handlers/create-appointment.handler');
jest.mock('./handlers/create-appointment-v2.handler');

const routerResponseMock = {} as Response;
const requestMock = {} as Request;

const getProviderLocationsHandlerMock =
  getProviderLocationsHandler as jest.Mock;
const getLocationByIdentifierHandlerMock =
  getLocationByIdentifierHandler as jest.Mock;
const getStaffAvailabilityHandlerMock =
  getStaffAvailabilityHandler as jest.Mock;
const cancelBookingHandlerMock = cancelBookingHandler as jest.Mock;
const createAppointmentHandlerMock = createAppointmentHandler as jest.Mock;
const createAppointmentHandlerV2Mock = createAppointmentHandlerV2 as jest.Mock;

const lockSlotHandlerMock = lockSlotHandler as jest.Mock;
const unlockSlotHandlerMock = unlockSlotHandler as jest.Mock;

const databaseMock = {
  Models: {},
} as unknown as IDatabase;

const configurationMock = {
  cancelAppointmentWindowExpiryTimeInHours: 6,
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'pharmacy-url',
} as IConfiguration;

const v1: EndpointVersion = 'v1';
const v2: EndpointVersion = 'v2';
const requestV2Mock = {
  headers: {
    [RequestHeaders.apiVersion]: v2,
  },
} as Request;

describe('provider-location.controller', () => {
  beforeEach(() => {
    getProviderLocationsHandlerMock.mockReset();
    getStaffAvailabilityHandlerMock.mockReset();
    cancelBookingHandlerMock.mockReset();
    createAppointmentHandlerMock.mockReset();
    createAppointmentHandlerV2Mock.mockReset();
    lockSlotHandlerMock.mockReset();
    unlockSlotHandlerMock.mockReset();
  });

  it('should create controller object with route methods', () => {
    const providerLocationController = new ProviderLocationController(
      databaseMock,
      configurationMock,
    );
    expect(providerLocationController.getProviderLocations).toBeDefined();
    expect(providerLocationController.getLocationByIdentifier).toBeDefined();
    expect(providerLocationController.getStaffAvailability).toBeDefined();
    expect(providerLocationController.createBooking).toBeDefined();
    expect(providerLocationController.cancelBooking).toBeDefined();
  });

  it('should call getProviderLocationsHandler handler for  getProviderLocations Route', async () => {
    const routeHandler = new ProviderLocationController(
      databaseMock,
      configurationMock,
    ).getProviderLocations;
    await routeHandler(requestMock, routerResponseMock);
    expect(getProviderLocationsHandlerMock).toBeCalledTimes(1);

    expect(getProviderLocationsHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });

  it('should call getLocationByIdentifierHandler handler for getLocationByIdentifier Route', async () => {
    const routeHandler = new ProviderLocationController(
      databaseMock,
      configurationMock,
    ).getLocationByIdentifier;
    await routeHandler(requestMock, routerResponseMock);
    expect(getLocationByIdentifierHandlerMock).toBeCalledTimes(1);

    expect(getLocationByIdentifierHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
  it('should call getStaffAvailability handler for getStaffAvailability Route', async () => {
    const routeHandler = new ProviderLocationController(
      databaseMock,
      configurationMock,
    ).getStaffAvailability;
    await routeHandler(requestMock, routerResponseMock);
    expect(getStaffAvailabilityHandlerMock).toBeCalledTimes(1);

    expect(getStaffAvailabilityHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
  it.each([[v1], [v2]])(
    'should call createBooking handler for createBooking Route (endpoint version %p)',
    async (versionMock: EndpointVersion) => {
      const routeHandler = new ProviderLocationController(
        databaseMock,
        configurationMock,
      ).createBooking;
      const mockRequest = versionMock === v1 ? requestMock : requestV2Mock;
      await routeHandler(mockRequest, routerResponseMock);

      if (versionMock === 'v2') {
        expect(createAppointmentHandlerV2).toBeCalledTimes(1);

        expect(createAppointmentHandlerV2).toHaveBeenCalledWith(
          mockRequest,
          routerResponseMock,
          databaseMock,
          configurationMock
        );
      } else {
        expect(createAppointmentHandler).toBeCalledTimes(1);

        expect(createAppointmentHandler).toHaveBeenCalledWith(
          mockRequest,
          routerResponseMock,
          databaseMock,
          configurationMock
        );
      }
    }
  );
  it('should call cancelBooking handler for cancelBooking Route', async () => {
    const routeHandler = new ProviderLocationController(
      databaseMock,
      configurationMock,
    ).cancelBooking;
    await routeHandler(requestMock, routerResponseMock);
    expect(cancelBookingHandlerMock).toBeCalledTimes(1);

    expect(cancelBookingHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
  });
  it('should call lock slot handler for lockSlot route', async () => {
    const routeHandler = new ProviderLocationController(
      databaseMock,
      configurationMock,
    ).lockSlot;
    await routeHandler(requestMock, routerResponseMock);
    expect(lockSlotHandlerMock).toBeCalledTimes(1);

    expect(lockSlotHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
  it('should call unlock slot handler for unlockSlot route', async () => {
    const routeHandler = new ProviderLocationController(
      databaseMock,
      configurationMock,
    ).unlockSlot;
    await routeHandler(requestMock, routerResponseMock);
    expect(unlockSlotHandlerMock).toBeCalledTimes(1);

    expect(unlockSlotHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
});
