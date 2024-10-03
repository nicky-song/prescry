// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { IFhir } from '../../../models/fhir/fhir';
import { SuccessResponse } from '../../../utils/response-helper';
import { SuccessConstants } from '../../../constants/response-messages';
import { buildwhitefishAndBlockchainPrescriptions } from './build-whitefish-and-blockchain-prescriptions';

export const buildPrescriptionsResponse = (
  page: number,
  response: Response,
  prescriptions: IFhir[],
  personList: IPerson[],
  blockchainPrescriptions?: IFhir[]
): Response => {
  return SuccessResponse<IPrescriptionInfo[]>(
    response,
    SuccessConstants.DOCUMENT_FOUND,
    buildwhitefishAndBlockchainPrescriptions(
      page,
      personList,
      prescriptions,
      blockchainPrescriptions
    )
  );
};
