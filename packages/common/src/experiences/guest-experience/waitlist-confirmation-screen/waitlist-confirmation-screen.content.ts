// Copyright 2021 Prescryptive Health, Inc.

export interface IWaitlistConfirmationScreenContent {
  addAnotherPersonLabel: string;
  confirmationTitle: string;
  confirmationSegment1Text: string;
  confirmationSegment2Text: string;
  confirmationSegment3Text: string;
  confirmationSegment4Text: string;
  confirmationSegment5Text: string;
  confirmationSegment6Text: string;
}

export const waitlistConfirmationScreenContent: IWaitlistConfirmationScreenContent =
  {
    addAnotherPersonLabel: 'Add another person',
    confirmationTitle: 'Waitlist confirmation',
    confirmationSegment1Text: 'We will text ',
    confirmationSegment2Text: ' at ',
    confirmationSegment3Text: ' when a spot for ',
    confirmationSegment4Text: ' becomes available.',
    confirmationSegment5Text:
      'The text message will include an invitation link for ',
    confirmationSegment6Text:
      ' to login to myPrescryptive and schedule an appointment.',
  };
