// Copyright 2018 Prescryptive Health, Inc.

import { Workflow } from '../../../../../models/workflow';
import { IGetFeedActionType } from '../../feed/async-actions/get-feed.async-action';
import { getFeedDispatch } from '../../feed/dispatch/get-feed.dispatch';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { IDispatchContactInfoActionsType } from '../../member-list-info/member-list-info-reducer.actions';
import {
  handleKnownAuthenticationErrorAction,
  IDispatchAnyDeepLinkLocationActionsType,
} from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import {
  dispatchResetStackToFatalErrorScreen,
  resetStackToHome,
} from '../navigation-reducer.actions';
import { verifyPrescriptionNavigateDispatch } from '../dispatch/drug-search/verify-prescription-navigate.dispatch';
import {
  RootStackNavigationProp,
  RootStackScreenName,
} from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IHomeScreenRouteProps } from '../../../home-screen/home-screen';
import { isPbmMember } from '../../../../../utils/profile.helper';
import { IDigitalIDCardScreenRouteProps } from '../../../screens/digital-id-card/digital-id-card.screen';
import { popToTop } from '../../../navigation/navigation.helper';

export const navigateHomeScreenDispatch = async (
  dispatch: Dispatch<
    | IDispatchAnyDeepLinkLocationActionsType
    | IDispatchContactInfoActionsType
    | IGetFeedActionType
  >,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  homeScreenProps?: IHomeScreenRouteProps,
  workflow?: Workflow
) => {
  try {
    await getFeedDispatch(dispatch, getState);

    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );
    if (redirected) {
      return;
    }

    switch (workflow) {
      case 'startSaving': {
        popToTop(navigation);

        const state = getState();
        const { memberProfile: profile, features } = state;

        const screenName: RootStackScreenName = isPbmMember(
          profile.profileList,
          features
        )
          ? 'DigitalIDCard'
          : 'SmartPrice';

        const routeProps: IDigitalIDCardScreenRouteProps | undefined =
          screenName === 'DigitalIDCard'
            ? {
                backToHome: true,
              }
            : undefined;
        navigation.navigate(screenName, routeProps);
        break;
      }

      case 'prescriptionTransfer': {
        popToTop(navigation);
        verifyPrescriptionNavigateDispatch(navigation);
        break;
      }

      default: {
        resetStackToHome(navigation, homeScreenProps);
        break;
      }
    }
  } catch (error) {
    const redirectedToHandleError = handleKnownAuthenticationErrorAction(
      dispatch,
      navigation,
      error as Error
    );

    if (!redirectedToHandleError) {
      dispatchResetStackToFatalErrorScreen(navigation);
    }
  }
};
