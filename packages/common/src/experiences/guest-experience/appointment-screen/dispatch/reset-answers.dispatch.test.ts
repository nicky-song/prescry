// Copyright 2021 Prescryptive Health, Inc.

import { IQuestionAnswer } from '../../../../models/question-answer';
import { resetAnswersAction } from '../actions/reset-answers.action';
import {
  questionAnswer1Mock,
  questionAnswer2Mock,
  questionAnswer3Mock,
} from '../__mocks__/question-answer.mock';
import { resetAnswersDispatch } from './reset-answers.dispatch';

describe('resetAnswersDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const selectedMemberTypeMock = 1;
    const answersMock: IQuestionAnswer[] = [
      questionAnswer1Mock,
      questionAnswer2Mock,
      questionAnswer3Mock,
    ];

    resetAnswersDispatch(dispatchMock, selectedMemberTypeMock, answersMock);

    const expectedAction = resetAnswersAction(
      selectedMemberTypeMock,
      answersMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
