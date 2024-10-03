// Copyright 2021 Prescryptive Health, Inc.

import { PricingOption } from '../../../../../../models/pricing-option';
import { DrugSearchStackNavigationProp } from '../../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';

export const prescriptionTransferConfirmationNavigateDispatch = (
  navigation: DrugSearchStackNavigationProp,
  pricingOption?: PricingOption
) => {
  navigation.navigate('DrugSearchStack', {
    screen: 'PrescriptionTransferConfirmation',
    params: { pricingOption },
  });
};
