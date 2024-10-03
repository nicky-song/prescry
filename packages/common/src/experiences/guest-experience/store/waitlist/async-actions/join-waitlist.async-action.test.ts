// Copyright 2021 Prescryptive Health, Inc.

import { ICreateWaitlistRequestBody } from '../../../../../models/api-request-body/create-waitlist.request-body';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { joinWaitlistDispatch } from '../dispatch/join-waitlist.dispatch';
import { joinWaitlistAsyncAction } from './join-waitlist.async-action';

jest.mock('../dispatch/join-waitlist.dispatch');
const joinWaitlistDispatchMock = joinWaitlistDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const getStateMock = jest.fn();
const dispatchMock = jest.fn();

const mockData = {
  serviceType: 'service-type',
  zipCode: '12345',
  maxMilesAway: 10,
  myself: true,
} as ICreateWaitlistRequestBody;

describe('joinWaitlistAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls joinWaitlistDispatch as expected', async () => {
    const asyncAction = joinWaitlistAsyncAction({
      data: mockData,
      navigation: appointmentsStackNavigationMock,
    });

    const response = await asyncAction(dispatchMock, getStateMock);

    expect(response).toEqual(true);
    expect(joinWaitlistDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      appointmentsStackNavigationMock,
      getStateMock,
      mockData
    );
  });

  it('handles error', async () => {
    const errorMock = new Error('error');
    joinWaitlistDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const asyncAction = joinWaitlistAsyncAction({
      data: mockData,
      navigation: appointmentsStackNavigationMock,
    });

    const response = await asyncAction(dispatchMock, getStateMock);

    expect(response).toEqual(false);
    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      appointmentsStackNavigationMock
    );
  });
});
