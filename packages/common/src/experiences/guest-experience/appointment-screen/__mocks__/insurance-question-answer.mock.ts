// Copyright 2022 Prescryptive Health, Inc.

export const insuranceQuestionsMock = [
  {
    questionId: 'name',
    questionText: 'Medical insurance name',
    answer: '',
    required: true,
  },
  {
    questionId: 'memberId',
    questionText: 'Member ID',
    answer: '',
    required: true,
  },
  {
    questionId: 'groupId',
    questionText: 'Group ID (optional)',
    answer: '',
    required: false,
  },
  {
    questionId: 'policyHolder',
    questionText: 'Who is the policyholder?',
    answer: 'self',
    required: false,
  },
  {
    questionId: 'policyHolderFirstName',
    questionText: 'Policy holder’s first name',
    answer: '',
    required: false,
  },
  {
    questionId: 'policyHolderLastName',
    questionText: 'Policy holder’s last name',
    answer: '',
    required: false,
  },
  {
    questionId: 'policyHolderDOB',
    questionText: 'Policy holder’s date of birth',
    answer: '',
    required: false,
  },
];
