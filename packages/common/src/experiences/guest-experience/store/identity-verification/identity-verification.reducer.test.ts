// Copyright 2021 Prescryptive Health, Inc.

import { setIdentityVerificationDataAction } from './actions/set-identity-verification-data.action';
import { setIdentityVerificationEmailFlagAction } from './actions/set-identity-verification-email-flag.action';
import { setIdentityVerificationMethodAction } from './actions/set-identity-verification-method.action';
import { resetIdentityVerificationCodeSentAction } from './actions/reset-identity-verification-code-sent.action';

import {
  defaultIdentityVerificationState,
  identityVerificationReducer,
  IIdentityVerificationActionTypes,
  IIdentityVerificationState,
} from './identity-verification.reducer';
import { setIdentityVerificationCodeSentAction } from './actions/set-identity-verification-code-sent.action';

describe('identityVerificationReducer', () => {
  const defaultState: IIdentityVerificationState = {};
  it('returns default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as IIdentityVerificationActionTypes;

    expect(identityVerificationReducer(undefined, action)).toEqual(
      defaultIdentityVerificationState
    );
  });

  it('updates state for setIdentityVerificationEmailFlagAction', () => {
    const data = {
      recoveryEmailExists: true,
    };
    const action = setIdentityVerificationEmailFlagAction(data);
    const expectedState: IIdentityVerificationState = {
      recoveryEmailExists: data.recoveryEmailExists,
    };

    const updatedState = identityVerificationReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state for setIdentityVerificationDataAction', () => {
    const data = {
      maskedEmail: 'masked-email',
      maskedPhoneNumber: 'masked-phone-number',
    };
    const action = setIdentityVerificationDataAction(data);
    const expectedState: IIdentityVerificationState = {
      maskedEmail: data.maskedEmail,
      maskedPhoneNumber: data.maskedPhoneNumber,
    };

    const updatedState = identityVerificationReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state for setIdentityVerificationMethodAction', () => {
    const data = {
      selectedVerificationMethod: 'verification-method',
    };
    const action = setIdentityVerificationMethodAction(data);
    const expectedState: IIdentityVerificationState = {
      selectedVerificationMethod: data.selectedVerificationMethod,
    };

    const updatedState = identityVerificationReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state for resetIdentityVerificationCodeSentAction', () => {
    const action = resetIdentityVerificationCodeSentAction();
    const expectedState: IIdentityVerificationState = {};

    const updatedState = identityVerificationReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state for setIdentityVerificationCodeSentAction', () => {
    const data = {
      isVerificationCodeSent: true,
    };
    const action = setIdentityVerificationCodeSentAction(data);
    const expectedState: IIdentityVerificationState = {
      isVerificationCodeSent: true,
    };

    const updatedState = identityVerificationReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });
});
