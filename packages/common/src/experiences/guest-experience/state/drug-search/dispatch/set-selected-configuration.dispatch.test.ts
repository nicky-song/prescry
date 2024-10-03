// Copyright 2021 Prescryptive Health, Inc.

import { assertIsDefined } from '../../../../../assertions/assert-is-defined';
import { mockDrugSearchState } from '../../../__mocks__/drug-search-state.mock';
import { setSelectedConfigurationAction } from '../actions/set-selected-configuration.action';
import { setSelectedConfigurationDispatch } from './set-selected-configuration.dispatch';

describe('setSelectedConfigurationDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    assertIsDefined(mockDrugSearchState.selectedConfiguration);
    setSelectedConfigurationDispatch(
      dispatchMock,
      mockDrugSearchState.selectedConfiguration
    );

    const expectedAction = setSelectedConfigurationAction(
      mockDrugSearchState.selectedConfiguration
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
