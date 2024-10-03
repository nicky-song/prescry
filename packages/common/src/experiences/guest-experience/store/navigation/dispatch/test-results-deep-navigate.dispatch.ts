// Copyright 2022 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { IDispatchContactInfoActionsType } from '../../member-list-info/member-list-info-reducer.actions';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { IGetTestResultsActionType } from '../../test-result/async-actions/get-test-result.async-action';
import { navigatePastProceduresListDispatch } from './navigate-past-procedures-list.dispatch';
import { popToTop } from '../../../navigation/navigation.helper';

export const testResultsDeepNavigateDispatch = async (
  dispatch: Dispatch<
    IGetTestResultsActionType | IDispatchContactInfoActionsType
  >,
  getState: () => RootState,
  navigation: RootStackNavigationProp
) => {
  try {
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      navigation
    );
    if (!redirected) {
      popToTop(navigation);
      navigatePastProceduresListDispatch(navigation, true);
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
