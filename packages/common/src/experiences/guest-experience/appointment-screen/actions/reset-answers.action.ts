// Copyright 2021 Prescryptive Health, Inc.

import { IQuestionAnswer } from '../../../../models/question-answer';
import { IAppointmentScreenState } from '../appointment.screen.state';
import { IAppointmentScreenAction } from './appointment.screen.action';

export type IResetAnswersAction = IAppointmentScreenAction<'RESET_ANSWERS'>;

export const resetAnswersAction = (
  selectedMemberType: number,
  initialQuestionAnswers: IQuestionAnswer[]
): IResetAnswersAction => {
  const payload: Partial<IAppointmentScreenState> = {
    questionAnswers: initialQuestionAnswers,
    consentAccepted: false,
    selectedMemberType,
  };

  return {
    type: 'RESET_ANSWERS',
    payload,
  };
};
