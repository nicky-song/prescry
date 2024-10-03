// Copyright 2021 Prescryptive Health, Inc.

import { openDrawerAction } from '../../side-menu/side-menu.reducer.actions';
import { navigateOpenSideMenuDispatch } from './navigate-open-sidemenu.dispatch';

describe('navigateOpenSideMenuDispatch', () => {
  it('dispatches open drawer action', () => {
    const dispatchMock = jest.fn();

    navigateOpenSideMenuDispatch(dispatchMock);

    const expectedAction = openDrawerAction();
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
