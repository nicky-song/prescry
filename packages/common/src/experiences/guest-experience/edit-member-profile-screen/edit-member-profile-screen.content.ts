// Copyright 2021 Prescryptive Health, Inc.

export interface IEditMemberProfileScreenContent {
  errorMessage: string;
  memberDescription: string;
  mobileNumberDescription: string;
  noSecondaryLabel: string;
  pin: string;
  secondaryUserLabel: string;
  star: string;
  saveButtonLabel: string;
  emailPlaceHolderText: string;
  sameAsPrimary: string;
  mobileNumberText: string;
  memberIdText: string;
}

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

export const editMemberProfileScreenContent: IEditMemberProfileScreenContent = {
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
