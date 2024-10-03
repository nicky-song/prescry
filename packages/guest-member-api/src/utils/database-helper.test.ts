// Copyright 2018 Prescryptive Health, Inc.

import { connectDatabaseWithCallback } from './database-helper';

const OLD_ENV = process.env;

const mongooseConnectorMock = jest.fn();

beforeEach(() => {
  jest.resetModules(); // this is important
  mongooseConnectorMock.mockReset();
  process.env = { ...OLD_ENV };
});

afterEach(() => {
  process.env = OLD_ENV;
});

describe('connectMongoDb', () => {
  it('should throw if internal promise callback is executed with an error message (aka connection failed)', () => {
    expect.assertions(2);

    const promise = connectDatabaseWithCallback(
      'NOTMISSING',
      mongooseConnectorMock,
      {}
    );
    expect(mongooseConnectorMock).toBeCalledTimes(1);
    const promiseCallback = mongooseConnectorMock.mock.calls[0][2] as (
      error?: Error
    ) => void;

    const mockError = new Error('error occurred');
    promiseCallback(mockError);

    promise.catch((e) => expect(e).toBe(mockError));
  });

  it('should not throw if internal callback is executed without an error message (aka connection succeeded)', async () => {
    expect.assertions(1);

    const promise = connectDatabaseWithCallback(
      'NOTMISSING',
      mongooseConnectorMock,
      {}
    );
    expect(mongooseConnectorMock).toBeCalledTimes(1);
    const promiseCallback = mongooseConnectorMock.mock.calls[0][2] as (
      error?: Error
    ) => void;

    promiseCallback();
    await promise;
  });

  it('should pass DATABASE_CONNECTION to mongoose.connect', async () => {
    const promise = connectDatabaseWithCallback(
      'NOTMISSING',
      mongooseConnectorMock,
      {}
    );
    const promiseCallback = mongooseConnectorMock.mock.calls[0][2] as (
      error?: Error
    ) => void;
    promiseCallback();

    await promise;

    expect(mongooseConnectorMock).toBeCalledTimes(1);
    expect(mongooseConnectorMock.mock.calls[0][0]).toBe('NOTMISSING');
  });
});
