// Copyright 2022 Prescryptive Health, Inc.

import { PrescriptionPersonSelection } from '../account-and-family.state';
import { setPrescriptionPersonSelectionAction } from '../actions/set-prescription-person-selection.action';
import { setPrescriptionPersonSelectionDispatch } from './set-prescription-person-selection.dispatch';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';

jest.mock('../actions/set-prescription-person-selection.action');
const setPrescriptionPersonSelectionActionMock =
  setPrescriptionPersonSelectionAction as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware', () => ({
  CustomAppInsightEvents: {
    PRESCRIPTION_PERSON_SELECTED: 'prescription-person-selected-mock',
  },
  guestExperienceCustomEventLogger: jest.fn(),
}));
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

describe('setPrescriptionPersonSelectionDispatch', () => {
  it.each([
    ['self' as PrescriptionPersonSelection],
    ['other' as PrescriptionPersonSelection],
  ])(
    'dispatches expected action with prescriptionPersonSelection: %s',
    (prescriptionPersonSelectionMock: PrescriptionPersonSelection) => {
      const dispatchMock = jest.fn();

      setPrescriptionPersonSelectionDispatch(
        dispatchMock,
        prescriptionPersonSelectionMock
      );

      const expectedAction = setPrescriptionPersonSelectionActionMock(
        prescriptionPersonSelectionMock
      );
      expect(dispatchMock).toHaveBeenCalledWith(expectedAction);

      expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
        CustomAppInsightEvents.PRESCRIPTION_PERSON_SELECTED,
        prescriptionPersonSelectionMock
      );
    }
  );
});
