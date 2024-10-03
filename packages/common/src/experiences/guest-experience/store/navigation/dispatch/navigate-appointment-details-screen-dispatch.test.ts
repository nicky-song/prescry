// Copyright 2020 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigateAppointmentDetailsScreenDispatch } from './navigate-appointment-details-screen-dispatch';

describe('navigateAppointmentDetailsScreenDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call navigation.navigate to navigate to Appointment confirmation screen', () => {
    navigateAppointmentDetailsScreenDispatch(rootStackNavigationMock, '1234');
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'AppointmentsStack',
      {
        screen: 'AppointmentConfirmation',
        params: {
          appointmentId: '1234',
          showBackButton: true,
        },
      }
    );
  });

  it('should hide showBackButton when showButton props set to false', () => {
    navigateAppointmentDetailsScreenDispatch(
      rootStackNavigationMock,
      '1234',
      false,
      'status'
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'AppointmentsStack',
      {
        screen: 'AppointmentConfirmation',
        params: {
          appointmentId: '1234',
          showBackButton: false,
          appointmentStatus: 'status',
        },
      }
    );
  });

  it('should pass appointmentLink when props have it', () => {
    navigateAppointmentDetailsScreenDispatch(
      rootStackNavigationMock,
      '1234',
      false,
      'status',
      'appointmentlink'
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'AppointmentsStack',
      {
        screen: 'AppointmentConfirmation',
        params: {
          appointmentId: '1234',
          showBackButton: false,
          appointmentStatus: 'status',
          appointmentLink: 'appointmentlink'
        },
      }
    );
  });

  it('should pass backToHome when props have it', () => {
    navigateAppointmentDetailsScreenDispatch(
      rootStackNavigationMock,
      '1234',
      false,
      'status',
      'appointmentlink',
      true
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'AppointmentsStack',
      {
        screen: 'AppointmentConfirmation',
        params: {
          appointmentId: '1234',
          showBackButton: false,
          appointmentStatus: 'status',
          appointmentLink: 'appointmentlink',
          backToHome: true
        },
      }
    );
  });
});
