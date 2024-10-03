// Copyright 2020 Prescryptive Health, Inc.

import {
  appointmentScreenContent,
  IAppointmentScreenContent,
} from './appointment.screen.content';

describe('appointmentScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IAppointmentScreenContent = {
      bookButtonCaption: 'Book',
      continueButtonCaption: 'Continue',
      noSlotsAvailabilityError:
        'There are no appointments available for current month. Please choose next month',
      noSlotsAvailabilityErrorForMaxDate:
        'There are currently no appointments available. Please choose another location',
      unfinishedQuestionsText: 'Please answer all questions to continue',
      defaultValidation: '^.{2,}$',
      questionsHeader:
        'Answer the following questions for the person this appointment is for',
      consentMarkdown:
        'I accept [Consent, Authorization & Release of Claims]()',
      slotExpiredText:
        'Selected time slot has expired, please select another time.',
      slotExpirationWarningText:
        'You have 10 minutes to finish booking your appointment',
      mainLoadingMessageForChangeSlot: "We're securing your appointment time.",
    };

    expect(appointmentScreenContent).toEqual(expectedContent);
  });
});
