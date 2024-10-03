// Copyright 2020 Prescryptive Health, Inc.

import { setCurrentMonthAsyncAction } from './set-current-month.async-action';
import { getAvailabilityDispatch } from '../dispatch/get-availability.dispatch';
import { setCalendarMonthAction } from '../actions/set-calendar-month.action';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';

jest.mock('../dispatch/get-availability.dispatch');
const getAvailabilityDispatchMock = getAvailabilityDispatch as jest.Mock;

jest.mock('../actions/set-calendar-month.action');
const setCalendarMonthActionMock = setCalendarMonthAction as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const getStateMock = jest.fn();
const defaultStateMock = {
  appointment: {
    selectedLocation: {
      id: '1',
      providerName: 'Bartell Drugs',
      locationName: 'Bartell Drugs',
      address1: '7370 170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
      phoneNumber: '(425) 977-5489',
      serviceInfo: [
        {
          serviceName: 'test-service',
          screenDescription: 'Test Desc',
          screenTitle: 'Test Title',
          confirmationDescription: 'conf',
          confirmationTitle: 'conf-title',
          questions: [],
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
        },
      ],
      timezone: 'America/Los_Angeles',
      regionName: 'Eastern Washington',
    },
    selectedService: {
      serviceName: 'test-service',
      screenDescription: 'Test Desc',
      screenTitle: 'Test Title',
      confirmationDescription: 'conf',
      confirmationTitle: 'conf-title',
      questions: [],
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    },
  },
};

describe('setCurrentMonthAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls getAvailabilityDispatch using location, setCalendarMonthAction', async () => {
    const dispatchMock = jest.fn();
    const dateMock = '2020-11-01';
    const args = {
      navigation: appointmentsStackNavigationMock,
      date: dateMock,
    };
    const asyncAction = setCurrentMonthAsyncAction(args);
    await asyncAction(dispatchMock, getStateMock);
    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        start: '2020-11-01T00:00:00-07:00',
        end: '2020-11-30T23:59:59-08:00',
        locationId: '1',
      }
    );
    expect(setCalendarMonthActionMock).toHaveBeenCalledWith(
      '2020-11-01T00:00:00-07:00'
    );
  });

  it('if no location is selected, getAvailabilityDispatch is not dispatched', async () => {
    const dispatchMock = jest.fn();
    getStateMock.mockReturnValueOnce({ appointment: {} });
    const dateMock = '2020-11-01';
    const args = {
      navigation: appointmentsStackNavigationMock,
      date: dateMock,
    };
    const asyncAction = setCurrentMonthAsyncAction(args);
    await asyncAction(dispatchMock, getStateMock);
    expect(getAvailabilityDispatchMock).not.toHaveBeenCalled();
    expect(setCalendarMonthActionMock).toHaveBeenCalledWith(
      '2020-11-01T00:00:00-07:00'
    );
  });

  it('Dispatches error action when there is exception in getAvailabilityDispatch', async () => {
    const errorRefreshMock = new Error('Error refreshing availability!');

    getAvailabilityDispatchMock.mockImplementation(() => {
      throw errorRefreshMock;
    });
    const dispatchMock = jest.fn();

    const dateMock = '2020-11-01';
    const args = {
      navigation: appointmentsStackNavigationMock,
      date: dateMock,
    };
    const asyncAction = setCurrentMonthAsyncAction(args);
    await asyncAction(dispatchMock, getStateMock);
    expect(getAvailabilityDispatchMock).toHaveBeenCalled();
    expect(getAvailabilityDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      {
        start: '2020-11-01T00:00:00-07:00',
        end: '2020-11-30T23:59:59-08:00',
        locationId: '1',
      }
    );
    expect(setCalendarMonthActionMock).not.toHaveBeenCalled();
    expect(handlePostLoginApiErrorsActionMock).toBeCalled();
    expect(handlePostLoginApiErrorsActionMock).toBeCalledWith(
      errorRefreshMock,
      dispatchMock,
      appointmentsStackNavigationMock
    );
  });
});
