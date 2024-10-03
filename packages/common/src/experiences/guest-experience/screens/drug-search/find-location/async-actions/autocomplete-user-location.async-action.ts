// Copyright 2022 Prescryptive Health, Inc.

import { IAsyncActionArgs } from '../../../../state/async-action-args';
import { autocompleteUserLocationDispatch } from '../dispatch/autocomplete-user-location.dispatch';
import { RootStackNavigationProp } from '../../../../navigation/stack-navigators/root/root.stack-navigator';
import { ILocationCoordinates } from '../../../../../../models/location-coordinates';
import { FindLocationDispatch } from '../dispatch/find-location.dispatch';

export interface IAutocompleteUserLocationAsyncActionArgs
  extends IAsyncActionArgs {
  query?: string;
  findLocationDispatch: FindLocationDispatch;
  location?: ILocationCoordinates;
  navigation?: RootStackNavigationProp;
  defaultSet?: boolean;
  notFoundErrorMessage?: string;
}

export const autocompleteUserLocationAsyncAction = async (
  args: IAutocompleteUserLocationAsyncActionArgs
): Promise<void> => {
  await autocompleteUserLocationDispatch(args);
};
