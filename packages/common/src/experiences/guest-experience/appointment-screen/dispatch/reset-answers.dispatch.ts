// Copyright 2021 Prescryptive Health, Inc.

import { IQuestionAnswer } from '../../../../models/question-answer';
import { resetAnswersAction } from '../actions/reset-answers.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const resetAnswersDispatch = (
  dispatch: AppointmentScreenDispatch,
  selectedMemberType: number,
  initialQuestionAnswers: IQuestionAnswer[]
) => dispatch(resetAnswersAction(selectedMemberType, initialQuestionAnswers));
