// Copyright 2021 Prescryptive Health, Inc.

import { prescriptionTransferConfirmationNavigateDispatch } from './prescription-transfer-confirmation-navigate.dispatch';
import { drugSearchStackNavigationMock } from '../../../../navigation/stack-navigators/drug-search/__mocks__/drug-search.stack-navigation.mock';
import { PricingOption } from '../../../../../../models/pricing-option';

jest.mock('../../navigation-reducer.actions');

describe('prescriptionTransferConfirmationNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['smartPrice' as PricingOption],
    ['pbm' as PricingOption],
    ['thirdParty' as PricingOption],
    ['noPrice' as PricingOption],
    [undefined],
  ])(
    'calls navigation.navigate with {pricingOption: %p}',
    async (pricingOptionMock: PricingOption | undefined) => {
      await prescriptionTransferConfirmationNavigateDispatch(
        drugSearchStackNavigationMock,
        pricingOptionMock
      );

      expect(drugSearchStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
      expect(drugSearchStackNavigationMock.navigate).toHaveBeenCalledWith(
        'DrugSearchStack',
        {
          screen: 'PrescriptionTransferConfirmation',
          params: {
            pricingOption: pricingOptionMock,
          },
        }
      );
    }
  );
});
