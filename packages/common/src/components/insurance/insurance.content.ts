// Copyright 2022 Prescryptive Health, Inc.

import { IInsuranceQuestion } from '../../models/insurance-question';

export interface IInsuranceContent {
  headingTitle: string;
  questions: IInsuranceQuestion[];
  policyHolderQuestions: IInsuranceQuestion[];
}

export const insuranceContent: IInsuranceContent = {
  headingTitle:
    'Please enter the patient’s medical insurance details below to verify active coverage.',
  questions: [
    {
      id: 'name',
      label: 'Medical insurance name',
      markdownLabel: '**Medical insurance name**',
      placeholder: 'Enter medical insurance company name',
    },
    {
      id: 'memberId',
      label: 'Member ID',
      markdownLabel: '**Member ID**',
      placeholder: 'Enter member or subscriber ID number',
    },
    {
      id: 'groupId',
      label: 'Group ID (optional)',
      markdownLabel: '**Group ID (optional)**',
      placeholder: 'Enter group ID number',
    },
    {
      id: 'policyHolder',
      label: 'Who is the policyholder?',
      markdownLabel: '**Who is the policyholder?**',
      selectOptions: [
        ['self', 'Self'],
        ['spouse', 'Spouse'],
        ['child', 'Child'],
        ['otherAdult', 'Other adult'],
        ['unspecifiedDependant', 'Unspecified dependant'],
      ],
    },
  ],
  policyHolderQuestions: [
    {
      id: 'policyHolderFirstName',
      label: 'Policy holder’s first name',
      markdownLabel: '**Policy holder’s first name**',
      placeholder: 'Enter first name',
    },
    {
      id: 'policyHolderLastName',
      label: 'Policy holder’s last name',
      markdownLabel: '**Policy holder’s last name**',
      placeholder: 'Enter last name',
    },
    {
      id: 'policyHolderDOB',
      label: 'Policy holder’s date of birth',
      markdownLabel: '**Policy holder’s date of birth**',
    },
  ],
};
