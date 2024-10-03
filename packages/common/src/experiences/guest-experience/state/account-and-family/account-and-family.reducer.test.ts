// Copyright 2022 Prescryptive Health, Inc.

import { setPrescriptionPersonSelectionAction } from './actions/set-prescription-person-selection.action';
import { accountAndFamilyReducer } from './account-and-family.reducer';
import {
  defaultAccountAndFamilyState,
  IAccountAndFamilyState,
  PrescriptionPersonSelection,
} from './account-and-family.state';

describe('accountAndFamilyReducer', () => {
  it.each([
    ['self' as PrescriptionPersonSelection],
    ['other' as PrescriptionPersonSelection],
  ])(
    'reduces set prescription person selection action',
    (prescriptionPersonSelectionMock) => {
      const action = setPrescriptionPersonSelectionAction(
        prescriptionPersonSelectionMock
      );

      const initialState: IAccountAndFamilyState = {
        ...defaultAccountAndFamilyState,
      };
      const reducedState = accountAndFamilyReducer(initialState, action);

      const expectedState: IAccountAndFamilyState = {
        ...initialState,
        prescriptionPersonSelection: prescriptionPersonSelectionMock,
      };
      expect(reducedState).toEqual(expectedState);
    }
  );
});
