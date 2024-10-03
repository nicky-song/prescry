// Copyright 2018 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { startExperienceDispatch } from '../dispatch/start-experience.dispatch';
import { startExperienceAsyncAction } from './start-experience.async-action';

jest.mock('../dispatch/start-experience.dispatch');
const startExperienceDispatchMock = startExperienceDispatch as jest.Mock;

describe('startExperienceAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([[undefined], [false], [true]])(
    'requests start experience dispatch (isUnauthExperience: %p)',
    async (isUnauthExperienceMock: undefined | boolean) => {
      const dispatchMock = jest.fn();
      const getStateMock = jest.fn();

      const asyncAction = startExperienceAsyncAction(
        rootStackNavigationMock,
        isUnauthExperienceMock
      );
      await asyncAction(dispatchMock, getStateMock);

      expect(startExperienceDispatchMock).toHaveBeenCalledWith(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        isUnauthExperienceMock
      );
    }
  );
});
