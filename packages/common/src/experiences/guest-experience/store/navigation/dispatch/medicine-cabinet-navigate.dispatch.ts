// Copyright 2021 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const medicineCabinetNavigateDispatch = (
  navigation: RootStackNavigationProp,
  backToHome?: boolean,
) => navigation.navigate('MedicineCabinet', { backToHome });
