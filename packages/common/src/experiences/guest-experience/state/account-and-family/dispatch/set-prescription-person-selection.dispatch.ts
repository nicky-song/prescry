// Copyright 2022 Prescryptive Health, Inc.pharmacy

import { AccountAndFamilyDispatch } from './account-and-family.dispatch';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { setPrescriptionPersonSelectionAction } from '../actions/set-prescription-person-selection.action';
import { PrescriptionPersonSelection } from '../account-and-family.state';

export const setPrescriptionPersonSelectionDispatch = (
  dispatch: AccountAndFamilyDispatch,
  prescriptionPersonSelection: PrescriptionPersonSelection
): void => {
  guestExperienceCustomEventLogger(
    CustomAppInsightEvents.PRESCRIPTION_PERSON_SELECTED,
    prescriptionPersonSelection
  );
  dispatch(setPrescriptionPersonSelectionAction(prescriptionPersonSelection));
};
