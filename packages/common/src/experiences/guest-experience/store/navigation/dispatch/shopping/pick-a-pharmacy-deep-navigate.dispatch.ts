// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { handleKnownAuthenticationErrorAction } from '../../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../../navigation-reducer.actions';
import { pickAPharmacyNavigateDispatch } from './pick-a-pharmacy-navigate.dispatch';
import { IDispatchPostLoginApiErrorActionsType } from '../navigate-post-login-error.dispatch';
import { loadMemberDataDispatch } from '../../../member-list-info/dispatch/load-member-data.dispatch';
import { RootState } from '../../../root-reducer';
import { IDispatchContactInfoActionsType } from '../../../member-list-info/member-list-info-reducer.actions';
import { RootStackNavigationProp } from './../../../../navigation/stack-navigators/root/root.stack-navigator';
import { popToTop } from '../../../../navigation/navigation.helper';

export const pickAPharmacyDeepNavigateDispatch = async (
  dispatch: Dispatch<
    IDispatchPostLoginApiErrorActionsType | IDispatchContactInfoActionsType
  >,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  prescriptionId: string,
  blockchain?: boolean
) => {
  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );
    if (!redirected) {
      popToTop(navigation);
      pickAPharmacyNavigateDispatch(navigation, {
        prescriptionId,
        navigateToHome: true,
        reloadPrescription: undefined,
        blockchain,
      });
    }
  } catch (error) {
    const redirectedToHandleError = handleKnownAuthenticationErrorAction(
      dispatch,
      navigation,
      error as Error
    );

    if (!redirectedToHandleError) {
      await dispatchResetStackToFatalErrorScreen(navigation);
    }
  }
};
