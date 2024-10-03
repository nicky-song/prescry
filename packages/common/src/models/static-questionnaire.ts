// Copyright 2020 Prescryptive Health, Inc.

export interface IStaticQuestionnaire {
  questionId: number;
  questionText: string;
  questionDescription?: string;
  questionOptions?: string[];
  questionAnswers?: IAnswerFlow[];
  inEligibleStep?: boolean;
  eligibleStep?: boolean;
  enabled: boolean;
  reason?: string;
}

export interface IAnswerFlow {
  answer: string;
  nextQuestionId: number;
}
