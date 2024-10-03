// Copyright 2018 Prescryptive Health, Inc.

import { IFeaturesState } from '../../../guest-experience-features';
import {
  dispatchResetStackToFatalErrorScreen,
  resetStackToHome,
} from '../navigation-reducer.actions';
import { resetURLAfterNavigation } from '../navigation-reducer.helper';
import { navigateHomeScreenNoApiRefreshDispatch } from './navigate-home-screen-no-api-refresh.dispatch';
import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;
const resetStackToHomeMock = resetStackToHome as jest.Mock;

jest.mock('../../feed/dispatch/get-feed.dispatch');
jest.mock('../navigation-reducer.helper');
const resetURLAfterNavigationMock = resetURLAfterNavigation as jest.Mock;
const featuresMock: IFeaturesState = {
  usesieprice: false,
} as IFeaturesState;
const reduxStateMock = { features: featuresMock };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('navigateHomeScreenNoApiRefreshDispatch', () => {
  it('dispatches to home screen', () => {
    const getState = jest.fn().mockReturnValue(reduxStateMock);

    navigateHomeScreenNoApiRefreshDispatch(getState, rootStackNavigationMock);
    expect(resetStackToHomeMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      undefined
    );
    expect(resetURLAfterNavigationMock).toHaveBeenCalledWith(featuresMock);
    expect(dispatchResetStackToFatalErrorScreenMock).not.toHaveBeenCalled();
  });

  it('dispatches to fatal screen if error', () => {
    const getStateMock = jest.fn().mockReturnValue(reduxStateMock);

    const errorMock: Error = new Error('error');

    (resetURLAfterNavigation as jest.Mock).mockImplementation(() => {
      throw errorMock;
    });

    navigateHomeScreenNoApiRefreshDispatch(
      getStateMock,
      rootStackNavigationMock
    );
    expect(dispatchResetStackToFatalErrorScreen).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock
    );
  });
});
