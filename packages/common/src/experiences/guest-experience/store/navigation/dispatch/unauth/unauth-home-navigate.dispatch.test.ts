// Copyright 2021 Prescryptive Health, Inc.

import { unauthHomeNavigateDispatch } from './unauth-home-navigate.dispatch';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

describe('unauthHomeNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call dispatchNavigateToScreen', () => {
    unauthHomeNavigateDispatch(rootStackNavigationMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'UnauthHome'
    );
  });
});
