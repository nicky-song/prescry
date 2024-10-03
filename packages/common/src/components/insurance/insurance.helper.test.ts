// Copyright 2022 Prescryptive Health, Inc.

import { IInsuranceQuestion } from '../../models/insurance-question';
import { resolveQuestionTypeAndIsRequired } from '../../utils/answer.helper';
import { insuranceContent } from './insurance.content';
import { initializeInsuranceQuestions, updateAnswer } from './insurance.helper';

jest.mock('../../utils/answer.helper');
const resolveQuestionTypeAndIsRequiredMock = resolveQuestionTypeAndIsRequired as jest.Mock;

describe('initializeInsuranceQuestions ', () => {
  it('Create initial questions based on selected location', () => {
    resolveQuestionTypeAndIsRequiredMock.mockReturnValue({
      type: '',
      isRequired: false,
    });
    const questions: IInsuranceQuestion[] = [
      ...insuranceContent.questions,
      ...insuranceContent.policyHolderQuestions,
    ];

    const expectedState = [
      {
        questionId: 'name',
        questionText: '**Medical insurance name**',
        answer: '',
        required: false,
      },
      {
        questionId: 'memberId',
        questionText: '**Member ID**',
        answer: '',
        required: false,
      },
      {
        questionId: 'groupId',
        questionText: '**Group ID (optional)**',
        answer: '',
        required: false,
      },
      {
        questionId: 'policyHolder',
        questionText: '**Who is the policyholder?**',
        answer: 'self',
        required: false,
      },
      {
        questionId: 'policyHolderFirstName',
        questionText: '**Policy holder’s first name**',
        answer: '',
        required: false,
      },
      {
        questionId: 'policyHolderLastName',
        questionText: '**Policy holder’s last name**',
        answer: '',
        required: false,
      },
      {
        questionId: 'policyHolderDOB',
        questionText: '**Policy holder’s date of birth**',
        answer: '',
        required: false,
      },
    ];
    expect(initializeInsuranceQuestions(questions)).toEqual(expectedState);
  });
});

describe('updateAnswer ', () => {
  it('update answer for the index', () => {
    const currentAnswers = [
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

    const expectedState = [
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
        answer: 'policy-holder-first-name-test',
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
    expect(
      updateAnswer(
        currentAnswers,
        'policyHolderFirstName',
        'policy-holder-first-name-test'
      )
    ).toEqual(expectedState);
  });
});
