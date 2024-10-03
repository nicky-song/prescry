// Copyright 2021 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IDispatchInitialScreenActionsType } from '../../start-experience/dispatch/deep-link-if-path-name.dispatch';
import { setServiceTypeAction } from '../../service-type/actions/set-service-type.action';
import { getProviderLocationDetailsDispatch } from '../../provider-location-details/dispatch/get-provider-location-details.dispatch';
import { decodeAscii } from '../../../../../utils/base-64-helper';
import { ErrorProviderLocationDetails } from '../../../../../errors/error-provider-location-details';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { navigateHomeScreenNoApiRefreshDispatch } from './navigate-home-screen-no-api-refresh.dispatch';
import { popToTop } from '../../../navigation/navigation.helper';

export const locationDeepNavigateDispatch = async (
  dispatch: Dispatch<IDispatchInitialScreenActionsType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  base64EncodedLocationId: string,
  base64EncodedServiceType: string
) => {
  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );
    if (!redirected) {
      const serviceType = decodeAscii(
        decodeURIComponent(base64EncodedServiceType)
      );
      const locationId = decodeAscii(
        decodeURIComponent(base64EncodedLocationId)
      );

      dispatch(
        setServiceTypeAction({
          type: serviceType,
        })
      );

      popToTop(navigation);
      await getProviderLocationDetailsDispatch(
        dispatch,
        getState,
        navigation,
        locationId,
        true
      );
    }
  } catch (error) {
    const redirectedToHandleError = handleKnownAuthenticationErrorAction(
      dispatch,
      navigation,
      error as Error
    );

    if (!redirectedToHandleError) {
      const errorMessage =
        error instanceof ErrorProviderLocationDetails
          ? error.message
          : (error as Error).message;

      navigateHomeScreenNoApiRefreshDispatch(getState, navigation, {
        modalContent: {
          showModal: true,
          modalTopContent: errorMessage,
        },
      });
    }
  }
};
