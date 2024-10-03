// Copyright 2022 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';

import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Heading } from '../member/heading/heading';
import { SurveyItem } from '../member/survey/survey-item/survey-item';
import { IQuestionAnswer } from '../../models/question-answer';
import { Insurance } from './insurance';
import { getChildren } from '../../testing/test.helper';
import { insuranceContent } from './insurance.content';
import { initializeInsuranceQuestions, updateAnswer } from './insurance.helper';
import { IInsuranceQuestion } from '../../models/insurance-question';
import {
  areRequiredQuestionsAnswered,
  getAnswerAsString,
  getCurrentAnswer,
  resolveQuestionTypeAndIsRequired,
} from '../../utils/answer.helper';

jest.mock('../member/survey/survey-item/survey-item', () => ({
  SurveyItem: () => null,
}));

jest.mock('../member/heading/heading', () => ({
  Heading: () => null,
}));

jest.mock('./insurance.helper');

const initializeInsuranceQuestionsMock =
  initializeInsuranceQuestions as jest.Mock;

const updateAnswerMock = updateAnswer as jest.Mock;

jest.mock('../../utils/answer.helper');

const getAnswerAsStringMock = getAnswerAsString as jest.Mock;

const getCurrentAnswerMock = getCurrentAnswer as jest.Mock;

const areRequiredQuestionsAnsweredMock =
  areRequiredQuestionsAnswered as jest.Mock;

const resolveQuestionTypeAndIsRequiredMock =
  resolveQuestionTypeAndIsRequired as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;
interface IStateCalls {
  questionsAnswers: [IQuestionAnswer[], jest.Mock];
}

function stateReset({
  questionsAnswers = [[] as IQuestionAnswer[], jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(questionsAnswers);
}

describe('Insurance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAnswerAsStringMock.mockReturnValue(undefined);
    getCurrentAnswerMock.mockReturnValue(undefined);
    areRequiredQuestionsAnsweredMock.mockReturnValue(true);
    resolveQuestionTypeAndIsRequiredMock.mockReturnValue({
      type: '',
      isRequired: false,
    });
    stateReset({});
  });

  it('renders in View with expected number of children components', () => {
    const insuranceChangedMock = jest.fn();
    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);

    expect(getChildren(container).length).toEqual(3);
  });

  it('has expected number of effect handlers', () => {
    const insuranceChangedMock = jest.fn();
    renderer.create(<Insurance insuranceChanged={insuranceChangedMock} />);

    expect(useEffectMock).toHaveBeenCalledTimes(2);
  });

  it('renders with default status and initializes questions', () => {
    const insuranceChangedMock = jest.fn();
    stateReset({ questionsAnswers: [[], jest.fn()] });
    renderer.create(<Insurance insuranceChanged={insuranceChangedMock} />);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    const initialQuestions: IInsuranceQuestion[] = [
      ...insuranceContent.questions,
      ...insuranceContent.policyHolderQuestions,
    ];

    expect(initializeInsuranceQuestions).toHaveBeenCalledWith(initialQuestions);
  });

  it('call insuranceChanged when state changes', () => {
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

    const insuranceChangedMock = jest.fn();

    stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });

    renderer.create(<Insurance insuranceChanged={insuranceChangedMock} />);

    initializeInsuranceQuestionsMock.mockReturnValue(currentAnswers);

    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
      currentAnswers,
    ]);

    const effectHandler = useEffectMock.mock.calls[1][0];
    effectHandler();

    expect(insuranceChangedMock).toHaveBeenCalledWith(currentAnswers);
  });

  it('renders Heading with expected heading text', () => {
    const insuranceChangedMock = jest.fn();
    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const view = testRenderer.root.findByType(View);

    const heading = view.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.children).toEqual(insuranceContent.headingTitle);
  });

  it('renders expected number of SurveyItem on initial state', () => {
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

    stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
    const insuranceChangedMock = jest.fn();
    getAnswerAsStringMock.mockReturnValue('self');
    getCurrentAnswerMock.mockReturnValue('self');
    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const view = testRenderer.root.findByType(View);

    const questionsSurveyItems = view.props.children[1] as ReactTestInstance[];

    const policyHolderSurveyItems = view.props
      .children[2] as ReactTestInstance[];

    expect(questionsSurveyItems[0].type).toEqual(SurveyItem);

    expect(questionsSurveyItems.length).toEqual(4);

    expect(policyHolderSurveyItems).toBe(null);
  });

  it('check the props of SurveyItems on initial state', () => {
    for (const [index, value] of insuranceContent.questions.entries()) {
      const id = value.id;
      if (id === 'policyHolder') {
        getAnswerAsStringMock.mockReturnValue('self');
        getCurrentAnswerMock.mockReturnValue('self');
      } else {
        getAnswerAsStringMock.mockReturnValue('');
        getCurrentAnswerMock.mockReturnValue('');
      }
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

      stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
      const insuranceChangedMock = jest.fn();

      const testRenderer = renderer.create(
        <Insurance insuranceChanged={insuranceChangedMock} />
      );

      const view = testRenderer.root.findByType(View);

      const questionsSurveyItems = view.props
        .children[1] as ReactTestInstance[];

      expect(questionsSurveyItems[index].props.id).toEqual(id);
      expect(questionsSurveyItems[index].props.question).toEqual(
        value.markdownLabel
      );
      expect(questionsSurveyItems[index].props.selectOptions).toEqual(
        new Map<string, string>(value.selectOptions ?? [])
      );
      expect(questionsSurveyItems[index].props.placeholder).toEqual(
        value.placeholder
      );
      expect(questionsSurveyItems[index].props.description).toEqual(
        value.description
      );
      expect(questionsSurveyItems[index].props.validation).toEqual(
        value.validation
      );
      expect(questionsSurveyItems[index].props.answer).toEqual(
        id === 'policyHolder' ? 'self' : ''
      );
      expect(questionsSurveyItems[index].props.useCode).toEqual(true);
    }
  });

  it('renders expected number of SurveyItem on specific state', () => {
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
        answer: 'spouse',
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

    stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
    const insuranceChangedMock = jest.fn();

    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const view = testRenderer.root.findByType(View);

    const questionsSurveyItems = view.props.children[1] as ReactTestInstance[];

    const policyHolderQuestionsSurveyItems = view.props
      .children[2] as ReactTestInstance[];

    expect(questionsSurveyItems[0].type).toEqual(SurveyItem);

    expect(questionsSurveyItems.length).toEqual(4);

    expect(policyHolderQuestionsSurveyItems.length).toEqual(3);
  });

  it('check the props of SurveyItems on specific state', () => {
    for (const [
      index,
      value,
    ] of insuranceContent.policyHolderQuestions.entries()) {
      const id = value.id;
      getAnswerAsStringMock.mockReturnValue('');
      getCurrentAnswerMock.mockReturnValue('');
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
          answer: 'spouse',
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

      stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
      const insuranceChangedMock = jest.fn();

      const testRenderer = renderer.create(
        <Insurance insuranceChanged={insuranceChangedMock} />
      );

      const view = testRenderer.root.findByType(View);

      const policyHolderQuestionsSurveyItems = view.props
        .children[2] as ReactTestInstance[];

      expect(policyHolderQuestionsSurveyItems[index].props.id).toEqual(id);
      expect(policyHolderQuestionsSurveyItems[index].props.question).toEqual(
        value.markdownLabel
      );
      expect(
        policyHolderQuestionsSurveyItems[index].props.selectOptions
      ).toEqual(new Map<string, string>(value.selectOptions ?? []));
      expect(policyHolderQuestionsSurveyItems[index].props.placeholder).toEqual(
        value.placeholder
      );
      expect(policyHolderQuestionsSurveyItems[index].props.description).toEqual(
        value.description
      );
      expect(policyHolderQuestionsSurveyItems[index].props.validation).toEqual(
        value.validation
      );
      expect(policyHolderQuestionsSurveyItems[index].props.answer).toEqual('');
      expect(policyHolderQuestionsSurveyItems[index].props.useCode).toEqual(
        true
      );
    }
  });

  it('update answer correctly', () => {
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
        answer: 'spouse',
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

    stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
    const insuranceChangedMock = jest.fn();

    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const view = testRenderer.root.findByType(View);

    const questionsSurveyItems = view.props.children[1] as ReactTestInstance[];

    const updatedQuestionsAnswers = currentAnswers;

    updatedQuestionsAnswers[0].answer = 'name-test';

    updateAnswerMock.mockReturnValue(updatedQuestionsAnswers);

    getAnswerAsStringMock.mockReturnValue('name-test');
    getCurrentAnswerMock.mockReturnValue('name-test');

    questionsSurveyItems[0].props.onAnswerChange('name', 'name-test');

    expect(getAnswerAsStringMock).toHaveBeenCalledWith('name-test');

    expect(questionsSurveyItems[0].type).toEqual(SurveyItem);

    expect(updateAnswer).toHaveBeenCalledWith(
      updatedQuestionsAnswers,
      'name',
      'name-test'
    );
  });

  it('getCurrentAnswer should return undefined if answer is undefined', () => {
    const currentAnswers = [
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
        answer: 'spouse',
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

    stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
    const insuranceChangedMock = jest.fn();

    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const view = testRenderer.root.findByType(View);

    const questionsSurveyItems = view.props.children[1] as ReactTestInstance[];

    getAnswerAsStringMock.mockReturnValue('');
    getCurrentAnswerMock.mockReturnValue(undefined);

    questionsSurveyItems[0].props.onAnswerChange('name', 'name-test');

    expect(questionsSurveyItems[0].props.answer).toEqual(undefined);
  });

  it('getAnswerAsString should return empty string if answer is undefined', () => {
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
        answer: 'spouse',
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

    stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
    const insuranceChangedMock = jest.fn();

    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const view = testRenderer.root.findByType(View);

    const questionsSurveyItems = view.props.children[1] as ReactTestInstance[];

    updateAnswerMock.mockReturnValue(currentAnswers);

    getAnswerAsStringMock.mockReturnValue('');
    getCurrentAnswerMock.mockReturnValue(undefined);

    questionsSurveyItems[0].props.onAnswerChange('name', undefined);

    expect(getAnswerAsStringMock).toHaveBeenCalledWith(undefined);

    expect(updateAnswer).toHaveBeenCalledWith(currentAnswers, 'name', '');
  });

  it('getAnswerAsString should transform string array to string if answer is an string array', () => {
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
        answer: 'spouse',
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

    stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
    const insuranceChangedMock = jest.fn();

    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const view = testRenderer.root.findByType(View);

    const questionsSurveyItems = view.props.children[1] as ReactTestInstance[];

    updateAnswerMock.mockReturnValue(currentAnswers);

    getAnswerAsStringMock.mockReturnValue('value1,value2');
    getCurrentAnswerMock.mockReturnValue('value1,value2');

    questionsSurveyItems[0].props.onAnswerChange('name', ['value1', 'value2']);

    expect(getAnswerAsStringMock).toHaveBeenCalledWith(['value1', 'value2']);

    expect(updateAnswer).toHaveBeenCalledWith(
      currentAnswers,
      'name',
      'value1,value2'
    );
  });

  it('getAnswerAsString should transform Date to string for policyHolderDOB answer', () => {
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
        answer: 'spouse',
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

    stateReset({ questionsAnswers: [currentAnswers, jest.fn()] });
    const insuranceChangedMock = jest.fn();

    const testRenderer = renderer.create(
      <Insurance insuranceChanged={insuranceChangedMock} />
    );

    const view = testRenderer.root.findByType(View);

    const policyHolderQuestionsSurveyItems = view.props
      .children[2] as ReactTestInstance[];

    const dateMock = new Date(2022, 1, 1);

    policyHolderQuestionsSurveyItems[2].props.onAnswerChange(
      'policyHolderDOB',
      dateMock
    );
  });
});
