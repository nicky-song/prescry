// Copyright 2021 Prescryptive Health, Inc.

import { updateRecoveryEmail } from '../../../api/api-v1.update-recovery-email';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setIdentityVerificationEmailFlagAction } from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { loadMemberDataDispatch } from './load-member-data.dispatch';
import { updateRecoveryEmailDispatch } from './update-recovery-email.dispatch';

jest.mock('../../../api/api-v1.update-recovery-email', () => ({
  updateRecoveryEmail: jest.fn().mockResolvedValue({ data: {} }),
}));

jest.mock('./load-member-data.dispatch', () => ({
  loadMemberDataDispatch: jest.fn(),
}));
jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');

const updateRecoveryEmailMock = updateRecoveryEmail as jest.Mock;
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

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

const email = 'test@test.com';
const oldEmail = 'old@test.com';

describe('updateRecoveryEmailDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls expected functions when updateRecoveryEmail API response is success', async () => {
    (loadMemberDataDispatch as jest.Mock).mockResolvedValue(true);
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
    const updateRecoveryEmailResponseMock = {
      message: 'all good',
      status: 'success',
      refreshToken: '123456',
    };
    updateRecoveryEmailMock.mockResolvedValueOnce(
      updateRecoveryEmailResponseMock
    );
    await updateRecoveryEmailDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      {
        email,
        oldEmail,
      }
    );

    const setEmailFlagAction = setIdentityVerificationEmailFlagAction({
      recoveryEmailExists: true,
    });

    expect(updateRecoveryEmailMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      { email, oldEmail },
      deviceTokenMock,
      authTokenMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(setEmailFlagAction);
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
    const errorMock = new Error('test error');

    updateRecoveryEmailMock.mockImplementation(() => {
      throw errorMock;
    });
    await updateRecoveryEmailDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      {
        email,
        oldEmail,
      }
    );

    expect(updateRecoveryEmailMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      { email, oldEmail },
      deviceTokenMock,
      authTokenMock
    );

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
  });
});
