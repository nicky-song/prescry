// Copyright 2023 Prescryptive Health, Inc.

import { IValidateIdentity } from '../../../../../models/air/validate-identity.response';
import { IMembershipAction } from './membership.action';

export type ISetValidateIdentityAction =
  IMembershipAction<'SET_VALIDATE_IDENTITY'>;

export const setValidateIdentityAction = (
  validateIdentity: IValidateIdentity
): ISetValidateIdentityAction => ({
  payload: { validateIdentity },
  type: 'SET_VALIDATE_IDENTITY',
});
