// Copyright 2021 Prescryptive Health, Inc.

import { setAnswerAction } from '../actions/set-answer.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const setAnswerDispatch = (
  dispatch: AppointmentScreenDispatch,
  questionId: string,
  answer: string
) => dispatch(setAnswerAction(questionId, answer));
