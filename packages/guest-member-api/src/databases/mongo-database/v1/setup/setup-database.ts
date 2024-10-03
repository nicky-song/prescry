// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'mongoose';
import {
  connectDatabaseWithCallback,
  DatabaseConnectPromiseConnector,
} from '../../../../utils/database-helper';
import { IModels, setupModels } from './setup-models';
import { ISchemas, setupSchemas } from './setup-schemas';

export interface IDatabase {
  connect: DatabaseConnectPromiseConnector;
  Models: IModels;
  Schemas: ISchemas;
}

export function setupDatabase(): IDatabase {
  const Schemas = setupSchemas();
  const Models = setupModels(Schemas);
  const connector: DatabaseConnectPromiseConnector = (
    connectionString: string,
    options: Record<string, unknown>
  ) => connectDatabaseWithCallback(connectionString, connect, options);

  const readyDb: IDatabase = {
    Models,
    Schemas,
    connect: connector,
  };
  return readyDb;
}
