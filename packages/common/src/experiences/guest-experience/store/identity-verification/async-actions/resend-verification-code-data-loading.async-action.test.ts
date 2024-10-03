// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { resendVerificationCodeDataLoadingAsyncAction } from './resend-verification-code-data-loading.async-action';
import { resendVerificationCodeAsyncAction } from './resend-verification-code.async-action';
import { IVerificationCodeAsyncActionArgs } from './send-verification-code.async-action';

jest.mock('./identity-verification.async-action');
const resendVerificationCodeAsyncActionMock =
  resendVerificationCodeAsyncAction as jest.Mock;

jest.mock('../../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;
const verificationType = 'PHONE';

describe('resendVerificationCodeDataLoadingAsyncAction', () => {
  it('calls dataLoadingAction', () => {
    const args: IVerificationCodeAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      verificationType,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
    };
    resendVerificationCodeDataLoadingAsyncAction(args);
    expect(dataLoadingActionMock).toBeCalledWith(
      resendVerificationCodeAsyncActionMock,
      args
    );
  });
});
