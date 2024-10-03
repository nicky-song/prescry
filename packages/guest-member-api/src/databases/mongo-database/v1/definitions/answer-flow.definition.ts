// Copyright 2020 Prescryptive Health, Inc.

import { IAnswerFlow } from '@phx/common/src/models/static-questionnaire';
import { SchemaDefinition } from 'mongoose';

export const AnswerFlowDefinition = (): SchemaDefinition<IAnswerFlow> => ({
  answer: { type: String, required: true },
  nextQuestionId: { type: Number, required: true },
});
