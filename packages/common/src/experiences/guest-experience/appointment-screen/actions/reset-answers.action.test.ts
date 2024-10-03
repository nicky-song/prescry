// Copyright 2021 Prescryptive Health, Inc.

import { IQuestionAnswer } from '../../../../models/question-answer';
import { IAppointmentScreenState } from '../appointment.screen.state';
import {
  questionAnswer1Mock,
  questionAnswer2Mock,
  questionAnswer3Mock,
} from '../__mocks__/question-answer.mock';
import { resetAnswersAction } from './reset-answers.action';

describe('resetAnswersAction', () => {
  it('returns action', () => {
    const selectedMemberTypeMock = 1;
    const answersMock: IQuestionAnswer[] = [
      questionAnswer1Mock,
      questionAnswer2Mock,
      questionAnswer3Mock,
    ];
    const action = resetAnswersAction(selectedMemberTypeMock, answersMock);

    expect(action.type).toEqual('RESET_ANSWERS');

    const expectedPayload: Partial<IAppointmentScreenState> = {
      questionAnswers: answersMock,
      consentAccepted: false,
      selectedMemberType: selectedMemberTypeMock,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
