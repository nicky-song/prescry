// Copyright 2020 Prescryptive Health, Inc.

import { IServiceQuestion } from '@phx/common/src/models/provider-location';
import { IQuestionAnswer } from '@phx/common/src/models/question-answer';

export function allRequiredQuestionsAnswered(
  questions: IServiceQuestion[],
  answers: IQuestionAnswer[]
) {
  const missingRequiredAnswers = questions.filter(
    (x) =>
      x.isRequired &&
      !answers.find(
        (y) => y.questionId === x.id && (y.answer || '').trim().length > 0
      )
  );
  return missingRequiredAnswers.length === 0;
}
