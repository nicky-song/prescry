// Copyright 2022 Prescryptive Health, Inc.

import { insuranceContent } from '../components/insurance/insurance.content';
import {
  areRequiredQuestionsAnswered,
  getAnswerAsString,
  getCurrentAnswer,
  mapAnswersToInsuranceInformation,
  resolveQuestionTypeAndIsRequired,
} from './answer.helper';

describe('getAnswerAsString', () => {
  it('should return empty string if no answer', () => {
    const expectedAnswer = getAnswerAsString();
    expect(expectedAnswer).toEqual('');
  });

  it('should transform string array to string if answer is string array', () => {
    const expectedAnswer = getAnswerAsString(['value1', 'value2']);
    expect(expectedAnswer).toEqual('value1,value2');
  });

  it('should return string if answer is typeof string', () => {
    const expectedAnswer = getAnswerAsString('test');
    expect(expectedAnswer).toEqual('test');
  });

  it('should transform Date to formatted date string answer', () => {
    const date = new Date(2022, 1, 1);
    const expectedAnswer = getAnswerAsString(date);
    expect(expectedAnswer).toEqual('2022-02-01');
  });
});

describe('getCurrentAnswer', () => {
  const currentAnswers = [
    {
      questionId: 'name',
      questionText: 'Medical insurance name',
      answer: '',
      required: true,
    },
    {
      questionId: 'policyHolder',
      questionText: 'Who is the policyholder?',
      answer: 'self',
      required: false,
    },
    {
      questionId: 'policyHolderDOB',
      questionText: 'Policy holder’s date of birth',
      answer: '2022-02-01',
      required: false,
    },
    {
      questionId: 'test',
      questionText: 'Policy holder’s date of birth',
      answer: 'value1,value2',
      required: false,
    },
  ];

  it('should return string answer if answer exist and is type text', () => {
    const expectedAnswer = getCurrentAnswer('name', 'text', currentAnswers);
    expect(expectedAnswer).toEqual('');
  });

  it('should return string answer if answer exist and is type single-select', () => {
    const expectedAnswer = getCurrentAnswer(
      'policyHolder',
      'single-select',
      currentAnswers
    );
    expect(expectedAnswer).toEqual('self');
  });

  it('should return array string formatted answer if answer exist and is type multi-select', () => {
    const expectedAnswer = getCurrentAnswer(
      'test',
      'multi-select',
      currentAnswers
    );
    expect(expectedAnswer).toEqual(['value1', 'value2']);
  });

  it('should return Date from iso string date if answer exist and is type datepicker', () => {
    const expectedAnswer = getCurrentAnswer(
      'policyHolderDOB',
      'datepicker',
      currentAnswers
    );
    expect(expectedAnswer).toEqual(new Date(2022, 1, 1));
  });
});

describe('mapAnswersToInsuranceInformation', () => {
  const currentAnswers = [
    {
      questionId: 'name',
      questionText: 'Medical insurance name',
      answer: 'name-test',
      required: true,
    },
    {
      questionId: 'memberId',
      questionText: 'Member ID',
      answer: 'member-id-test',
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

  it('should return insuranceQuestionAnswers object with expected values', () => {
    const expected = {
      groupId: '',
      memberId: 'member-id-test',
      name: 'name-test',
      policyHolder: 'self',
      policyHolderDOB: '',
      policyHolderFirstName: '',
      policyHolderLastName: '',
    };
    const result = mapAnswersToInsuranceInformation(currentAnswers);
    expect(result).toEqual(expected);
  });
});

describe('resolveQuestionTypeAndIsRequired', () => {
  it('should return type and isRequired with expected values', () => {
    const result = resolveQuestionTypeAndIsRequired(
      insuranceContent.questions[0]
    );
    const expected = {
      isRequired: true,
      type: 'text',
    };
    expect(result).toEqual(expected);
  });
});

describe('resolveQuestionTypeAndIsRequired', () => {
  const currentAnswers = [
    {
      questionId: 'name',
      questionText: 'Medical insurance name',
      answer: 'name-test',
      required: true,
    },
    {
      questionId: 'memberId',
      questionText: 'Member ID',
      answer: 'member-id-test',
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

  it('should return true if all required questions are answered', () => {
    const result = areRequiredQuestionsAnswered(currentAnswers, [
      ...insuranceContent.questions,
      ...insuranceContent.policyHolderQuestions,
    ]);
    expect(result).toEqual(true);
  });

  it('should return false if any of the required questions are unanswered', () => {
    const unansweredQuestions = currentAnswers;
    unansweredQuestions[0].answer = '';
    const result = areRequiredQuestionsAnswered(unansweredQuestions, [
      ...insuranceContent.questions,
      ...insuranceContent.policyHolderQuestions,
    ]);
    expect(result).toEqual(false);
  });
});
