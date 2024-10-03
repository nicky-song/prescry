// Copyright 2020 Prescryptive Health, Inc.

import { IAsyncActionArgs } from '../../async-action-args';
import { getUserLocationDispatch } from '../dispatch/get-user-location.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { SessionDispatch } from '../dispatch/session.dispatch';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
export interface IGetUserLocationAsyncActionArgs extends IAsyncActionArgs {
  location?: ILocationCoordinates;
  sessionDispatch: SessionDispatch;
  navigation?: RootStackNavigationProp;
}

export const getUserLocationAsyncAction = async (
  args: IGetUserLocationAsyncActionArgs
): Promise<void> => {
  await getUserLocationDispatch(args);
};
