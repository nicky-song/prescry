// Copyright 2021 Prescryptive Health, Inc.

import { resetPinDispatch } from '../dispatch/reset-pin.dispatch';
import { resetPinVerificationCodeAsyncAction } from './reset-pin-verification-code.async-action';
import { IResetPinRequestBody } from '../../../../../models/api-request-body/reset-pin.request-body';
import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IResetPinVerificationCodeAsyncActionArgs } from './reset-pin-verification-code.async-action';

jest.mock('../dispatch/reset-pin.dispatch');
const resetPinDispatchMock = resetPinDispatch as jest.Mock;

const getStateMock = jest.fn();
const dispatchMock = jest.fn();

const requestBodyMock = {
  verificationType: 'EMAIL',
  maskedValue: 'd.XXXXX@gmail.com',
  code: '123456',
} as IResetPinRequestBody;

describe('resetPinVerificationCodeAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    resetPinDispatchMock.mockReset();
  });

  it('calls resetPinDispatch as expected', async () => {
    const args: IResetPinVerificationCodeAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      requestBody: requestBodyMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
    };

    await resetPinVerificationCodeAsyncAction(args)();

    expect(resetPinDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      requestBodyMock
    );
  });
});
