// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { HeadingText } from '../../primitives/heading-text';
import {
  QuestionAnswerPair,
  IQuestionAnswerPairProps,
} from './question-answer-pair';
import { faqStyles as styles } from './faq.style';
import { faqContent as content } from './faq.content';

export interface IQuestionAnswerPair {
  question: string;
  answer: string;
}

export interface IFAQProps {
  questionAnswerPairs: IQuestionAnswerPair[];
}

export const FAQ = (props: IFAQProps) => {
  return (
    <View>
      <View style={styles.titleViewStyle}>
        <HeadingText style={styles.titleTextStyle}>{content.title}</HeadingText>
      </View>
      {props.questionAnswerPairs.map(
        (
          questionAnswerPair: IQuestionAnswerPair,
          index: number,
          array: IQuestionAnswerPair[]
        ) => {
          const questionAnswerPairProps: IQuestionAnswerPairProps = {
            question: questionAnswerPair.question,
            answer: questionAnswerPair.answer,
            isLast: index === array.length - 1,
          };
          return (
            <QuestionAnswerPair
              key={questionAnswerPair.question}
              {...questionAnswerPairProps}
            />
          );
        }
      )}
    </View>
  );
};
