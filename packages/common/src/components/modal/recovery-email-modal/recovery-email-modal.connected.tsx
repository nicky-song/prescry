// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { addRecoveryEmailDataLoadingAsyncAction } from '../../../experiences/guest-experience/store/member-list-info/async-actions/add-recovery-email-data-loading.async-action';
import {
  IRecoveryEmailModalActionProps,
  RecoveryEmailModal,
} from './recovery-email-modal';

export const actions: IRecoveryEmailModalActionProps = {
  addEmailAction: addRecoveryEmailDataLoadingAsyncAction,
};

export const RecoveryEmailModalConnected = connect(
  undefined,
  actions
)(RecoveryEmailModal);
