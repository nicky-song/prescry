// Copyright 2021 Prescryptive Health, Inc.

import { IDrugSearchResult } from '../../../../../models/drug-search-response';
import {
  lyricaSearchResultMock,
  preGenDhaSearchResultMock,
} from '../../../__mocks__/drug-search-response.mock';
import { IDrugSearchState } from '../drug-search.state';
import { setDrugSearchResultsAction } from './set-drug-search-results.action';

describe('setDrugSearchResultsAction', () => {
  it('returns action', () => {
    const drugSearchResultsMock: IDrugSearchResult[] = [
      lyricaSearchResultMock,
      preGenDhaSearchResultMock,
    ];
    const action = setDrugSearchResultsAction(drugSearchResultsMock, 0);
    expect(action.type).toEqual('SET_DRUG_SEARCH_RESULTS');

    const expectedPayload: Partial<IDrugSearchState> = {
      drugSearchResults: drugSearchResultsMock,
      pharmacies: [],
      bestPricePharmacy: undefined,
      errorMessage: undefined,
      selectedDrug: undefined,
      selectedConfiguration: undefined,
      timeStamp: 0,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
