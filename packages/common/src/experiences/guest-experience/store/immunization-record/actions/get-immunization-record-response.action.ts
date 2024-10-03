// Copyright 2021 Prescryptive Health, Inc.

import { IImmunizationRecordAction } from './immunization-record-action';
import { IImmunizationRecord } from '../../../../../../src/models/api-response/immunization-record-response';

export type IGetImmunizationRecordResponseAction = IImmunizationRecordAction<
  'IMMUNIZATION_RECORD_RESPONSE',
  IImmunizationRecord[] | undefined
>;

export const getImmunizationRecordResponseAction = (
  result?: IImmunizationRecord[]
): IGetImmunizationRecordResponseAction => ({
  payload: result,
  type: 'IMMUNIZATION_RECORD_RESPONSE',
});
