// Copyright 2021 Prescryptive Health, Inc.

import { setMemberAddressAction } from './actions/set-member-address.action';
import { setAnswerAction } from './actions/set-answer.action';
import { appointmentScreenReducer } from './appointment.screen.reducer';
import { IAppointmentScreenState } from './appointment.screen.state';
import { memberAddressMock } from './__mocks__/member-address.mock';
import {
  questionAnswer1Mock,
  questionAnswer2Mock,
  questionAnswer3Mock,
} from './__mocks__/question-answer.mock';
import { IQuestionAnswer } from '../../../models/question-answer';

describe('appointmentScreenReducer', () => {
  it('reduces setAnswer action', () => {
    const serviceQuestionsAnswersMock: IQuestionAnswer[] = [
      questionAnswer1Mock,
      { ...questionAnswer2Mock, answer: 'no' },
      questionAnswer3Mock,
    ];
    const currentStateMock: IAppointmentScreenState = {
      selectedDate: true,
      selectedOnce: true,
      questionAnswers: serviceQuestionsAnswersMock,
      consentAccepted: true,
      selectedMemberType: 1,
      hasSlotExpired: false,
    };

    const answerMock = 'yes';
    const expectedState: IAppointmentScreenState = {
      ...currentStateMock,
      questionAnswers: [
        questionAnswer1Mock,
        { ...questionAnswer2Mock, answer: answerMock },
        questionAnswer3Mock,
      ],
    };

    const actionMock = setAnswerAction(
      questionAnswer2Mock.questionId,
      answerMock
    );

    expect(appointmentScreenReducer(currentStateMock, actionMock)).toEqual(
      expectedState
    );
  });

  it('reduces other actions', () => {
    const actionMock = setMemberAddressAction(memberAddressMock);
    const currentStateMock: IAppointmentScreenState = {
      selectedDate: true,
      selectedOnce: true,
      questionAnswers: [],
      consentAccepted: true,
      selectedMemberType: 1,
      hasSlotExpired: false,
    };

    const expectedState: IAppointmentScreenState = {
      ...currentStateMock,
      memberAddress: memberAddressMock,
    };

    expect(appointmentScreenReducer(currentStateMock, actionMock)).toEqual(
      expectedState
    );
  });
});
