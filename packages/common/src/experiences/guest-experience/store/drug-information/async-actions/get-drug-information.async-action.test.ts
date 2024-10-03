// Copyright 2021 Prescryptive Health, Inc.

import { getDrugInformationDispatch } from '../dispatch/get-drug-information.dispatch';
import { getDrugInformationAsyncAction } from './get-drug-information.async-action';

jest.mock('../dispatch/get-drug-information.dispatch', () => ({
  getDrugInformationDispatch: jest.fn(),
}));
const getDrugInformationDispatchMock = getDrugInformationDispatch as jest.Mock;

const ndcMock = '0000001111';

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';
const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();

describe('getDrugInformationAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('requests getDrugInformationDispatch', async () => {
    const dispatchMock = jest.fn();
    const asyncAction = getDrugInformationAsyncAction(ndcMock);
    await asyncAction(dispatchMock, getStateMock);

    expect(getDrugInformationDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      ndcMock
    );
  });

  it('Does not dispatch error action on failure', async () => {
    const errorMock = Error('Boom!');
    getDrugInformationDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    const asyncAction = getDrugInformationAsyncAction();

    const result = await asyncAction(dispatchMock, getStateMock);
    expect(result).toBe(undefined);
  });
});
