// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../../../../models/drug-form';
import { ISessionAction } from './session.action';

export type IDrugFormsSetAction = ISessionAction<'DRUG_FORMS_SET'>;

export const drugFormsSetAction = (
  drugForms: IDrugForm[]
): IDrugFormsSetAction => ({
  type: 'DRUG_FORMS_SET',
  payload: {
    drugFormMap: buildDrugFormMap(drugForms),
  },
});

const buildDrugFormMap = (drugForms: IDrugForm[]) => {
  const map = new Map<string, IDrugForm>();

  drugForms.forEach((drugForm) => {
    map.set(drugForm.formCode, drugForm);
  });

  return map;
};
