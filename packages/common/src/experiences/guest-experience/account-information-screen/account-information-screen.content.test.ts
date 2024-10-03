// Copyright 2021 Prescryptive Health, Inc.

import {
  accountInformationScreenContent,
  IAccountInformationScreenContent,
} from './account-information-screen.content';

describe('accountInformationScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IAccountInformationScreenContent = {
      headerText: 'Manage my information',
      emailLabel: 'Email',
      dateOfBirthLabel: 'Date of birth',
      mobileLabel: 'Mobile',
      securityLabel: 'Security',
      pinLabel: 'Change your PIN',
      saveButtonText: 'Save',
      cancelButtonText: 'Cancel',
      invalidEmailErrorText: 'Please enter a valid email address',
      editEmailButtonIconAccessibilityLabel: 'Edit email',
      editPinButtonIconAccessibilityLabel: 'Edit PIN',
    };

    expect(accountInformationScreenContent).toEqual(expectedContent);
  });
});
