// Copyright 2021 Prescryptive Health, Inc.

export interface IAccountInformationScreenContent {
  headerText: string;
  emailLabel: string;
  dateOfBirthLabel: string;
  mobileLabel: string;
  securityLabel: string;
  pinLabel: string;
  saveButtonText: string;
  cancelButtonText: string;
  invalidEmailErrorText: string;
  editEmailButtonIconAccessibilityLabel: string;
  editPinButtonIconAccessibilityLabel: string;
}

export const accountInformationScreenContent: IAccountInformationScreenContent =
  {
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
