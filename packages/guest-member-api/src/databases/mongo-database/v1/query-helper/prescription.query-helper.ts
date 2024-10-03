// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../../constants/api-constants';
import { IDatabase } from '../setup/setup-database';

export const getPrescriptionPriceById = (
  prescriptionId: string,
  database: IDatabase
) =>
  database.Models.PrescriptionPriceEventModel.findOne({
    $and: [
      { 'eventData.prescriptionId': prescriptionId },
      { eventType: ApiConstants.PRESCRIPTION_PRICE_EVENT_TYPE },
    ],
  }).sort('-createdOn');
