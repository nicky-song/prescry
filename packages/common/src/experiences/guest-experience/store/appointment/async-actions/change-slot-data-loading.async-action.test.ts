// Copyright 2021 Prescryptive Health, Inc.

import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { changeSlotAsyncAction } from './change-slot.async-action';
import { changeSlotDataLoadingAsyncAction } from './change-slot-data-loading.async-action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;

const selectedSlot = { slotName: '8:00 am' } as IAvailableSlot;

describe('changeSlotDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction with selectedSlot', () => {
    changeSlotDataLoadingAsyncAction(
      rootStackNavigationMock,
      selectedSlot,
      'test-message'
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      changeSlotAsyncAction,
      {
        navigation: rootStackNavigationMock,
        selectedSlot,
      },
      true,
      'test-message'
    );
  });
});
