// Copyright 2022 Prescryptive Health, Inc.

import { IPrescriptionPersonScreenRouteProps } from '../../../../screens/prescription-person/prescription-person.screen';
import { RootStackNavigationProp } from '../../../../navigation/stack-navigators/root/root.stack-navigator';

export const prescriptionPersonNavigateDispatch = (
  navigation: RootStackNavigationProp,
  prescriptionId: string,
  userExists?: boolean
) => {
  const routeParams: IPrescriptionPersonScreenRouteProps = {
    workflow: 'prescriptionInvite',
    prescriptionId,
    userExists,
  };

  navigation.navigate('AccountAndFamilyStack', {
    screen: 'PrescriptionPerson',
    params: routeParams,
  });
};
