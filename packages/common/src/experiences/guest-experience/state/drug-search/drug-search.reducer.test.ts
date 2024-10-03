// Copyright 2021 Prescryptive Health, Inc.

import { assertIsDefined } from '../../../../assertions/assert-is-defined';
import { IPharmacy } from '../../../../models/pharmacy';
import drugSearchResultHelper from '../../../../utils/drug-search/drug-search-result.helper';
import {
  lyricaSearchResultMock,
  drugSearchResultsMock,
} from '../../__mocks__/drug-search-response.mock';
import {
  mockDrugSearchState,
  selectedDrugMock,
} from '../../__mocks__/drug-search-state.mock';
import { pharmacyDrugPrice1Mock } from '../../__mocks__/pharmacy-drug-price.mock';
import { pharmaciesByZipcodeAppendAction } from './actions/pharmacies-by-zip-code-append.action';
import { setDrugSearchResultsAction } from './actions/set-drug-search-results.action';
import { setSelectedConfigurationAction } from './actions/set-selected-configuration.action';
import { setSelectedDrugAction } from './actions/set-selected-drug.action';
import { drugSearchReducer } from './drug-search.reducer';
import { defaultDrugSearchState, IDrugSearchState } from './drug-search.state';

describe('drugSearchReducer', () => {
  it('reduces drug search response set action', () => {
    const action = setDrugSearchResultsAction(drugSearchResultsMock, 0);

    const initialState: IDrugSearchState = {
      ...defaultDrugSearchState,
    };
    const reducedState = drugSearchReducer(initialState, action);

    const expectedState: IDrugSearchState = {
      ...initialState,
      drugSearchResults: drugSearchResultsMock,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces old drug search response when selectedDrug is set', () => {
    const action = setDrugSearchResultsAction(drugSearchResultsMock, 0);

    const initialState: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedDrug: selectedDrugMock,
    };
    const reducedState = drugSearchReducer(initialState, action);

    expect(reducedState).toEqual(initialState);
  });

  it('reduces drugSearchSetSelectedConfigurationAction', () => {
    assertIsDefined(mockDrugSearchState.selectedConfiguration);

    const action = setSelectedConfigurationAction(
      mockDrugSearchState.selectedConfiguration
    );

    const initialState: IDrugSearchState = {
      ...defaultDrugSearchState,
    };
    const reducedState = drugSearchReducer(initialState, action);

    const expectedState: IDrugSearchState = {
      ...initialState,
      selectedConfiguration: mockDrugSearchState.selectedConfiguration,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces setSelectedDrugAction', () => {
    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);
    const action = setSelectedDrugAction(
      lyricaSearchResultMock,
      defaultConfigurationMock
    );

    const initialState: IDrugSearchState = {
      ...defaultDrugSearchState,
    };
    const reducedState = drugSearchReducer(initialState, action);

    const expectedState: IDrugSearchState = {
      ...initialState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces setSelectedDrugAction when state timeStamp is the timeStamp for last request', () => {
    const stateTimeStamp = 1637801761876;
    const payloadTimeStamp = 1637801761875;

    const action = setDrugSearchResultsAction([], payloadTimeStamp);

    const initialState: IDrugSearchState = {
      ...defaultDrugSearchState,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      errorMessage: 'Test Error',
      selectedConfiguration: mockDrugSearchState.selectedConfiguration,
    };
    const reducedState = drugSearchReducer(
      { ...initialState, timeStamp: stateTimeStamp },
      action
    );

    const expectedState: IDrugSearchState = {
      ...initialState,
      timeStamp: stateTimeStamp,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces setSelectedDrugAction when state timeStamp is not the timeStamp for last request', () => {
    const stateTimeStamp = 1637801761875;
    const payloadTimeStamp = 1637801761876;

    const action = setDrugSearchResultsAction([], payloadTimeStamp);

    const initialState: IDrugSearchState = {
      ...defaultDrugSearchState,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      errorMessage: 'Test Error',
      selectedConfiguration: mockDrugSearchState.selectedConfiguration,
    };
    const reducedState = drugSearchReducer(
      { ...initialState, timeStamp: stateTimeStamp },
      action
    );

    const expectedState: IDrugSearchState = {
      ...initialState,
      bestPricePharmacy: undefined,
      errorMessage: undefined,
      selectedConfiguration: undefined,
      timeStamp: payloadTimeStamp,
    };
    expect(reducedState).toEqual(expectedState);
  });

  it('reduces pharmaciesByZipcodeAppendAction', () => {
    const action = pharmaciesByZipcodeAppendAction([
      pharmacyDrugPrice1Mock.pharmacy,
    ]);

    const initialState: IDrugSearchState = {
      ...defaultDrugSearchState,
      sourcePharmacies: [{ name: 'source-pharmacy' }] as IPharmacy[],
    };
    const reducedState = drugSearchReducer(initialState, action);

    const expectedState: IDrugSearchState = {
      ...initialState,
      sourcePharmacies: initialState.sourcePharmacies.concat([
        pharmacyDrugPrice1Mock.pharmacy,
      ]),
    };
    expect(reducedState).toEqual(expectedState);
  });
});
