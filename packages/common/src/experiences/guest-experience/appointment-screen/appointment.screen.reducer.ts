// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { AppointmentScreenAction } from './actions/appointment.screen.action';
import { ISetAnswerPayload } from './actions/set-answer.action';
import { updateAnswer } from './appointment.screen.helper';
import { IAppointmentScreenState } from './appointment.screen.state';

export const appointmentScreenReducer: Reducer<
  IAppointmentScreenState,
  AppointmentScreenAction
> = (state, action): IAppointmentScreenState => {
  switch (action.type) {
    case 'SET_ANSWER': {
      const { questionId, answer } = action.payload as ISetAnswerPayload;
      const updatedAnswers = updateAnswer(
        state.questionAnswers,
        questionId,
        answer
      );
      return { ...state, questionAnswers: updatedAnswers };
    }

    default: {
      const payload = action.payload as Partial<IAppointmentScreenState>;
      return { ...state, ...payload };
    }
  }
};
