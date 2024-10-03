// Copyright 2021 Prescryptive Health, Inc.

export interface IQuestionAnswer {
  questionId: string;
  questionText: string;
  answer: string;
  required?: boolean;
}
