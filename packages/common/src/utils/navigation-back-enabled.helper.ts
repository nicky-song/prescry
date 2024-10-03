// Copyright 2022 Prescryptive Health, Inc.

import { Workflow } from '../models/workflow';

export const navigationBackEnabled = (workflow: Workflow): boolean => {
  switch (workflow) {
    case 'pbmActivate':
    case 'prescriptionTransfer':
    case 'startSaving':
      return true;
    case 'prescriptionInvite':
      return false;
    case 'register':
      return false;
    default:
      return true;
  }
};
