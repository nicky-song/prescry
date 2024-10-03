// Copyright 2020 Prescryptive Health, Inc.

import { IQuestionAnswer } from '@phx/common/src/models/question-answer';
import { SchemaDefinition } from 'mongoose';

export const QuestionAnswerDefinition =
  (): SchemaDefinition<IQuestionAnswer> => ({
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    answer: { type: String, required: true },
    required: { type: Boolean, required: false },
  });
