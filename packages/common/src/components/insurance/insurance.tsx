// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';
import { IInsuranceQuestion } from '../../models/insurance-question';
import { IQuestionAnswer } from '../../models/question-answer';
import { Heading } from '../member/heading/heading';
import { SurveyItem } from '../member/survey/survey-item/survey-item';
import { insuranceContent } from './insurance.content';
import { initializeInsuranceQuestions, updateAnswer } from './insurance.helper';
import {
  getAnswerAsString,
  getCurrentAnswer,
  resolveQuestionTypeAndIsRequired,
} from '../../utils/answer.helper';
import { insuranceStyles } from './insusrance.style';

export interface IInsuranceProps {
  insuranceChanged: (questionAnswers: IQuestionAnswer[]) => void;
}

export const Insurance = (props: IInsuranceProps): React.ReactElement => {
  const [questionsAnswers, setQuestionsAnswers] = useState(
    [] as IQuestionAnswer[]
  );
  const { insuranceChanged } = props;

  useEffect(() => {
    const initialQuestions: IInsuranceQuestion[] = [
      ...insuranceContent.questions,
      ...insuranceContent.policyHolderQuestions,
    ];
    const initialQuestionAnswers = initializeInsuranceQuestions(
      initialQuestions
    );
    setQuestionsAnswers(initialQuestionAnswers);
  }, []);

  useEffect(() => {
    insuranceChanged(questionsAnswers);
  }, [questionsAnswers]);

  const isPolicyHolderSelfOrUndefined = (): boolean => {
    const policyHolder = questionsAnswers.find(
      (questionAnswer) => questionAnswer.questionId === 'policyHolder'
    );
    return (
      !questionsAnswers.length ||
      !policyHolder ||
      policyHolder.answer === 'self'
    );
  };

  const onAnswerChange = (id: string, answer?: string | string[] | Date) => {
    const answerAsString = getAnswerAsString(answer);

    const updatedQuestionsAnswers = updateAnswer(
      questionsAnswers,
      id,
      answerAsString
    );
    setQuestionsAnswers(updatedQuestionsAnswers);
  };

  const renderQuestion = (question: IInsuranceQuestion): ReactNode => {
    const {
      id,
      markdownLabel,
      selectOptions,
      placeholder,
      description,
      validation,
    } = question;

    const { type, isRequired } = resolveQuestionTypeAndIsRequired(question);

    const answer = getCurrentAnswer(id, type, questionsAnswers);

    return (
      <SurveyItem
        key={id}
        id={id}
        type={type}
        question={markdownLabel}
        selectOptions={new Map<string, string>(selectOptions ?? [])}
        placeholder={placeholder}
        onAnswerChange={onAnswerChange}
        isRequired={isRequired}
        description={description}
        validation={validation}
        answer={answer}
        useCode={true}
      />
    );
  };

  const renderHeading = (
    <Heading level={2}>{insuranceContent.headingTitle}</Heading>
  );

  const renderQuestions = questionsAnswers.length
    ? insuranceContent.questions.map(renderQuestion)
    : null;

  const renderPolicyHolderQuestions = !isPolicyHolderSelfOrUndefined()
    ? insuranceContent.policyHolderQuestions.map(renderQuestion)
    : null;

  return (
    <View style={insuranceStyles.insuranceViewStyle}>
      {renderHeading}
      {renderQuestions}
      {renderPolicyHolderQuestions}
    </View>
  );
};
