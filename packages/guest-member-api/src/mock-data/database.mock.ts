// Copyright 2022 Prescryptive Health, Inc.

import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import { IModels } from '../databases/mongo-database/v1/setup/setup-models';
import { ISchemas } from '../databases/mongo-database/v1/setup/setup-schemas';

export const databaseMock: IDatabase = {
  Models: {} as IModels,
  Schemas: {} as ISchemas,
  connect: jest.fn().mockResolvedValue(undefined),
};
