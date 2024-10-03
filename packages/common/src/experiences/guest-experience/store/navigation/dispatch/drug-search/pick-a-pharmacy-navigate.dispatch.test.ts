// Copyright 2021 Prescryptive Health, Inc.

import { drugSearchStackNavigationMock } from '../../../../navigation/stack-navigators/drug-search/__mocks__/drug-search.stack-navigation.mock';
import { pickAPharmacyNavigateDispatch } from './pick-a-pharmacy-navigate.dispatch';

describe('pickAPharmacyNavigateDispatch', () => {
  it('should call dispatchNavigateToScreen', () => {
    pickAPharmacyNavigateDispatch(drugSearchStackNavigationMock);

    expect(drugSearchStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(drugSearchStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'DrugSearchPickAPharmacy'
    );
  });
});
