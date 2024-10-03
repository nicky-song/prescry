// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { FontSize, PurpleScale } from '../../../theming/theme';
import { faqStyles as styles } from './faq.style';
import {
  QuestionAnswerPair,
  IQuestionAnswerPairProps,
} from './question-answer-pair';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

interface IStateCalls {
  isExpanded: [boolean, jest.Mock];
}

const stateReset = ({
  isExpanded = [false, jest.fn()],
}: Partial<IStateCalls>) => {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(isExpanded);
};

const mockCard: IQuestionAnswerPairProps = {
  question: 'Why was the JavaScript developer sad?',
  answer: "Because he didn't Node how to Express himself.",
  isLast: false,
};

const mockLastCard: IQuestionAnswerPairProps = {
  question: 'Why was the JavaScript developer sad?',
  answer: "Because he didn't Node how to Express himself.",
  isLast: true,
};

describe('QuestionAnswerPair', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stateReset({});
  });

  it('renders elements as expected (default)', () => {
    const testRenderer = renderer.create(<QuestionAnswerPair {...mockCard} />);
    const view = testRenderer.root.findByType(View);
    expect(view.props.style).toEqual(styles.questionAnswerViewStyle);
    const questionView = view.props.children[0];
    expect(questionView.props.style).toEqual(styles.questionViewStyle);
    const questionText = questionView.props.children[0];
    expect(questionText.props.style).toEqual(styles.questionTextStyle);
    expect(questionText.props.children).toEqual(mockCard.question);
    const arrowButton = questionView.props.children[1];
    expect(arrowButton.props.viewStyle).toEqual(styles.arrowViewStyle);
    expect(arrowButton.props.onPress).not.toBeNull();
    const icon = arrowButton.props.children;
    expect(icon.props.name).toEqual('chevron-up');
    expect(icon.props.size).toEqual(FontSize.regular);
    expect(icon.props.color).toEqual(PurpleScale.darkest);
  });
  it('renders elements as expected (onPress)', () => {
    stateReset({ isExpanded: [true, jest.fn()] });
    const testRenderer = renderer.create(<QuestionAnswerPair {...mockCard} />);
    const view = testRenderer.root.findByType(View);
    expect(view.props.style).toEqual(styles.questionAnswerViewStyle);
    const questionView = view.props.children[0];
    expect(questionView.props.style).toEqual(styles.questionViewStyle);
    const questionText = questionView.props.children[0];
    expect(questionText.props.style).toEqual(styles.questionTextStyle);
    expect(questionText.props.children).toEqual(mockCard.question);
    const arrowButton = questionView.props.children[1];
    expect(arrowButton.props.viewStyle).toEqual(styles.arrowViewStyle);
    expect(arrowButton.props.onPress).not.toBeNull();
    const icon = arrowButton.props.children;
    expect(icon.props.name).toEqual('chevron-down');
    expect(icon.props.size).toEqual(FontSize.regular);
    expect(icon.props.color).toEqual(PurpleScale.darkest);
    const answerView = view.props.children[1];
    expect(answerView.props.style).toEqual(styles.answerViewStyle);
    const answerText = answerView.props.children;
    expect(answerText.props.children).toEqual(mockCard.answer);
  });
  it('renders elements as expected (isLast)', () => {
    const testRenderer = renderer.create(
      <QuestionAnswerPair {...mockLastCard} />
    );
    const view = testRenderer.root.findByType(View);
    expect(view.props.style).toEqual(styles.lastQuestionAnswerViewStyle);
  });
});
