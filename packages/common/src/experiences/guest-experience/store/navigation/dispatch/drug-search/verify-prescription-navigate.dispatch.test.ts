// Copyright 2021 Prescryptive Health, Inc.

import { verifyPrescriptionNavigateDispatch } from './verify-prescription-navigate.dispatch';
import { drugSearchStackNavigationMock } from '../../../../navigation/stack-navigators/drug-search/__mocks__/drug-search.stack-navigation.mock';
import { PricingOption } from '../../../../../../models/pricing-option';

jest.mock('../../navigation-reducer.actions');

describe('verifyPrescriptionNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [undefined, 'smartPrice' as PricingOption],
    [false, 'smartPrice' as PricingOption],
    [true, 'smartPrice' as PricingOption],
    [undefined, 'pbm' as PricingOption],
    [false, 'pbm' as PricingOption],
    [true, 'pbm' as PricingOption],
    [undefined, 'thirdParty' as PricingOption],
    [false, 'thirdParty' as PricingOption],
    [true, 'thirdParty' as PricingOption],
    [undefined, 'noPrice' as PricingOption],
    [false, 'noPrice' as PricingOption],
    [true, 'noPrice' as PricingOption],
    [undefined, undefined],
    [false, undefined],
    [true, undefined],
  ])(
    'calls navigation.navigate with {hasNavigateBack: %p; pricingOption: %p}',
    (
      hasBackNavigationMock: boolean | undefined,
      pricingOptionMock: PricingOption | undefined
    ) => {
      verifyPrescriptionNavigateDispatch(
        drugSearchStackNavigationMock,
        hasBackNavigationMock,
        pricingOptionMock
      );

      expect(drugSearchStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
      expect(drugSearchStackNavigationMock.navigate).toHaveBeenCalledWith(
        'DrugSearchStack',
        {
          screen: 'VerifyPrescription',
          params: {
            hasBackNavigation: hasBackNavigationMock,
            pricingOption: pricingOptionMock,
          },
        }
      );
    }
  );
});
