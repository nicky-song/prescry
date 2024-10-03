// Copyright 2021 Prescryptive Health, Inc.

import { addRecoveryEmail } from '../../../api/api-v1.add-recovery-email';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setIdentityVerificationEmailFlagAction } from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { addRecoveryEmailDispatch } from './add-recovery-email.dispatch';
import { loadMemberDataDispatch } from './load-member-data.dispatch';

jest.mock('../../../api/api-v1.add-recovery-email', () => ({
  addRecoveryEmail: jest.fn().mockResolvedValue({ data: {} }),
}));

jest.mock('./load-member-data.dispatch', () => ({
  loadMemberDataDispatch: jest.fn(),
}));
jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');

const addRecoveryEmailMock = addRecoveryEmail as jest.Mock;
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

describe('addRecoveryEmailDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls expected functions when addRecoveryEmail API response is success', async () => {
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
    const addRecoveryEmailResponseMock = {
      message: 'all good',
      status: 'success',
      refreshToken: '123456',
    };
    addRecoveryEmailMock.mockResolvedValueOnce(addRecoveryEmailResponseMock);
    await addRecoveryEmailDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      { email }
    );

    const setEmailFlagAction = setIdentityVerificationEmailFlagAction({
      recoveryEmailExists: true,
    });

    expect(addRecoveryEmailMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      { email },
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
    const errorMock: Error = new Error('test error');
    addRecoveryEmailMock.mockImplementation(() => {
      throw errorMock;
    });
    await addRecoveryEmailDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      { email }
    );

    expect(addRecoveryEmailMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      { email },
      deviceTokenMock,
      authTokenMock
    );

    expect(handlePostLoginApiErrorsActionMock).toBeCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
  });
});
