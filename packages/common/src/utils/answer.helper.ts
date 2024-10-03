// Copyright 2022 Prescryptive Health, Inc.

import { IQuestionAnswer } from '../models/question-answer';
import { SurveyAnswerType } from '../models/survey-questions';
import DateFormatter from './formatters/date.formatter';
import { dateFromISOString } from './date-time-helper';
import { IInsuranceQuestion } from '../models/insurance-question';
import { IServiceQuestion } from '../models/provider-location';
import { appointmentScreenContent } from '../experiences/guest-experience/appointment-screen/appointment.screen.content';
import { IInsuranceQuestionAnswers } from '../models/insurance-question-answers';

export const getAnswerAsString = (
  answer?: string | string[] | Date
): string => {
  if (!answer) {
    return '';
  }

  if (Array.isArray(answer)) {
    return answer.join(',');
  }

  if (answer instanceof Date) {
    return `${DateFormatter.formatToYMD(answer)}`;
  }

  return answer;
};

export const getCurrentAnswer = (
  questionId: string,
  answerType: SurveyAnswerType,
  questionsAnswers: IQuestionAnswer[]
): string | string[] | Date | undefined => {
  const foundAnswer = questionsAnswers.find(
    (questionAnswer) => questionAnswer.questionId === questionId
  );

  if (!foundAnswer) {
    return undefined;
  }

  const { answer } = foundAnswer;

  switch (answerType) {
    case 'text':
    case 'single-select':
      return answer;

    case 'multi-select':
      return answer ? answer.split(',') : undefined;

    case 'datepicker':
      return dateFromISOString(answer);
  }
};

export const areRequiredQuestionsAnswered = (
  questionAnswers: IQuestionAnswer[],
  questions: IInsuranceQuestion[] | IServiceQuestion[]
): boolean => {
  const unanswered = questionAnswers.filter(
    (question) =>
      question.required &&
      (!question.answer ||
        !new RegExp(validationRegEx(question.questionId, questions)).test(
          question.answer
        ))
  );
  return unanswered.length === 0;
};

export const validationRegEx = (
  questionId: string,
  questions: IInsuranceQuestion[] | IServiceQuestion[]
): string => {
  const foundQuestion = questions.find(
    (question) => question.id === questionId
  );
  return (
    foundQuestion?.validation ?? appointmentScreenContent.defaultValidation
  );
};

export const resolveQuestionTypeAndIsRequired = (
  question: IInsuranceQuestion
): { type: SurveyAnswerType; isRequired: boolean } => {
  const result: { type: SurveyAnswerType; isRequired: boolean } = {
    type: 'text',
    isRequired: false,
  };
  switch (question.id) {
    case 'name':
    case 'memberId':
      result.type = 'text';
      result.isRequired = true;
      break;
    case 'groupId':
    case 'policyId':
    case 'policyHolderFirstName':
    case 'policyHolderLastName':
      result.type = 'text';
      result.isRequired = false;
      break;
    case 'policyHolder':
      result.type = 'single-select';
      result.isRequired = false;
      break;
    case 'policyHolderDOB':
      result.type = 'datepicker';
      result.isRequired = false;
      break;
  }
  return result;
};

export const mapAnswersToInsuranceInformation = (
  questionsAnswers: IQuestionAnswer[]
): IInsuranceQuestionAnswers => {
  return questionsAnswers.reduce(
    (insuranceInformation, question) => ({
      ...insuranceInformation,
      [question.questionId]: question.answer,
    }),
    {} as IInsuranceQuestionAnswers
  );
};
