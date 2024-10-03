// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { ErrorMaxVerificationAttempt } from '../../../../../errors/error-max-verification-attempts';
import { IResetPinRequestBody } from '../../../../../models/api-request-body/reset-pin.request-body';
import { IResetPinResponse } from '../../../../../models/api-response/reset-pin.response';
import { resetPin } from '../../../api/api-v1.reset-pin';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { ICreatePinScreenRouteProps } from './../../../create-pin-screen/create-pin-screen';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { dispatchResetStackToPhoneLoginScreen } from '../../navigation/navigation-reducer.actions';
import { accountTokenClearDispatch } from '../../settings/dispatch/account-token-clear.dispatch';
import {
  resetSettingsAction,
  updateDeviceTokenSettingsAction,
} from '../../settings/settings-reducer.actions';
import { resetPinDispatch } from './reset-pin.dispatch';
import { resetIdentityVerificationCodeSentAction } from '../actions/reset-identity-verification-code-sent.action';

const response: IResetPinResponse = {
  data: {
    deviceToken: 'token',
  },
  message: 'ok',
  status: 'success',
};

jest.mock('../../../api/api-v1.reset-pin');
const resetPinMock = resetPin as jest.Mock;

jest.mock('../../settings/settings-reducer.actions');
const resetSettingsActionMock = resetSettingsAction as jest.Mock;
const updateDeviceTokenSettingsActionMock =
  updateDeviceTokenSettingsAction as jest.Mock;

jest.mock('../../navigation/navigation-reducer.actions');
const dispatchResetStackToPhoneLoginScreenMock =
  dispatchResetStackToPhoneLoginScreen as jest.Mock;

jest.mock('../../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

jest.mock('../actions/reset-identity-verification-code-sent.action');
const resetIdentityVerificationCodeSentActionMock =
  resetIdentityVerificationCodeSentAction as jest.Mock;
jest.mock('../../settings/dispatch/account-token-clear.dispatch');
const accountTokenClearDispatchMock = accountTokenClearDispatch as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const guestExperienceApiMock = { env: 'host' };
const defaultStateMock = {
  config: {
    apis: { guestExperienceApi: guestExperienceApiMock },
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();
const resetPinRequestBody: IResetPinRequestBody = {
  verificationType: 'EMAIL',
  code: '123456',
  maskedValue: 'x*****x@g.com',
};
describe('resetPinDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
    resetPinMock.mockResolvedValue(response);
    updateDeviceTokenSettingsActionMock.mockReturnValue(
      (dispatch: unknown) => dispatch
    );
    resetSettingsActionMock.mockReturnValue((dispatch: unknown) => dispatch);
  });

  it('calls resetPin API with expected arguments', async () => {
    getStateMock.mockReturnValue({
      ...defaultStateMock,
    });

    const dispatchMock = jest.fn();

    await resetPinDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      resetPinRequestBody
    );

    expect(resetPinMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      resetPinRequestBody,
      deviceTokenMock,
      authTokenMock
    );
    expect(resetSettingsActionMock).toBeCalled();
    expect(updateDeviceTokenSettingsActionMock).toBeCalledWith('token');
    expect(dispatchResetStackToPhoneLoginScreenMock).toBeCalledWith(
      rootStackNavigationMock
    );
    const expectedCreatePinScreenParams: ICreatePinScreenRouteProps = {};
    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'CreatePin',
      expectedCreatePinScreenParams
    );
  });
  it('should throw ErrorBadRequest when verification pin is invalid', async () => {
    getStateMock.mockReturnValue({
      ...defaultStateMock,
    });
    const badRequestErrorMock = new ErrorBadRequest('some-error-message');
    const dispatchMock = jest.fn();
    resetPinMock.mockImplementation(() => {
      throw badRequestErrorMock;
    });
    resetIdentityVerificationCodeSentActionMock.mockReturnValueOnce('test');
    try {
      await resetPinDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        resetPinRequestBody
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(badRequestErrorMock);
    }

    expect(resetPinMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      resetPinRequestBody,
      deviceTokenMock,
      authTokenMock
    );

    expect(dispatchMock).toBeCalledWith('test');
  });
  it('handles thrown ErrorMaxVerificationAttempt correctly', async () => {
    getStateMock.mockReturnValue({
      ...defaultStateMock,
    });
    const dispatchMock = jest.fn();
    resetPinMock.mockImplementation(() => {
      throw new ErrorMaxVerificationAttempt(
        'max-attempt-reached-message',
        true
      );
    });

    await resetPinDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      resetPinRequestBody
    );
    expect(resetPinMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      resetPinRequestBody,
      deviceTokenMock,
      authTokenMock
    );
    expect(guestExperienceCustomEventLoggerMock).toBeCalledWith(
      CustomAppInsightEvents.REACHED_MAX_VERIFICATION_CODE_ATTEMPTS,
      {}
    );
    expect(accountTokenClearDispatchMock).toBeCalledWith(dispatchMock);
    expect(rootStackNavigationMock.navigate).toBeCalledWith('AccountLocked', {
      accountLockedResponse: true,
    });
  });
  it('should call internalErrorDispatchMock when ErrorApiResponse is thrown', async () => {
    getStateMock.mockReturnValue({
      ...defaultStateMock,
    });
    const dispatchMock = jest.fn();
    const mockError = new ErrorApiResponse('Error');
    resetPinMock.mockImplementation(() => {
      throw mockError;
    });

    await resetPinDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      resetPinRequestBody
    );
    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      mockError
    );
  });
});
