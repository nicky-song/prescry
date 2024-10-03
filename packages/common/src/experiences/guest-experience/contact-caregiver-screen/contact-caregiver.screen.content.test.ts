// Copyright 2022 Prescryptive Health, Inc.

import { contactCaregiverScreenContent } from './contact-caregiver.screen.content';

describe('supportScreenContent', () => {
  it('has expected content', () => {
    const expectedContent = {
      title: 'Contact your caregiver',
    };

    expect(contactCaregiverScreenContent).toEqual(expectedContent);
  });
});
