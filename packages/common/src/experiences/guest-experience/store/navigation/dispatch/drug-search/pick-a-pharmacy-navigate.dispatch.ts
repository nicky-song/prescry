// Copyright 2021 Prescryptive Health, Inc.

import { DrugSearchStackNavigationProp } from '../../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';

export const pickAPharmacyNavigateDispatch = (
  navigation: DrugSearchStackNavigationProp
) => navigation.navigate('DrugSearchPickAPharmacy');
