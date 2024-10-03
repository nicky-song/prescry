// Copyright 2022 Prescryptive Health, Inc.

import { Response } from 'express';
import { IConfiguration } from '../../configuration';
import { SuccessConstants } from '../../constants/response-messages';
import {
  alternativeDrugPriceMock,
  IAlternativeDrugPrice,
} from '../../mock-data/alternative-drug-price';
import { SuccessResponse } from '../response-helper';

export const getAlternativeDrugPriceByNdcAndNcpdp = async (
  response: Response,
  _ndc: string,
  _ncpdp: string,
  _configuration: IConfiguration
  // eslint-disable-next-line require-await
) => {
  return SuccessResponse<IAlternativeDrugPrice>(
    response,
    SuccessConstants.DOCUMENT_FOUND,
    alternativeDrugPriceMock
  );
};
