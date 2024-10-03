// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { View } from 'react-native';
import { faqStyles as styles } from './faq.style';
import { faqContent as content } from './faq.content';
import { FAQ, IQuestionAnswerPair } from './faq';

jest.mock('./question-answer-pair', () => {
  return {
    QuestionAnswerPair: () => {
      return <View />;
    },
    IQuestionAnswerPairProps: () => {
      return {};
    },
  };
});

const mockCardOne: IQuestionAnswerPair = {
  question: 'Why was the JavaScript developer sad?',
  answer: "Because he didn't Node how to Express himself.",
};

const mockCardTwo: IQuestionAnswerPair = {
  question: 'Why did the developer go broke?',
  answer: 'Because he used up all his cache.',
};

const mockData: IQuestionAnswerPair[] = [mockCardOne, mockCardTwo];

describe('FAQ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render title as expected', () => {
    const testRenderer = renderer.create(
      <FAQ questionAnswerPairs={mockData} />
    );
    const view = testRenderer.root.findByType(View);
    const titleView = view.props.children[0];
    expect(titleView.props.style).toEqual(styles.titleViewStyle);
    const titleText = titleView.props.children;
    expect(titleText.props.style).toEqual(styles.titleTextStyle);
    const titleChild = titleText.props.children;
    expect(titleChild).toEqual(content.title);
  });
  it('should render QuestionAnswerPair as expected', () => {
    const testRenderer = renderer.create(
      <FAQ questionAnswerPairs={mockData} />
    );
    const view = testRenderer.root.findByType(View);
    const questionAnswerPairView = view.props.children[1];
    expect(questionAnswerPairView[0].props.question).toEqual(
      mockCardOne.question
    );
    expect(questionAnswerPairView[0].props.isLast).toEqual(false);
    expect(questionAnswerPairView[1].props.answer).toEqual(mockCardTwo.answer);
    expect(questionAnswerPairView[1].props.isLast).toEqual(true);
  });
});
