// Copyright 2021 Prescryptive Health, Inc.

import { setCurrentAppointmentsDispatch } from './set-current-appointments.dispatch';
import { IGetAppointmentsListAsyncActionArgs } from '../async-actions/get-appointments-list.async-action';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getAppointments } from '../../../api/api-v1.get-appointments';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { appointmentsListMock } from '../../../__mocks__/appointments-list.mock';
import { getAppointmentsListDispatch } from './get-appointments-list.dispatch';
import { mockAppointmentListDetails } from '../../../__mocks__/appointment-list-details.mock';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';

jest.mock('../../../api/api-v1.get-appointments');
const getAppointmentsMock = getAppointments as jest.Mock;

jest.mock('./set-current-appointments.dispatch');

jest.mock('../../../../../utils/retry-policies/get-endpoint.retry-policy');
const getEndpointRetryPolicyMock =
  getEndpointRetryPolicy as unknown as jest.Mock;

describe('getAppointmentsListDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes API request', async () => {
    const configMock = GuestExperienceConfig;
    const settingsMock: ISettings = {
      isDeviceRestricted: false,
      token: 'token',
      lastZipCode: '12345',
    };

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    getAppointmentsMock.mockReturnValueOnce({
      data: { appointmentsList: appointmentsListMock },
    });
    const argsMock: IGetAppointmentsListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      appointmentsListDispatch: jest.fn(),
      appointmentListDetails: mockAppointmentListDetails,
      navigation: appointmentsStackNavigationMock,
    };

    await getAppointmentsListDispatch(argsMock);

    expect(getAppointmentsMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      mockAppointmentListDetails,
      settingsMock.token,
      getEndpointRetryPolicyMock,
      undefined
    );
  });
  it('dispatches set appointments list', async () => {
    const configMock = GuestExperienceConfig;
    const settingsMock: ISettings = {
      isDeviceRestricted: false,
      token: 'token',
      lastZipCode: '12345',
    };

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    getAppointmentsMock.mockReturnValueOnce({
      data: {
        appointments: appointmentsListMock,
        refreshToken: 'mock-refresh-token',
      },
    });
    const appointmentsListMockDispatch = jest.fn();
    const argsMock: IGetAppointmentsListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      appointmentsListDispatch: appointmentsListMockDispatch,
      appointmentListDetails: mockAppointmentListDetails,
      navigation: appointmentsStackNavigationMock,
    };

    await getAppointmentsListDispatch(argsMock);

    expect(setCurrentAppointmentsDispatch).toHaveBeenCalledWith(
      appointmentsListMockDispatch,
      appointmentsListMock,
      0,
      'upcoming',
      5
    );
  });
});
