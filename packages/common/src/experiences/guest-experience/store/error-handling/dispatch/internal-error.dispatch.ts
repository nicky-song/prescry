// Copyright 2020 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { handleCommonErrorAction } from '../../error-handling.actions';

export const internalErrorDispatch = (
  navigation: RootStackNavigationProp,
  error: Error
) => {
  handleCommonErrorAction(
    navigation,
    '',
    error
  );
};
