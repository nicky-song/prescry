// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'mongoose';
import { setupDatabase } from './setup-database';
import { IModels, setupModels } from './setup-models';
import { ISchemas, setupSchemas } from './setup-schemas';

import { connectDatabaseWithCallback } from '../../../../utils/database-helper';

jest.mock('../../../../utils/database-helper', () => ({
  connectDatabaseWithCallback: jest.fn(),
}));

jest.mock('./setup-schemas', () => ({
  setupSchemas: jest.fn(),
}));

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

jest.mock('./setup-models', () => ({
  setupModels: jest.fn(),
}));

const setupSchemasMock = setupSchemas as jest.Mock;
const setupConnectMock = connect as jest.Mock;
const setupModelsMock = setupModels as jest.Mock;
const connectDatabaseWithCallbackMock =
  connectDatabaseWithCallback as jest.Mock;

beforeEach(() => {
  setupSchemasMock.mockReset();
  setupModelsMock.mockReset();
});

describe('setupDatabase()', () => {
  it('should call setupSchemas with the provided database instance and returns the result in the output', () => {
    const schemasMock = {} as ISchemas;
    setupSchemasMock.mockReturnValue(schemasMock);
    const result = setupDatabase();
    expect(setupSchemasMock).toHaveBeenCalled();
    expect(result).toMatchObject({
      Schemas: schemasMock,
    });
  });

  it('should call setupModels with schemas and returns the result in the output', () => {
    const schemasMock = {} as ISchemas;
    const modelsMock = {} as IModels;

    setupSchemasMock.mockReturnValue(schemasMock);
    setupModelsMock.mockReturnValue(modelsMock);

    const result = setupDatabase();
    expect(setupModelsMock).toHaveBeenNthCalledWith(1, schemasMock);

    expect(result).toMatchObject({
      Models: modelsMock,
      Schemas: schemasMock,
    });
  });

  it('should return connector that calls connectDatabaseWithCallback with expected arguments', () => {
    const schemasMock = {} as ISchemas;
    const modelsMock = {} as IModels;

    setupSchemasMock.mockReturnValue(schemasMock);
    setupModelsMock.mockReturnValue(modelsMock);
    const result = setupDatabase();

    expect(result).toMatchObject({
      Models: modelsMock,
      Schemas: schemasMock,
    });

    const options = {};
    const connectString = 'CONNECT_STRING';
    const connectPromise = new Promise(jest.fn());
    connectDatabaseWithCallbackMock.mockReturnValue(connectPromise);

    const connectResult = result.connect(connectString, options);

    expect(connectDatabaseWithCallbackMock).toHaveBeenNthCalledWith(
      1,
      connectString,
      setupConnectMock,
      options
    );
    expect(connectResult).toBe(connectPromise);
  });
});
