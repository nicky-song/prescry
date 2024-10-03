// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { changeSlotAsyncAction } from './change-slot.async-action';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const changeSlotDataLoadingAsyncAction = (
  navigation: RootStackNavigationProp,
  selectedSlot: IAvailableSlot,
  mainLoadingMessage: string
) =>
  dataLoadingAction(
    changeSlotAsyncAction,
    {
      navigation,
      selectedSlot,
    },
    true,
    mainLoadingMessage
  );
