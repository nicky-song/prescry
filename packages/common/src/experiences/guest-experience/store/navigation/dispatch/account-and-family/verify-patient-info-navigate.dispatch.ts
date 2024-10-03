// Copyright 2022 Prescryptive Health, Inc.

import { IVerifyPatientInfoScreenRouteProps } from '../../../../screens/verify-patient-info/verify-patient-info.screen';
import { RootStackNavigationProp } from '../../../../navigation/stack-navigators/root/root.stack-navigator';

export const verifyPatientInfoNavigateDispatch = (
  navigation: RootStackNavigationProp,
  prescriptionId: string
) => {
  const routeParams: IVerifyPatientInfoScreenRouteProps = {
    workflow: 'prescriptionInvite',
    prescriptionId,
  };

  navigation.navigate('AccountAndFamilyStack', {
    screen: 'VerifyPatientInfo',
    params: routeParams,
  });
};
