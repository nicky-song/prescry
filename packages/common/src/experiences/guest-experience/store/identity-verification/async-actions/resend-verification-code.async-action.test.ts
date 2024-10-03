// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { sendVerificationCodeDispatch } from '../dispatch/send-verification-code.dispatch';
import { resendVerificationCodeAsyncAction } from './resend-verification-code.async-action';
import { IVerificationCodeAsyncActionArgs } from './send-verification-code.async-action';

jest.mock('../dispatch/send-verification-code.dispatch');
const sendVerificationCodeDispatchMock =
  sendVerificationCodeDispatch as jest.Mock;

describe('resendVerificationCodeAsyncAction', () => {
  beforeEach(() => {
    sendVerificationCodeDispatchMock.mockReset();
  });

  it('calls expected dispatch on success', async () => {
    const getStateMock = jest.fn();
    const dispatchMock = jest.fn();

    const verificationType = 'PHONE';
    const args: IVerificationCodeAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      verificationType,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
    };
    const asyncAction = resendVerificationCodeAsyncAction(args);

    await asyncAction();
    expect(sendVerificationCodeDispatch).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      verificationType,
      true
    );
  });
});
