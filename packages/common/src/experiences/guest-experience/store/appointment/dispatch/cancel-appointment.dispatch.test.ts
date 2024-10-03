// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { ICancelBookingRequestBody } from '../../../../../models/api-request-body/cancel-booking.request-body';
import { IAppointmentItem } from '../../../../../models/api-response/appointment.response';
import { cancelBooking } from '../../../api/api-v1.cancel-booking';
import { getAppointmentDetails } from '../../../api/api-v1.get-appointment-details';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { getAppointmentDetailsResponseAction } from '../actions/get-appointment-details-response.action';
import { cancelAppointmentAndDispatch } from './cancel-appointment.dispatch';

jest.mock('../../../api/api-v1.cancel-booking');
const cancelBookingMock = cancelBooking as jest.Mock;

jest.mock('../../../api/api-v1.get-appointment-details', () => ({
  getAppointmentDetails: jest
    .fn()
    .mockResolvedValue({ data: { appointment: {} } }),
}));
const getAppointmentDetailsMock = getAppointmentDetails as jest.Mock;

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const deviceTokenMock = 'device_token';
const authTokenMock = 'auth_token';

const defaultStateMock = {
  config: {
    apis: {},
    payments: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
    dataRefreshIntervalMilliseconds: 5,
  },
};

const guestExperienceApiMock = 'guestExperienceApiMock';
const getStateMock = jest.fn();
const orderNumber = '1234';
const cancelBookingRequestBodyMock = {
  orderNumber: '1234',
} as ICancelBookingRequestBody;

const appointmentCancelled = {
  serviceName: 'COVID-19 AntiBody Test',
  bookingStatus: 'Cancelled',
  orderNumber: '1234567',
  date: 'date',
  time: 'time',
} as unknown as IAppointmentItem;

const appointmentAccepted = {
  serviceName: 'COVID-19 AntiBody Test',
  bookingStatus: 'Accepted',
  orderNumber: '1234567',
  date: 'date',
  time: 'time',
} as unknown as IAppointmentItem;

const appointmentDetails = (appointment: IAppointmentItem) => {
  const details = {
    data: {
      appointment,
    },
  };
  return details;
};

function generateStateMock() {
  const stateMock = {
    ...defaultStateMock,
    config: {
      ...defaultStateMock.config,
      apis: {
        ...defaultStateMock.config.apis,
        guestExperienceApi: guestExperienceApiMock,
      },
    },
  };
  return stateMock;
}

describe('cancelAppointmentAndNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls cancelBooking API with expected arguments', async () => {
    const stateMock = generateStateMock();
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const cancelBookingResponseMock = {
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    cancelBookingMock.mockResolvedValueOnce(cancelBookingResponseMock);
    getAppointmentDetailsMock.mockResolvedValue(
      appointmentDetails(appointmentCancelled)
    );

    await cancelAppointmentAndDispatch(
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      orderNumber
    );

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      cancelBookingResponseMock.refreshToken
    );

    expect(cancelBookingMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      cancelBookingRequestBodyMock,
      authTokenMock,
      deviceTokenMock
    );

    expect(getAppointmentDetailsMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      orderNumber,
      authTokenMock,
      undefined,
      deviceTokenMock
    );

    const responseAction = getAppointmentDetailsResponseAction(
      appointmentCancelled,
      true
    );

    expect(dispatchMock).toHaveBeenCalledWith(responseAction);
  });

  it('should call handlePostlLoginApiErrorActionMock when ErrorApiResponse is thrown', async () => {
    const stateMock = generateStateMock();
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const errorMock = new ErrorApiResponse('BOOM');
    cancelBookingMock.mockImplementation(() => {
      throw errorMock;
    });

    await cancelAppointmentAndDispatch(
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      orderNumber
    );
    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalled();

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      appointmentsStackNavigationMock
    );
  });

  it('should retry calling appointment API when appointmentDetails returns Accepted bookingStatus until Cancelled', async () => {
    const stateMock = generateStateMock();
    getStateMock.mockReturnValue(stateMock);
    const dispatchMock = jest.fn();
    const cancelBookingResponseMock = {
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    cancelBookingMock.mockResolvedValueOnce(cancelBookingResponseMock);
    getAppointmentDetailsMock
      .mockResolvedValueOnce(appointmentDetails(appointmentAccepted))
      .mockResolvedValue(appointmentDetails(appointmentCancelled));

    await cancelAppointmentAndDispatch(
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      orderNumber
    );
    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      cancelBookingResponseMock.refreshToken
    );

    expect(cancelBookingMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      cancelBookingRequestBodyMock,
      authTokenMock,
      deviceTokenMock
    );

    expect(getAppointmentDetailsMock).toHaveBeenNthCalledWith(
      1,
      guestExperienceApiMock,
      orderNumber,
      authTokenMock,
      undefined,
      deviceTokenMock
    );
    expect(getAppointmentDetailsMock).toHaveBeenNthCalledWith(
      2,
      guestExperienceApiMock,
      orderNumber,
      authTokenMock,
      undefined,
      deviceTokenMock
    );
    expect(getAppointmentDetailsMock).toHaveBeenCalledTimes(2);

    const responseAction = getAppointmentDetailsResponseAction(
      appointmentCancelled,
      true
    );

    expect(dispatchMock).toHaveBeenCalledWith(responseAction);
  });

  it('should retry calling appointment API when appointmentDetails returns Accepted bookingStatus until Cancelled', async () => {
    const stateMock = generateStateMock();
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const cancelBookingResponseMock = {
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };

    cancelBookingMock.mockResolvedValueOnce(cancelBookingResponseMock);
    getAppointmentDetailsMock.mockResolvedValue(
      appointmentDetails(appointmentAccepted)
    );

    await cancelAppointmentAndDispatch(
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      orderNumber
    );

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      cancelBookingResponseMock.refreshToken
    );

    expect(cancelBookingMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      cancelBookingRequestBodyMock,
      authTokenMock,
      deviceTokenMock
    );
    expect(getAppointmentDetailsMock).toHaveBeenCalledTimes(12);

    const responseAction = getAppointmentDetailsResponseAction(
      appointmentAccepted,
      false
    );

    expect(dispatchMock).toHaveBeenCalledWith(responseAction);
  });
});
