// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { resetPinVerificationCodeDataLoadingAsyncAction } from './reset-pin-verification-code-data-loading-async-action';
import {
  resetPinVerificationCodeAsyncAction,
  IResetPinVerificationCodeAsyncActionArgs,
} from './reset-pin-verification-code.async-action';
import { IResetPinRequestBody } from '../../../../../models/api-request-body/reset-pin.request-body';

jest.mock('../../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('./reset-pin-verification-code.async-action');
const resetPinVerificationCodeAsyncActionMock =
  resetPinVerificationCodeAsyncAction as jest.Mock;

describe('resetPinVerificationCodeDataLoadingAsyncAction', () => {
  it('calls dataLoadingAction with async action with reset pin request body', async () => {
    const requestBodyMock = {
      verificationType: 'EMAIL',
      maskedValue: 'd.XXXXX@gmail.com',
      code: '123456',
    } as IResetPinRequestBody;

    dataLoadingActionMock.mockReturnValue(
      jest.fn().mockResolvedValue(undefined)
    );

    const args: IResetPinVerificationCodeAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      requestBody: requestBodyMock,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
    };

    await resetPinVerificationCodeDataLoadingAsyncAction(args);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      resetPinVerificationCodeAsyncActionMock,
      args
    );
  });
});
