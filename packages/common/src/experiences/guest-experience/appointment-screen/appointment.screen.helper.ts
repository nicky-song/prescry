// Copyright 2020 Prescryptive Health, Inc.

import { IServiceInfo } from '../../../models/api-response/provider-location-details-response';
import { IServiceQuestion } from '../../../models/provider-location';
import { IQuestionAnswer } from '../../../models/question-answer';

export function updateAnswer(
  questions: IQuestionAnswer[],
  index: string,
  answer: string
): IQuestionAnswer[] {
  return [...questions].map((next) =>
    next.questionId === index ? { ...next, answer } : next
  );
}

export function initializeAppointmentQuestions(
  service: IServiceInfo
): IQuestionAnswer[] {
  const pharmacyQuestions = service.questions.map(
    (question: IServiceQuestion): IQuestionAnswer => ({
      questionId: question.id,
      questionText: question.label,
      answer: '',
      required: question.isRequired,
    })
  );

  return pharmacyQuestions;
}
