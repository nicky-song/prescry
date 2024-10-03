// Copyright 2022 Prescryptive Health, Inc.

import { IInsuranceQuestion } from '../../models/insurance-question';
import { IQuestionAnswer } from '../../models/question-answer';
import { resolveQuestionTypeAndIsRequired } from '../../utils/answer.helper';

export const updateAnswer = (
  questions: IQuestionAnswer[],
  index: string,
  answer: string
): IQuestionAnswer[] => {
  return [...questions].map((next) =>
    next.questionId === index ? { ...next, answer } : next
  );
};

export const initializeInsuranceQuestions = (
  questions: IInsuranceQuestion[]
): IQuestionAnswer[] => {
  const pharmacyQuestions = questions.map(
    (question: IInsuranceQuestion): IQuestionAnswer => {
      const { isRequired } = resolveQuestionTypeAndIsRequired(question);
      return {
        questionId: question.id,
        questionText: question.markdownLabel,
        answer: question.id === 'policyHolder' ? 'self' : '',
        required: isRequired,
      };
    }
  );

  return pharmacyQuestions;
};
