// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { sendVerificationCodeDataLoadingAsyncAction } from './send-verification-code-data-loading.async-action';
import {
  IVerificationCodeAsyncActionArgs,
  sendVerificationCodeAsyncAction,
} from './send-verification-code.async-action';

jest.mock('./identity-verification.async-action');
const sendVerificationCodeAsyncActionMock =
  sendVerificationCodeAsyncAction as jest.Mock;

jest.mock('../../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

describe('sendVerificationCodeDataLoadingAsyncAction', () => {
  it('calls dataLoadingAction', () => {
    const getStateMock = jest.fn();
    const dispatchMock = jest.fn();

    const verificationType = 'PHONE';
    const args: IVerificationCodeAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      verificationType,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
    };
    sendVerificationCodeDataLoadingAsyncAction(args);

    expect(dataLoadingActionMock).toBeCalledWith(
      sendVerificationCodeAsyncActionMock,
      args
    );
  });
});
