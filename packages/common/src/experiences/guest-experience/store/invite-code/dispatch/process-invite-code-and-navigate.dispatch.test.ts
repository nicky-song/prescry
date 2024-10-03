// Copyright 2021 Prescryptive Health, Inc.

import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { processInviteCodeDispatch } from './process-invite-code.dispatch';
import { processInviteCodeAndNavigateDispatch } from './process-invite-code-and-navigate.dispatch';
import { ErrorInviteCode } from '../../../../../errors/error-invite-code';
import { APITypes } from '../../../api/api-v1-helper';
import { InternalResponseCode } from '../../../../../errors/error-codes';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { popToTop } from '../../../navigation/navigation.helper';

jest.mock('./process-invite-code.dispatch');
const processInviteCodeDispatchMock = processInviteCodeDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

jest.mock(
  '../../navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('../../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';
const defaultStateMock = {
  config: {
    apis: {},
    supportEmail: 'test@test.com',
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
  appointment: {
    selectedLocation: {
      timezone: 'America/Los_Angeles',
      id: '1',
      serviceInfo: [{ serviceType: '111' }],
    },
    selectedService: { serviceType: '111' },
  },
};
const getStateMock = jest.fn();

describe('processInviteCodeAndNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls processInviteCodeDispatch and navigates to screen', async () => {
    const dispatchMock = jest.fn();

    await processInviteCodeAndNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'invite-code'
    );

    expect(processInviteCodeDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      'invite-code'
    );
    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      {
        screen: 'Appointment',
        params: { showBackButton: false, showBackToHome: false },
      }
    );
  });

  it('dispatches error action on failure', async () => {
    const errorMock = Error('Error in getting data!');
    processInviteCodeDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await processInviteCodeAndNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'invite-code'
    );

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
    expect(navigateHomeScreenNoApiRefreshDispatchMock).not.toHaveBeenCalled();
  });

  it('dispathes ErrorInviteCode when expected', async () => {
    const errorMock = new ErrorInviteCode(
      'test-message',
      APITypes.PROCESS_INVITE_CODE,
      InternalResponseCode.SCHEDULER_AGE_REQUIREMENT_NOT_MET
    );
    processInviteCodeDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    await processInviteCodeAndNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'invite-code'
    );

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledWith(
      getStateMock,
      rootStackNavigationMock,
      {
        modalContent: {
          showModal: true,
          modalTopContent: 'test-message',
        },
      }
    );
  });
});
