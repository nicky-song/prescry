// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { updateRecoveryEmailDataLoadingAsyncAction } from './update-recovery-email-data-loading.async-action';
import { updateRecoveryEmailAsyncAction } from './update-recovery-email.async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;

const email = 'test@test.com';
const oldEmail = 'test@test.com';

describe('updateRecoveryEmailDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction', () => {
    updateRecoveryEmailDataLoadingAsyncAction(
      { email, oldEmail },
      rootStackNavigationMock
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      updateRecoveryEmailAsyncAction,
      { requestBody: { email, oldEmail }, navigation: rootStackNavigationMock }
    );
  });
});
