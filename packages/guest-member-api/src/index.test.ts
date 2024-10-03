// Copyright 2018 Prescryptive Health, Inc.

import './index';
import { startServer } from './server';

jest.mock('./server', () => ({
  startServer: jest.fn().mockReturnValue({
    catch: jest.fn(),
  }),
}));

describe('index', () => {
  it('calls startServer', () => {
    expect(startServer).toBeCalledTimes(1);
  });
});
