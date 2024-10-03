// Copyright 2022 Prescryptive Health, Inc.

import { PrescriptionPersonSelection } from '../account-and-family.state';
import { IAccountAndFamilyAction } from './account-and-family.action';

export type IPrescriptionPersonSelectionAction =
  IAccountAndFamilyAction<'SET_PRESCRIPTION_PERSON_SELECTION'>;
export const setPrescriptionPersonSelectionAction = (
  prescriptionPersonSelection: PrescriptionPersonSelection
): IPrescriptionPersonSelectionAction => ({
  type: 'SET_PRESCRIPTION_PERSON_SELECTION',
  payload: {
    prescriptionPersonSelection,
  },
});
