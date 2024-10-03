// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';

export const searchQuestionnaireByQuestionId = (
  database: IDatabase,
  questionId: number
) =>
  database.Models.StaticQuestionnaireModel.findOne({
    questionId,
    enabled: true,
  });
