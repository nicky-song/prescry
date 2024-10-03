// Copyright 2023 Prescryptive Health, Inc.

import { IValidateIdentity } from '../../../../../models/air/validate-identity.response';
import { setValidateIdentityAction } from '../actions/set-validate-identity.action';
import { MembershipDispatch } from './membership.dispatch';

export const setValidateIdentityDispatch = (
  dispatch: MembershipDispatch,
  validateIdentity: IValidateIdentity
): void => dispatch(setValidateIdentityAction(validateIdentity));
