// Copyright 2021 Prescryptive Health, Inc.

export interface IContactInfoContainerContent {
  sameAsPrimary: string;
  mobileNumberText: string;
  memberRxIDText: string;
  emailIdText: string;
  secondaryLabelText: string;
}

export const contactInfoContainerContent: IContactInfoContainerContent = {
  sameAsPrimary: 'Same as primary',
  mobileNumberText: 'Mobile #',
  memberRxIDText: 'Member ID',
  emailIdText: 'Email ID',
  secondaryLabelText: 'Secondary',
};
