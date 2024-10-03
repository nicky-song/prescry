// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { addRecoveryEmailDataLoadingAsyncAction } from './add-recovery-email-data-loading.async-action';
import {
  addRecoveryEmailAsyncAction,
  IAddRecoveryEmailAsyncAction,
} from './add-recovery-email.async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;

const email = 'test@test.com';

describe('addRecoveryEmailDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction', () => {
    const addRecoveryEmailAsyncActionArgs: IAddRecoveryEmailAsyncAction = {
      email,
      navigation: rootStackNavigationMock,
    };
    addRecoveryEmailDataLoadingAsyncAction(email, rootStackNavigationMock);
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      addRecoveryEmailAsyncAction,
      addRecoveryEmailAsyncActionArgs
    );
  });
});
