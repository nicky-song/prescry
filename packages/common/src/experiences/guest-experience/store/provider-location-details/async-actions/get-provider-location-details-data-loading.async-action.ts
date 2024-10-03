// Copyright 2020 Prescryptive Health, Inc.

import {
  ReduxDispatch,
  ReduxGetState,
} from '../../../context-providers/redux/redux.context';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getProviderLocationDetailsAsyncAction } from './get-provider-location-details.async-action';

export interface IProviderLocationDetailsArgs {
  navigation: RootStackNavigationProp;
  reduxDispatch: ReduxDispatch;
  reduxGetState: ReduxGetState;
  identifier: string;
}

export const getProviderLocationDetailsDataLoadingAsyncAction = (
  args: IProviderLocationDetailsArgs
) => {
  dataLoadingAction(getProviderLocationDetailsAsyncAction, {
    identifier: args.identifier,
    navigation: args.navigation,
  })(args.reduxDispatch, args.reduxGetState);
};
