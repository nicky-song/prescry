// Copyright 2021 Prescryptive Health, Inc.

import { ICreateWaitlistRequestBody } from '../../../../../models/api-request-body/create-waitlist.request-body';
import { joinWaitlist } from '../../../api/api-v1.join-waitlist';
import { joinWaitlistDispatch } from './join-waitlist.dispatch';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { ErrorWaitlist } from '../../../../../errors/error-waitlist';
import { joinWaitlistErrorAction } from '../actions/join-waitlist-error.action';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';

jest.mock('../../../api/api-v1.join-waitlist', () => ({
  joinWaitlist: jest.fn().mockResolvedValue({ data: {} }),
}));

jest.mock('../../navigation/navigation-reducer.actions');
jest.mock('../../settings/dispatch/token-update.dispatch');
jest.mock('../actions/join-waitlist-error.action');
jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');

const joinWaitlistMock = joinWaitlist as jest.Mock;
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;
const joinWaitlistErrorActionMock = joinWaitlistErrorAction as jest.Mock;

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
    dataRefreshIntervalMilliseconds: 10,
  },
};
const getStateMock = jest.fn();

const joinWaitlistRequestBody = {
  serviceType: 'service-type',
  zipCode: '12345',
  maxMilesAway: 10,
  myself: true,
} as ICreateWaitlistRequestBody;

describe('joinWaitlistDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls expected functions when joinWaitlist API response is success', async () => {
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
    const joinWaitlistResponseMock = {
      data: {
        identifier: '123453',
        phoneNumber: '+16045582739',
        serviceType: 'service-type',
        serviceName: 'service-name',
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '2000-01-01',
        zipCode: '78885',
        maxMilesAway: 10,
      },
      message: 'all good',
      status: 'success',
      refreshToken: '123456',
    };
    joinWaitlistMock.mockResolvedValueOnce(joinWaitlistResponseMock);
    await joinWaitlistDispatch(
      dispatchMock,
      appointmentsStackNavigationMock,
      getStateMock,
      joinWaitlistRequestBody
    );

    expect(joinWaitlistMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      joinWaitlistRequestBody,
      deviceTokenMock,
      authTokenMock
    );
    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      joinWaitlistResponseMock.refreshToken
    );
    expect(appointmentsStackNavigationMock.navigate).toHaveBeenCalledWith(
      'WaitlistConfirmation',
      {
        serviceType: joinWaitlistResponseMock.data.serviceType,
        phoneNumber: joinWaitlistResponseMock.data.phoneNumber,
        patientFirstName: joinWaitlistResponseMock.data.firstName,
        patientLastName: joinWaitlistResponseMock.data.lastName,
        serviceName: joinWaitlistResponseMock.data.serviceName,
      }
    );
  });

  it('calls expected functions when joinWaitlist API response not success', async () => {
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
    const joinWaitlistResponseMock = {
      data: {
        identifier: '123453',
        phoneNumber: '+16045582739',
        serviceType: 'service-type',
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '2000-01-01',
        zipCode: '78885',
        maxMilesAway: 10,
      },
      message: 'all good',
      status: 'not-success',
      refreshToken: '123456',
    };
    joinWaitlistMock.mockResolvedValueOnce(joinWaitlistResponseMock);
    await joinWaitlistDispatch(
      dispatchMock,
      appointmentsStackNavigationMock,
      getStateMock,
      joinWaitlistRequestBody
    );

    expect(joinWaitlistMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      joinWaitlistRequestBody,
      deviceTokenMock,
      authTokenMock
    );
    expect(tokenUpdateDispatchMock).not.toHaveBeenCalledWith();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
  });

  it('hits catch statement if error is thrown', async () => {
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
    joinWaitlistMock.mockImplementation(() => {
      throw new ErrorWaitlist('test error');
    });
    await joinWaitlistDispatch(
      dispatchMock,
      appointmentsStackNavigationMock,
      getStateMock,
      joinWaitlistRequestBody
    );

    expect(joinWaitlistMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      joinWaitlistRequestBody,
      deviceTokenMock,
      authTokenMock
    );

    expect(tokenUpdateDispatchMock).not.toHaveBeenCalled();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith(
      joinWaitlistErrorActionMock('test error')
    );
  });

  it('handles non-waitlist errors correctly', async () => {
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
    const errorMock = new Error('test error');
    joinWaitlistMock.mockImplementation(() => {
      throw errorMock;
    });
    await joinWaitlistDispatch(
      dispatchMock,
      appointmentsStackNavigationMock,
      getStateMock,
      joinWaitlistRequestBody
    );

    expect(joinWaitlistMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      joinWaitlistRequestBody,
      deviceTokenMock,
      authTokenMock
    );

    expect(tokenUpdateDispatchMock).not.toHaveBeenCalled();
    expect(appointmentsStackNavigationMock.navigate).not.toHaveBeenCalled();
    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      appointmentsStackNavigationMock
    );
  });
});
