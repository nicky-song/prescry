// Copyright 2021 Prescryptive Health, Inc.

import {
  contactInfoContainerContent,
  IContactInfoContainerContent,
} from './contact-info-container.content';

describe('contactInfoContainerContent', () => {
  it('has expected content', () => {
    const expectedContactInfoContainerContent: IContactInfoContainerContent = {
      sameAsPrimary: 'Same as primary',
      mobileNumberText: 'Mobile #',
      memberRxIDText: 'Member ID',
      emailIdText: 'Email ID',
      secondaryLabelText: 'Secondary',
    };

    expect(contactInfoContainerContent).toEqual(
      expectedContactInfoContainerContent
    );
  });
});
