// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentItem } from '../../../../../models/api-response/appointment.response';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getAppointmentDetails } from '../../../api/api-v1.get-appointment-details';
import { getAppointmentDetailsResponseAction } from '../actions/get-appointment-details-response.action';
import { getAppointmentDetailsDispatch } from './get-appointment-details.dispatch';

jest.mock('../../../api/api-v1.get-appointment-details', () => ({
  getAppointmentDetails: jest
    .fn()
    .mockResolvedValue({ data: { appointment: {} } }),
}));
const getAppointmentDetailsMock = getAppointmentDetails as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const defaultStateMock = {
  config: {
    apis: {},
  },
  features: {},
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();

describe('getAppointmentDetailsDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls getAppointmentDetails API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await getAppointmentDetailsDispatch(dispatchMock, getStateMock, '1234');

    expect(getAppointmentDetailsMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      '1234',
      authTokenMock,
      getEndpointRetryPolicy,
      deviceTokenMock
    );
  });

  it('dispatches getAppointmentDetailsResponseAction', async () => {
    const mockResponse = {
      additionalInfo: 'Patient must wear mask or face covering',
      address1: '7807 219th ST SW',
      city: 'Yakima',
      locationName: 'Rx Pharmacy',
      orderNumber: '1419',
      serviceName: 'COVID-19 Antigen Testing',
      state: 'WA',
      status: 'Accepted',
      zip: '98056',
      date: 'date',
      time: 'time',
    } as IAppointmentItem;

    const getAppointmentDetailsResponseMock = {
      data: {
        appointment: mockResponse,
      },
      message: 'all good',
      status: 'ok',
    };
    getAppointmentDetailsMock.mockResolvedValue(
      getAppointmentDetailsResponseMock
    );

    const dispatchMock = jest.fn();
    await getAppointmentDetailsDispatch(dispatchMock, getStateMock, '1234');

    const responseAction = getAppointmentDetailsResponseAction(mockResponse);
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);
  });
});
