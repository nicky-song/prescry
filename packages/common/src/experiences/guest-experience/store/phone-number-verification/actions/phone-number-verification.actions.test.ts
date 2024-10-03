// Copyright 2020 Prescryptive Health, Inc.

import {
  resetPhoneNumberVerificationAction,
  PhoneNumberVerificationActionsKeys,
  onVerifyPhoneNumberAction,
} from './phone-number-verification.actions';

describe('resetPhoneNumberVerificationAction', () => {
  it('creates action with expected payload and type', () => {
    const action = resetPhoneNumberVerificationAction();
    expect(action).toMatchObject({
      type: PhoneNumberVerificationActionsKeys.RESET_VERIFICATION_STATE,
    });
  });
});

describe('onVerifyPhoneNumberAction', () => {
  it('should issue SET_VERIFICATION_CODE action ', () => {
    const verificationCodeState = {
      verificationCode: '123456',
    };
    const action = onVerifyPhoneNumberAction(
      verificationCodeState.verificationCode
    );
    expect(action).toMatchObject({
      payload: verificationCodeState,
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE,
    });
  });
});
