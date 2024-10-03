// Copyright 2018 Prescryptive Health, Inc.

import { Workflow } from '../../../../../models/workflow';
import type { IFeaturesState } from '../../../guest-experience-features';
import type { IGetFeedActionType } from '../../feed/async-actions/get-feed.async-action';
import type { IDispatchContactInfoActionsType } from '../../member-list-info/member-list-info-reducer.actions';
import { navigateHomeScreenDispatch } from '../../navigation/dispatch/navigate-home-screen.dispatch';
import { resetURLAfterNavigation } from '../../navigation/navigation-reducer.helper';
import type { IDispatchAnyDeepLinkLocationActionsType } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { deepLinkIfPathNameDispatch } from './deep-link-if-path-name.dispatch';
import type { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { CommonConstants } from '../../../../../theming/constants';

export const authenticatedExperienceDispatch = async (
  dispatch: Dispatch<
    | IDispatchAnyDeepLinkLocationActionsType
    | IDispatchContactInfoActionsType
    | IGetFeedActionType
  >,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  workflow?: Workflow,
  isVerifyPinSuccess?: boolean
) => {
  const state = getState();
  if (await deepLinkIfPathNameDispatch(dispatch, getState, navigation, true)) {
    return;
  }

  const features: IFeaturesState = state.features;
  resetURLAfterNavigation(features);

  if (
    isVerifyPinSuccess ||
    state.memberProfile.account.recoveryEmail ||
    state.identityVerification.recoveryEmailExists
  ) {
    await navigateHomeScreenDispatch(
      dispatch,
      getState,
      navigation,
      isVerifyPinSuccess
        ? {
            modalContent: {
              title: CommonConstants.successText,
              modalTopContent: CommonConstants.pinUpdateSuccess,
            },
          }
        : undefined,
      workflow
    );
    return;
  }
  await navigateHomeScreenDispatch(
    dispatch,
    getState,
    navigation,
    {
      modalContent: {
        modalType: 'recoveryEmailModal',
      },
    },
    workflow
  );
};
