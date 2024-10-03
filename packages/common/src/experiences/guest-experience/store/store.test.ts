// Copyright 2018 Prescryptive Health, Inc.

import { configureStore } from '../../../experiences/store/store';
import { buildGuestExperienceStore } from './store';

export const mockStore = { fakeStore: 'fakeStore' };
jest.mock('../../store/store', () => ({
  configureStore: jest.fn().mockReturnValue({ fakeStore: 'fakeStore' }),
}));
jest.mock('redux', () => ({
  combineReducers: jest.fn().mockReturnValue({ fakeReducers: 'fakeReducers' }),
}));

jest.mock('../guest-experience-logger.middleware', () => ({
  guestExperienceLogger: jest
    .fn()
    .mockReturnValue({ fakeMiddleware: 'fake-middleware' }),
}));
const configureStoreMock = configureStore as unknown as jest.Mock;

describe('store.test', () => {
  it('renders defaults', () => {
    expect(buildGuestExperienceStore).toBeDefined();
  });

  it('buildGuestExperienceStore should return mockStore', () => {
    expect(buildGuestExperienceStore()).toEqual(mockStore);
  });

  it('configureStoreMock should HaveBeenCalled', () => {
    expect(configureStoreMock).toHaveBeenCalledTimes(1);
  });

  it('configureStore called with', () => {
    expect(configureStoreMock).toHaveBeenCalledWith(
      {
        fakeReducers: 'fakeReducers',
      },
      {},
      [{ fakeMiddleware: 'fake-middleware' }]
    );
    expect(configureStoreMock).toHaveReturnedWith({ fakeStore: 'fakeStore' });
  });
});
