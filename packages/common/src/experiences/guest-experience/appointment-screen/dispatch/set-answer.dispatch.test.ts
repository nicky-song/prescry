// Copyright 2021 Prescryptive Health, Inc.

import { setAnswerAction } from '../actions/set-answer.action';
import { setAnswerDispatch } from './set-answer.dispatch';

describe('setAnswerDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const questionIdMock = 'question-id';
    const answerMock = 'answer';

    setAnswerDispatch(dispatchMock, questionIdMock, answerMock);

    const expectedAction = setAnswerAction(questionIdMock, answerMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
