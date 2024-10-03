// Copyright 2021 Prescryptive Health, Inc.

import {
  IWaitlistConfirmationScreenContent,
  waitlistConfirmationScreenContent,
} from './waitlist-confirmation-screen.content';

describe('WaitlistConfirmationScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IWaitlistConfirmationScreenContent = {
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

    expect(waitlistConfirmationScreenContent).toEqual(expectedContent);
  });
});
