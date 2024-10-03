// Copyright 2021 Prescryptive Health, Inc.

import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { lyricaSearchResultMock } from '../../../__mocks__/drug-search-response.mock';
import { IDrugSearchState } from '../drug-search.state';
import { setSelectedDrugAction } from './set-selected-drug.action';

describe('setSelectedDrugAction', () => {
  it('returns action', () => {
    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);
    const action = setSelectedDrugAction(
      lyricaSearchResultMock,
      defaultConfigurationMock
    );
    expect(action.type).toEqual('SET_SELECTED_DRUG');

    const expectedPayload: Partial<IDrugSearchState> = {
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: undefined,
      errorMessage: undefined,
      pharmacies: [],
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
