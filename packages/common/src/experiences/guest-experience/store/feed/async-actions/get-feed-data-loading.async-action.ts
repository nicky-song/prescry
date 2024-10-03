// Copyright 2020 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getFeedAsyncAction } from './get-feed.async-action';

export const getFeedDataLoadingAsyncAction = (
  navigation: RootStackNavigationProp
) =>
  dataLoadingAction(getFeedAsyncAction, {
    navigation,
  });
