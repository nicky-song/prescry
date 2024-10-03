// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentScreenAction } from './appointment.screen.action';

export interface ISetAnswerPayload {
  questionId: string;
  answer: string;
}

export type ISetAnswerAction = IAppointmentScreenAction<
  'SET_ANSWER',
  ISetAnswerPayload
>;

export const setAnswerAction = (
  questionId: string,
  answer: string
): ISetAnswerAction => {
  const payload: ISetAnswerPayload = {
    questionId,
    answer,
  };

  return {
    type: 'SET_ANSWER',
    payload,
  };
};
