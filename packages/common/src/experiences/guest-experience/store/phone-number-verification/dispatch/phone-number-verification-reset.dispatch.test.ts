// Copyright 2020 Prescryptive Health, Inc.

import { resetPhoneNumberVerificationAction } from '../actions/phone-number-verification.actions';
import { phoneNumberVerificationResetDispatch } from './phone-number-verification-reset.dispatch';

const dispatchMock = jest.fn();

describe('phoneNumberVerificationResetDispatch', () => {
  it('dispatches expected action', async () => {
    await phoneNumberVerificationResetDispatch(dispatchMock);

    const action = resetPhoneNumberVerificationAction();
    expect(dispatchMock).toHaveBeenCalledWith(action);
  });
});
