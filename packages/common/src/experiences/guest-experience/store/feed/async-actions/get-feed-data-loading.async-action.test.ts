// Copyright 2020 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getFeedAsyncAction } from './get-feed.async-action';
import { getFeedDataLoadingAsyncAction } from './get-feed-data-loading.async-action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;

describe('getFeedDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction', () => {
    getFeedDataLoadingAsyncAction(rootStackNavigationMock);
    expect(dataLoadingActionMock).toHaveBeenCalledWith(getFeedAsyncAction, {
      navigation: rootStackNavigationMock,
    });
  });
});
