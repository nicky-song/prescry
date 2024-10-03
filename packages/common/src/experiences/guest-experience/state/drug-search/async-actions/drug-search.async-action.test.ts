// Copyright 2021 Prescryptive Health, Inc.

import { internalErrorDispatch } from '../../../store/error-handling/dispatch/internal-error.dispatch';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { getDrugSearchResultsDispatch } from '../dispatch/get-drug-search-results.dispatch';
import {
  drugSearchAsyncAction,
  IDrugSearchAsyncActionArgs,
} from './drug-search.async-action';
import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-drug-search-results.dispatch');
const getDrugSearchResultsDispatchMock =
  getDrugSearchResultsDispatch as jest.Mock;

jest.mock('../../../store/error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

describe('drugSearchAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('dispatches drug search response', async () => {
    const argsMock: IDrugSearchAsyncActionArgs = {
      filter: 'pre',
      maxResults: 5,
      rxSubGroup: 'rx-sub-group',
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
      useAllMedicationsSearch: false,
    };
    await drugSearchAsyncAction(argsMock);

    expect(getDrugSearchResultsDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('handles errors', async () => {
    const errorMock = new Error('Error');
    getDrugSearchResultsDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IDrugSearchAsyncActionArgs = {
      filter: 'pre',
      rxSubGroup: 'rx-sub-group',
      maxResults: 5,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await drugSearchAsyncAction(argsMock);

    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      argsMock.navigation,
      errorMock
    );
  });
});
