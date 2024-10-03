// Copyright 2021 Prescryptive Health, Inc.

import { PricingOption } from '../../../../../../models/pricing-option';
import { RootStackNavigationProp } from '../../../../navigation/stack-navigators/root/root.stack-navigator';

export const verifyPrescriptionNavigateDispatch = (
  navigation: RootStackNavigationProp,
  hasBackNavigation?: boolean,
  pricingOption?: PricingOption
) => {
  navigation.navigate('DrugSearchStack', {
    screen: 'VerifyPrescription',
    params: { hasBackNavigation, pricingOption },
  });
};
