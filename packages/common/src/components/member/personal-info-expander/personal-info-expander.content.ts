// Copyright 2020 Prescryptive Health, Inc.

export interface IPersonalInfoExpanderContent {
  headerText: string;
  name: string;
  dateOfBirth: string;
}

export const personalInfoExpanderContent: IPersonalInfoExpanderContent = {
  headerText: 'Personal Information',
  name: 'Name:',
  dateOfBirth: 'DOB:',
};
