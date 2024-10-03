// Copyright 2021 Prescryptive Health, Inc.

import {
  editMemberProfileScreenContent,
  IEditMemberProfileScreenContent,
} from './edit-member-profile-screen.content';

describe('editMemberProfileScreenContent', () => {
  it('has expected default constants', () => {
    const errorMessage = 'Please enter valid details';
    const memberDescription = 'Text messages will be sent to this member';
    const mobileNumberDescription = 'Text messages will be sent to this number';
    const noSecondaryLabel = '(No secondary)';
    const pin = 'PIN';
    const secondaryUserLabel = 'Secondary';
    const star = '****';
    const saveButtonLabel = 'Save';
    const emailPlaceHolderText = 'Email';
    const sameAsPrimary = 'Same as primary';
    const mobileNumberText = 'Mobile #';
    const memberIdText = 'Member ID: ';

    const expectedConstants: IEditMemberProfileScreenContent = {
      errorMessage,
      memberDescription,
      mobileNumberDescription,
      noSecondaryLabel,
      pin,
      secondaryUserLabel,
      star,
      saveButtonLabel,
      emailPlaceHolderText,
      sameAsPrimary,
      mobileNumberText,
      memberIdText,
    };

    expect(editMemberProfileScreenContent).toEqual(expectedConstants);
  });
});
