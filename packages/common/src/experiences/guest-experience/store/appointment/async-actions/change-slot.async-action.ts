// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { RootState } from '../../root-reducer';
import {
  changeSlotDispatch,
  IChangeSlotActionType,
} from '../dispatch/change-slot.dispatch';

export const changeSlotAsyncAction = (args: {
  navigation: RootStackNavigationProp;
  selectedSlot: IAvailableSlot;
}) => {
  return async (
    dispatch: Dispatch<IChangeSlotActionType>,
    getState: () => RootState
  ): Promise<void> => {
    await changeSlotDispatch(
      dispatch,
      getState,
      args.selectedSlot,
      args.navigation
    );
  };
};
