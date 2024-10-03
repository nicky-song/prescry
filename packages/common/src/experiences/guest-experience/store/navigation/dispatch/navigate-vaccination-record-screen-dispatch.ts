// Copyright 2021 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const navigateVaccinationRecordScreenDispatch = (
  navigation: RootStackNavigationProp,
  orderNumber: string,
  backToList?: boolean,
) => {
  navigation.navigate('PastProceduresStack', {
    screen: 'VaccinationRecord',
    params: {
      orderNumber,
      backToList,
    },
  });
};
