// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';

import {
  IResetPhoneNumberVerificationAction,
  resetPhoneNumberVerificationAction,
} from '../actions/phone-number-verification.actions';

export const phoneNumberVerificationResetDispatch = async (
  dispatch: Dispatch<IResetPhoneNumberVerificationAction>
) => {
  await dispatch(resetPhoneNumberVerificationAction());
};
