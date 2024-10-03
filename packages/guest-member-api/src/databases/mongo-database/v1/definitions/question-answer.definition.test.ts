// Copyright 2020 Prescryptive Health, Inc.

import { QuestionAnswerDefinition } from './question-answer.definition';

describe('QuestionAnswerDefinition', () => {
  it('creates instance of SchemaDefinition<IServiceQuestionAnswer>', () => {
    const result = QuestionAnswerDefinition();
    expect(result).toMatchObject({
      questionId: { type: String, required: true },
      questionText: { type: String, required: true },
      answer: { type: String, required: true },
      required: { type: Boolean, required: false },
    });
  });
});
