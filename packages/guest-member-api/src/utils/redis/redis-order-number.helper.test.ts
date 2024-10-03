// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { getNext, reset, getMax } from './redis-order-number.helper';
import { logEvent } from './redis.helper';

const incrByMock = jest.fn((_key: string, _increment: number, callBack) =>
  setTimeout(() => callBack('data'), 5)
);
const execMock = jest.fn((callback) => callback('data'));

jest.mock('./redis.helper');
jest.mock(
  '../../databases/mongo-database/v1/query-helper/appointment-event.query-helper'
);

const logEventMock = logEvent as jest.Mock;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getNext', () => {
  it.skip('TODO: initiates the first block of numbers', () => {
    // For some reason, it.todo() causes failure in Azure pipeline.
    // , async () => {
    // reset(1000, 2000, true);
    // expect(getMax()).toEqual(2000);
    // expect(await getNext(db, 1000)).toEqual('1001');
    // expect(logEventMock).toHaveBeenNthCalledWith(
    //   6,
    //   'REDIS_ORDERNUMBER_SETMAX',
    //   'info',
    //   JSON.stringify(1000)
    // );
    // expect(logEventMock).toHaveBeenNthCalledWith(
    //   7,
    //   'REDIS_ORDERNUMBER_SETCURRENT',
    //   'info',
    //   JSON.stringify(1001)
    // );
    // });
  });
  it.skip('TODO: initiates the next block of data when the max number is reached', () => {
    // For some reason, it.todo() causes failure in Azure pipeline.
  });
});

describe('reset', () => {
  it('resets to values provided', async () => {
    const db = {} as IDatabase;
    reset(100, 200, true);
    expect(getMax()).toEqual(200);
    expect(await getNext(db, 1000)).toEqual('101');
    reset(0, 1, true);
    expect(getMax()).toEqual(1);
    expect(await getNext(db, 1000)).toEqual('1');
    reset(1000, 2000, true);
    expect(getMax()).toEqual(2000);
    expect(logEventMock).toHaveBeenNthCalledWith(
      1,
      'REDIS_ORDERNUMBER_SETCURRENT',
      'info',
      JSON.stringify(100)
    );
    expect(logEventMock).toHaveBeenNthCalledWith(
      2,
      'REDIS_ORDERNUMBER_SETMAX',
      'info',
      JSON.stringify(200)
    );
    expect(logEventMock).toHaveBeenNthCalledWith(
      3,
      'REDIS_ORDERNUMBER_SETCURRENT',
      'info',
      JSON.stringify(101)
    );
    expect(logEventMock).toHaveBeenNthCalledWith(
      4,
      'REDIS_ORDERNUMBER_SETCURRENT',
      'info',
      JSON.stringify(0)
    );
    expect(logEventMock).toHaveBeenNthCalledWith(
      5,
      'REDIS_ORDERNUMBER_SETMAX',
      'info',
      JSON.stringify(1)
    );
    expect(logEventMock).toHaveBeenNthCalledWith(
      6,
      'REDIS_ORDERNUMBER_SETCURRENT',
      'info',
      JSON.stringify(1)
    );
  });
});

describe('getNext', () => {
  it('returns expected next value when starting value is known', async () => {
    const db = {} as IDatabase;
    reset(100, 200, true);
    expect(await getNext(db, 10)).toEqual('101');
    expect(logEventMock).toHaveBeenNthCalledWith(
      3,
      'REDIS_ORDERNUMBER_SETCURRENT',
      'info',
      JSON.stringify(101)
    );
    expect(await getNext(db, 10)).toEqual('102');
    expect(logEventMock).toHaveBeenNthCalledWith(
      4,
      'REDIS_ORDERNUMBER_SETCURRENT',
      'info',
      JSON.stringify(102)
    );
  });
});

describe('initiate', () => {
  const helper = jest.requireActual('./redis.helper');
  helper.redisClient = {
    multi: jest.fn().mockImplementation(() => {
      return {
        incrby: incrByMock,
        exec: execMock,
      };
    }),
  };
});
