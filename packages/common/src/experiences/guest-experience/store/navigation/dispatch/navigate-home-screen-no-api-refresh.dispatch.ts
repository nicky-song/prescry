// Copyright 2018 Prescryptive Health, Inc.

import { IFeaturesState } from '../../../guest-experience-features';
import { IHomeScreenRouteProps } from '../../../home-screen/home-screen';
import { RootState } from '../../root-reducer';
import {
  dispatchResetStackToFatalErrorScreen,
  resetStackToHome,
} from '../navigation-reducer.actions';
import { resetURLAfterNavigation } from '../navigation-reducer.helper';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';

export const navigateHomeScreenNoApiRefreshDispatch = (
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  routeProps?: IHomeScreenRouteProps
) => {
  try {
    resetStackToHome(navigation, routeProps);
    const features: IFeaturesState = getState().features;
    resetURLAfterNavigation(features);
  } catch (error) {
    dispatchResetStackToFatalErrorScreen(navigation);
  }
};
