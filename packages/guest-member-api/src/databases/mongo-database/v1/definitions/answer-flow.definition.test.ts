// Copyright 2020 Prescryptive Health, Inc.

import { AnswerFlowDefinition } from './answer-flow.definition';

describe('AnswerFlowDefinition()', () => {
  it('creates instance of SchemaDefinition<IAnswerFlow>', () => {
    const result = AnswerFlowDefinition();
    expect(result).toMatchObject({
      answer: { type: String, required: true },
      nextQuestionId: { type: Number, required: true },
    });
  });
});
