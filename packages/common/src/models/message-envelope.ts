// Copyright 2018 Prescryptive Health, Inc.

import { IPendingPrescriptionsList } from './pending-prescription';

export interface IMessageEnvelope {
  identifier: string;
  pendingPrescriptionList: IPendingPrescriptionsList;
  notificationTarget: string;
}
