// Copyright 2020 Prescryptive Health, Inc.

import { cancelBookingDispatch } from './cancel-booking.dispatch';
import { cancelBooking } from '../../../api/api-v1.cancel-booking';
import { ICancelBookingRequestBody } from '../../../../../models/api-request-body/cancel-booking.request-body';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../api/api-v1.cancel-booking');

jest.mock('../../settings/dispatch/token-update.dispatch', () => ({
  tokenUpdateDispatch: jest.fn(),
}));
jest.mock(
  '../../navigation/dispatch/navigate-post-login-error.dispatch',
  () => ({
    handlePostLoginApiErrorsAction: jest.fn(),
  })
);

const cancelBookingMock = cancelBooking as jest.Mock;
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const defaultStateMock = {
  config: {
    apis: {},
    payments: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();

const cancelBookingRequestBodyMock = {
  orderNumber: '1234',
} as ICancelBookingRequestBody;

beforeEach(() => {
  getStateMock.mockReset();
  getStateMock.mockReturnValue(defaultStateMock);
});

describe('cancelBookingDispatch', () => {
  it('calls cancelBooking API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

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

    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const cancelBookingResponseMock = {
      message: 'all good',
      status: 'ok',
      refreshToken: '123456',
    };
    cancelBookingMock.mockResolvedValueOnce(cancelBookingResponseMock);

    await cancelBookingDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '1234'
    );

    expect(cancelBookingMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      cancelBookingRequestBodyMock,
      authTokenMock,
      deviceTokenMock
    );
    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      cancelBookingResponseMock.refreshToken
    );
  });
  it('should call handlePostLoginApiErrorsActionMock when ErrorApiResponse is thrown', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

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

    getStateMock.mockReturnValue(stateMock);
    const dispatchMock = jest.fn();
    const orderNumber = '1234';
    const errorMock = new ErrorApiResponse('BOOM');
    cancelBookingMock.mockImplementation(() => {
      throw errorMock;
    });

    await cancelBookingDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      orderNumber
    );
    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalled();
    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
  });
});
