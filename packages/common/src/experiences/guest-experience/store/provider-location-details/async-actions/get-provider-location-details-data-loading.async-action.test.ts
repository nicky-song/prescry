// Copyright 2020 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import {
  getProviderLocationDetailsDataLoadingAsyncAction,
  IProviderLocationDetailsArgs,
} from './get-provider-location-details-data-loading.async-action';
import { getProviderLocationDetailsAsyncAction } from './get-provider-location-details.async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('./get-provider-location-details.async-action');
const getProviderLocationDetailsAsyncActionMock =
  getProviderLocationDetailsAsyncAction as jest.Mock;

describe('getProviderLocationsDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction', () => {
    const argsMock: IProviderLocationDetailsArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: rootStackNavigationMock,
      identifier: 'id-1',
    };
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);
    getProviderLocationDetailsDataLoadingAsyncAction(argsMock);
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      getProviderLocationDetailsAsyncActionMock,
      {
        identifier: 'id-1',
        navigation: rootStackNavigationMock,
      }
    );
    const actionMock = dataLoadingActionMock(
      getProviderLocationDetailsAsyncActionMock,
      {
        identifier: 'id-1',
        navigation: rootStackNavigationMock,
      }
    );
    expect(actionMock).toHaveBeenCalledWith(
      argsMock.reduxDispatch,
      argsMock.reduxGetState
    );
  });
});
