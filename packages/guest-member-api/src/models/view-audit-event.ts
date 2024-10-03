// Copyright 2022 Prescryptive Health, Inc.

import { IHealthRecordEvent } from './health-record-event';
export interface IViewAudit {
  accountId: string;
  success: boolean;
  itemId: string;
  apiUrl: string;
  originUrl?: string;
  refererUrl?: string;
  fromIP: string | undefined;
  accessTime: string;
  browser: string | undefined;
  sessionId: string;
  errorMessage?: string;
}

export type IViewAuditEvent = IHealthRecordEvent<IViewAudit>;
