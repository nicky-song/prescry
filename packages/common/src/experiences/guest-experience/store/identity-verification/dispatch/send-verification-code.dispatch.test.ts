// Copyright 2021 Prescryptive Health, Inc.

import { sendVerificationCodeDispatch } from './send-verification-code.dispatch';
import { sendVerificationCode } from '../../../api/api-v1.send-verification-code';
import { ISendVerificationCodeRequestBody } from '../../../../../models/api-request-body/send-verification-code.request-body';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { handleTwilioErrorAction } from '../../error-handling.actions';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../api/api-v1.send-verification-code', () => ({
  sendVerificationCode: jest.fn().mockResolvedValue({ data: {} }),
}));
jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
jest.mock('../../error-handling.actions');
jest.mock('../../../guest-experience-logger.middleware');
jest.mock('../../error-handling/dispatch/internal-error.dispatch');

const sendVerificationCodeMock = sendVerificationCode as jest.Mock;

const handleTwilioErrorActionMock = handleTwilioErrorAction as jest.Mock;
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

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

const sendVerificationCodeRequestBody = {
  verificationType: 'PHONE',
} as ISendVerificationCodeRequestBody;

describe('sendVerificationCodeDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls expected functions when sendVerificationCode API response is success', async () => {
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
    const sendVerificationCodeResponseMock = {
      message: 'all good',
      status: 'success',
      refreshToken: '123456',
    };
    sendVerificationCodeMock.mockResolvedValueOnce(
      sendVerificationCodeResponseMock
    );
    await sendVerificationCodeDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      sendVerificationCodeRequestBody.verificationType
    );

    expect(sendVerificationCodeMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      sendVerificationCodeRequestBody,
      deviceTokenMock,
      authTokenMock
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'VerifyIdentityVerificationCode'
    );
  });

  it('handles thrown ErrorBadRequest correctly', async () => {
    const error = 'test-error-message';
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
    const badRequestErrorMock = new ErrorBadRequest(error);
    sendVerificationCodeMock.mockImplementation(() => {
      throw badRequestErrorMock;
    });

    try {
      await sendVerificationCodeDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        sendVerificationCodeRequestBody.verificationType
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(badRequestErrorMock);
    }

    expect(sendVerificationCodeMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      sendVerificationCodeRequestBody,
      deviceTokenMock,
      authTokenMock
    );
  });

  it('handles thrown TooManyRequestError correctly', async () => {
    const error = 'test-error-message';
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
    const badRequestErrorMock = new TooManyRequestError(error);

    sendVerificationCodeMock.mockImplementation(() => {
      throw badRequestErrorMock;
    });
    await sendVerificationCodeDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      sendVerificationCodeRequestBody.verificationType
    );

    expect(sendVerificationCodeMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      sendVerificationCodeRequestBody,
      deviceTokenMock,
      authTokenMock
    );
    expect(guestExperienceCustomEventLoggerMock).toBeCalledWith(
      CustomAppInsightEvents.REQUESTED_VERIFICATION_CODE_MAX_ATTEMPTS,
      {}
    );
    expect(handleTwilioErrorActionMock).toHaveBeenCalledWith(
      dispatchMock,
      rootStackNavigationMock,
      error
    );
  });

  it('handles thrown ErrorInternalServer correctly', async () => {
    const error = 'test-error-message';
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
    const errorInternalServerMock = new ErrorInternalServer(error);

    sendVerificationCodeMock.mockImplementation(() => {
      throw errorInternalServerMock;
    });
    await sendVerificationCodeDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      sendVerificationCodeRequestBody.verificationType
    );

    expect(sendVerificationCodeMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      sendVerificationCodeRequestBody,
      deviceTokenMock,
      authTokenMock
    );

    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      errorInternalServerMock
    );
  });
});
