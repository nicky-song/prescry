// Copyright 2021 Prescryptive Health, Inc.

import { sendVerificationCodeDispatch } from '../dispatch/send-verification-code.dispatch';
import {
  IVerificationCodeAsyncActionArgs,
  sendVerificationCodeAsyncAction,
} from './send-verification-code.async-action';
import { setIdentityVerificationMethodAction } from '../actions/set-identity-verification-method.action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../dispatch/send-verification-code.dispatch');
const sendVerificationCodeDispatchMock =
  sendVerificationCodeDispatch as jest.Mock;

describe('sendVerificationCodeAsyncAction', () => {
  beforeEach(() => {
    sendVerificationCodeDispatchMock.mockReset();
  });

  it('calls expected functions', async () => {
    const getStateMock = jest.fn();
    const dispatchMock = jest.fn();

    const verificationType = 'PHONE';
    const args: IVerificationCodeAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      verificationType,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
    };
    const asyncAction = sendVerificationCodeAsyncAction(args);

    await asyncAction();
    expect(dispatchMock).toHaveBeenCalledWith(
      setIdentityVerificationMethodAction({
        selectedVerificationMethod: 'PHONE',
      })
    );
    expect(sendVerificationCodeDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      verificationType
    );
  });
});
