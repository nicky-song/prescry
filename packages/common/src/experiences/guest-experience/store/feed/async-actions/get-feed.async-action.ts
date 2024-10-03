// Copyright 2020 Prescryptive Health, Inc.

import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { getFeedDispatch } from '../dispatch/get-feed.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { setFeedApiInProgressAction } from '../actions/set-feed-api-in-progress.action';
import { IFeedActionTypes } from '../feed.reducer';

export type IGetFeedActionType =
  | IFeedActionTypes
  | IDispatchPostLoginApiErrorActionsType;

export interface IGetFeedAsyncActionArgs {
  navigation: RootStackNavigationProp;
  refreshToken?: boolean;
}
export const getFeedAsyncAction = (args: IGetFeedAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<IGetFeedActionType>,
    getState: () => RootState
  ) => {
    try {
      const state = getState();
      if (state.feed.isFeedApiInProgress) {
        return;
      }
      dispatch(setFeedApiInProgressAction(true));
      await getFeedDispatch(dispatch, getState, args?.refreshToken);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
    dispatch(setFeedApiInProgressAction(false));
  };
};
