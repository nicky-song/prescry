// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import { searchQuestionnaireByQuestionId } from './questionnaire-collection.query-helper';

const findOneMock = jest.fn();
const databaseMock = {
  Models: {
    StaticQuestionnaireModel: {
      findOne: findOneMock,
    },
  },
} as unknown as IDatabase;

describe('searchQuestionnaireByQuestionId', () => {
  const questionId = 2;
  it('should call findOne() with required params', async () => {
    await searchQuestionnaireByQuestionId(databaseMock, questionId);
    expect(findOneMock).toHaveBeenNthCalledWith(1, {
      questionId: 2,
      enabled: true,
    });
  });
});
