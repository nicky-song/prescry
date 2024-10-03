// Copyright 2022 Prescryptive Health, Inc.

import { PrescriptionPersonSelection } from '../account-and-family.state';
import { setPrescriptionPersonSelectionAction } from './set-prescription-person-selection.action';

describe('setPrescriptionPersonSelectionAction', () => {
  it.each([
    ['self' as PrescriptionPersonSelection],
    ['other' as PrescriptionPersonSelection],
  ])(
    'returns action with prescriptionPersonSelection: %s',
    (prescriptionPersonSelectionMock: PrescriptionPersonSelection) => {
      const action = setPrescriptionPersonSelectionAction(
        prescriptionPersonSelectionMock
      );
      expect(action.type).toEqual('SET_PRESCRIPTION_PERSON_SELECTION');

      expect(action.payload).toEqual({
        prescriptionPersonSelection: prescriptionPersonSelectionMock,
      });
    }
  );
});
