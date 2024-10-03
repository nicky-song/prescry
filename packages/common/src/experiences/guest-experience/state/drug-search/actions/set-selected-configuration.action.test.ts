// Copyright 2021 Prescryptive Health, Inc.

import { assertIsDefined } from '../../../../../assertions/assert-is-defined';
import { mockDrugSearchState } from '../../../__mocks__/drug-search-state.mock';
import { setSelectedConfigurationAction } from './set-selected-configuration.action';

describe('setSelectedConfigurationAction', () => {
  it('returns action', () => {
    assertIsDefined(mockDrugSearchState.selectedConfiguration);
    const action = setSelectedConfigurationAction(
      mockDrugSearchState.selectedConfiguration
    );
    expect(action.type).toEqual('SET_SELECTED_CONFIGURATION');

    expect(action.payload).toEqual({
      selectedConfiguration: mockDrugSearchState.selectedConfiguration,
    });
  });
});
