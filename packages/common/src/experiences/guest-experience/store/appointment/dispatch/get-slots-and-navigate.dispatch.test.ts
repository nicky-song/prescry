// Copyright 2020 Prescryptive Health, Inc.

import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';

import { getAvailabilityDispatch } from './get-availability.dispatch';
import { getSlotsAndNavigateDispatch } from './get-slots-and-navigate.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('./get-availability.dispatch');
const getAvailabilityDispatchMock = getAvailabilityDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';
const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
  appointment: {
    selectedLocation: {
      timezone: 'America/Los_Angeles',
      id: '1',
      serviceInfo: [{ serviceType: 'service-type' }],
    },
    selectedService: { serviceType: 'service-type' },
  },
};
const getStateMock = jest.fn();

describe('getSlotsAndNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('requests getAvailabilityDispatch using dates using minLeadTime from now and till end of the month and navigate to screen', async () => {
    const dispatchMock = jest.fn();

    await getSlotsAndNavigateDispatch(
      '2020-06-29T00:00:00',
      '2020-06-30T23:59:59',
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-06-29T00:00:00',
        end: '2020-06-30T23:59:59',
      }
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      {
        screen: 'Appointment',
        params: { showBackButton: true },
      }
    );
  });
  it('Navigate to  AppointmentsStack with showBackToHome if passed', async () => {
    const dispatchMock = jest.fn();

    await getSlotsAndNavigateDispatch(
      '2020-06-29T00:00:00',
      '2020-06-30T23:59:59',
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-06-29T00:00:00',
        end: '2020-06-30T23:59:59',
      }
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      {
        screen: 'Appointment',
        params: { showBackButton: true, showBackToHome: true },
      }
    );
  });
  it('requests getAvailabilityDispatch using dates for next month if next month is within 5 days and navigate to screen', async () => {
    const dispatchMock = jest.fn();
    await getSlotsAndNavigateDispatch(
      '2020-06-29T00:00:00',
      '2020-06-30T23:59:59',
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        locationId: '1',
        serviceType: 'service-type',
        start: '2020-06-29T00:00:00',
        end: '2020-06-30T23:59:59',
      }
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      {
        screen: 'Appointment',
        params: { showBackButton: true },
      }
    );
  });

  it('dispathes error action on failure', async () => {
    const errorMock = Error('Error in getting data!');
    getAvailabilityDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await getSlotsAndNavigateDispatch(
      '2020-06-29T00:00:00',
      '2020-06-30T23:59:59',
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();
  });
  it('dispatched no action if no location is selected', async () => {
    const dispatchMock = jest.fn();
    getStateMock.mockReturnValueOnce({ appointment: {} });
    await getSlotsAndNavigateDispatch(
      '2020-06-29T00:00:00',
      '2020-06-30T23:59:59',
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(getAvailabilityDispatchMock).not.toHaveBeenCalled();
  });
});
