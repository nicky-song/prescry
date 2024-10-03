// Copyright 2021 Prescryptive Health, Inc.

import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { lyricaSearchResultMock } from '../../../__mocks__/drug-search-response.mock';
import { setSelectedDrugAction } from '../actions/set-selected-drug.action';
import { setSelectedDrugDispatch } from './set-selected-drug.dispatch';

describe('setSelectedDrugDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);

    setSelectedDrugDispatch(
      dispatchMock,
      lyricaSearchResultMock,
      defaultConfigurationMock
    );

    const expectedAction = setSelectedDrugAction(
      lyricaSearchResultMock,
      defaultConfigurationMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
