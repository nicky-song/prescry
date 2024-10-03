// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { ICreateAccount } from '../../../../../models/create-account';
import { Workflow } from '../../../../../models/workflow';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

import { handleTwilioErrorAction } from '../../../store/error-handling.actions';
import { internalErrorDispatch } from '../../../store/error-handling/dispatch/internal-error.dispatch';

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { sendOneTimeVerificationCodeDispatch } from '../../../store/navigation/dispatch/sign-in/send-one-time-verification-code.dispatch';
import {
  ISendOneTimeVerificationCodeAsyncActionArgs,
  sendOneTimeVerificationCodeAsyncAction,
} from './send-one-time-verification-code.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/sign-in/send-one-time-verification-code.dispatch'
);
const sendOneTimeVerificationCodeDispatchMock =
  sendOneTimeVerificationCodeDispatch as jest.Mock;

jest.mock('../../../store/error-handling.actions');
const handleTwilioErrorActionMock = handleTwilioErrorAction as jest.Mock;

jest.mock('../../../store/error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

const accountMock: ICreateAccount = {
  firstName: 'Johnny',
  lastName: 'AppleSeed',
  email: 'test@test.com',
  dateOfBirth: 'January-01-2010',
  phoneNumber: '+1PHONE',
  isTermAccepted: true,
};
const workflowMock: Workflow = 'prescriptionTransfer';
const argsMock: ISendOneTimeVerificationCodeAsyncActionArgs = {
  account: accountMock,
  workflow: workflowMock,
  reduxDispatch: jest.fn(),
  reduxGetState: jest.fn(),
  navigation: rootStackNavigationMock,
};

describe('sendOneTimeVerificationCodeAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('calls data loading', async () => {
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    await sendOneTimeVerificationCodeAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock
    );
    expect(dataLoadingAsyncMock).toHaveBeenCalledWith(
      argsMock.reduxDispatch,
      argsMock.reduxGetState
    );
  });

  it('dispatches sendOneTimeVerificationCodeDispatch', async () => {
    await sendOneTimeVerificationCodeAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction();

    expect(sendOneTimeVerificationCodeDispatchMock).toHaveBeenCalledWith(
      argsMock.account,
      argsMock.workflow,
      argsMock.reduxGetState,
      argsMock.navigation
    );
  });

  it('passes errors badRequest through', async () => {
    const errorMock = new ErrorBadRequest('Error');
    sendOneTimeVerificationCodeDispatchMock.mockImplementation(() => {
      throw errorMock;
    });
    await sendOneTimeVerificationCodeAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);

    try {
      await asyncAction();
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }
  });

  it('handles errors TooManyRequestError', async () => {
    const errorMock = new TooManyRequestError('Error');
    sendOneTimeVerificationCodeDispatchMock.mockImplementation(() => {
      throw errorMock;
    });
    await sendOneTimeVerificationCodeAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction();
    expect(handleTwilioErrorActionMock).toHaveBeenCalledWith(
      argsMock.reduxDispatch,
      argsMock.navigation,
      'Error'
    );
  });

  it('handles errors', async () => {
    const errorMock = new Error('Error');
    sendOneTimeVerificationCodeDispatchMock.mockImplementation(() => {
      throw errorMock;
    });
    await sendOneTimeVerificationCodeAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction();
    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      argsMock.navigation,
      errorMock
    );
  });
});
