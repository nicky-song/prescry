// Copyright 2020 Prescryptive Health, Inc.

import { StaticQuestionnaireDefinition } from './static-questionnaire.definition';
import { Schema } from 'mongoose';

describe('StaticQuestionnaireDefinition()', () => {
  it('creates instance of SchemaDefinition<IStaticQuestionnaire>', () => {
    const answerFlowSchema = {} as Schema;
    const result = StaticQuestionnaireDefinition(answerFlowSchema);
    expect(result).toMatchObject({
      questionId: { required: true, type: Number },
      questionText: { required: true, type: String },
      questionDescription: { required: false, type: String },
      questionOptions: { required: false, type: [String] },
      questionAnswers: { required: false, type: [answerFlowSchema] },
      enabled: { required: true, type: Boolean },
      inEligibleStep: { required: false, type: Boolean },
      eligibleStep: { required: false, type: Boolean },
      reason: { required: false, type: String },
    });
  });
});
