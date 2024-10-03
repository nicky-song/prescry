// Copyright 2020 Prescryptive Health, Inc.

import { phoneNumberVerificationResetDispatch } from '../dispatch/phone-number-verification-reset.dispatch';
import { phoneNumberVerificationResetAsyncAction } from './phone-number-verification-reset.async-action';

jest.mock('../dispatch/phone-number-verification-reset.dispatch');
const phoneNumberVerificationResetDispatchMock =
  phoneNumberVerificationResetDispatch as jest.Mock;

describe('phoneNumberVerificationResetAsyncAction', () => {
  it('calls phoneNumberVerificationResetDispatch', async () => {
    const dispatchMock = jest.fn();
    const asyncAction = phoneNumberVerificationResetAsyncAction();
    await asyncAction(dispatchMock);

    expect(phoneNumberVerificationResetDispatchMock).toHaveBeenCalledWith(
      dispatchMock
    );
  });
});
