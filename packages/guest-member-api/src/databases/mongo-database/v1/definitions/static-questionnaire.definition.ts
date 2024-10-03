// Copyright 2020 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IStaticQuestionnaire } from '@phx/common/src/models/static-questionnaire';

export const StaticQuestionnaireDefinition = (
  answerFlow: Schema
): SchemaDefinition<IStaticQuestionnaire> => ({
  questionId: { required: true, type: Number },
  questionText: { required: true, type: String },
  questionDescription: { required: false, type: String },
  questionOptions: { required: false, type: [String] },
  questionAnswers: { required: false, type: [answerFlow] },
  enabled: { required: true, type: Boolean },
  inEligibleStep: { required: false, type: Boolean },
  eligibleStep: { required: false, type: Boolean },
  reason: { required: false, type: String },
});
