// Copyright 2020 Prescryptive Health, Inc.

import { navigateHomeScreenDispatch } from '../dispatch/navigate-home-screen.dispatch';
import { RootState } from '../../root-reducer';
import { IDispatchAnyDeepLinkLocationActionsType } from '../../root-navigation.actions';
import { IDispatchContactInfoActionsType } from '../../member-list-info/member-list-info-reducer.actions';
import { IGetFeedActionType } from '../../feed/async-actions/get-feed.async-action';
import { IFeaturesState } from '../../../guest-experience-features';
import { resetURLAfterNavigation } from '../navigation-reducer.helper';
import { IPopupModalProps } from '../../../../../components/modal/popup-modal/popup-modal';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IHomeScreenRouteProps } from '../../../home-screen/home-screen';

export const homeNavigateAsyncAction = (
  navigation: RootStackNavigationProp,
  modalContent?: IPopupModalProps
) => {
  return async (
    dispatch: (
      action:
        | IDispatchAnyDeepLinkLocationActionsType
        | IDispatchContactInfoActionsType
        | IGetFeedActionType
    ) => void,
    getState: () => RootState
  ) => {
    const homeScreenProps: IHomeScreenRouteProps = modalContent
      ? {
          modalContent,
        }
      : {};
    await navigateHomeScreenDispatch(
      dispatch,
      getState,
      navigation,
      homeScreenProps
    );
    const features: IFeaturesState = getState().features;
    resetURLAfterNavigation(features);
  };
};
