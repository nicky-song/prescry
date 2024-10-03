// Copyright 2021 Prescryptive Health, Inc.

import { addRecoveryEmailDataLoadingAsyncAction } from '../../../experiences/guest-experience/store/member-list-info/async-actions/add-recovery-email-data-loading.async-action';
import { IRecoveryEmailModalActionProps } from './recovery-email-modal';
import { actions } from './recovery-email-modal.connected';

describe('RecoveryEmailModalConnected', () => {
  it('maps dispatch actions', () => {
    const expectedActions: IRecoveryEmailModalActionProps = {
      addEmailAction: addRecoveryEmailDataLoadingAsyncAction,
    };
    expect(actions).toEqual(expectedActions);
  });
});
