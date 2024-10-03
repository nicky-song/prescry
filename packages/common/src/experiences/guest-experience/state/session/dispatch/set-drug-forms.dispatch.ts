// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../../../../models/drug-form';
import { drugFormsSetAction } from '../actions/drug-forms-set.action';
import { SessionDispatch } from './session.dispatch';

export const setDrugFormsDispatch = (
  dispatch: SessionDispatch,
  drugForms: IDrugForm[]
): void => {
  dispatch(drugFormsSetAction(drugForms));
};
