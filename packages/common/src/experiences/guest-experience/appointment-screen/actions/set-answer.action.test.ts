// Copyright 2021 Prescryptive Health, Inc.

import { ISetAnswerPayload, setAnswerAction } from './set-answer.action';

describe('setAnswerAction', () => {
  it('returns action', () => {
    const questionIdMock = 'question-id';
    const answerMock = 'answer';
    const action = setAnswerAction(questionIdMock, answerMock);

    expect(action.type).toEqual('SET_ANSWER');

    const expectedPayload: ISetAnswerPayload = {
      questionId: questionIdMock,
      answer: answerMock,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
