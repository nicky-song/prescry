// Copyright 2020 Prescryptive Health, Inc.

export interface IAppointmentScreenContent {
  bookButtonCaption: string;
  continueButtonCaption: string;
  noSlotsAvailabilityError: string;
  noSlotsAvailabilityErrorForMaxDate: string;
  unfinishedQuestionsText: string;
  defaultValidation: string;
  questionsHeader: string;
  consentMarkdown: string;
  slotExpiredText: string;
  slotExpirationWarningText: string;
  mainLoadingMessageForChangeSlot: string;
}

export const appointmentScreenContent: IAppointmentScreenContent = {
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
  consentMarkdown: 'I accept [Consent, Authorization & Release of Claims]()',
  slotExpiredText:
    'Selected time slot has expired, please select another time.',
  slotExpirationWarningText:
    'You have 10 minutes to finish booking your appointment',
  mainLoadingMessageForChangeSlot: "We're securing your appointment time.",
};
