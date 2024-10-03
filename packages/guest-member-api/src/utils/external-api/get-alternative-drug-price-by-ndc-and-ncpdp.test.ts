// Copyright 2022 Prescryptive Health, Inc.

import { Response } from 'express';
import { IConfiguration } from '../../configuration';
import { SuccessConstants } from '../../constants/response-messages';
import { alternativeDrugPriceMock } from '../../mock-data/alternative-drug-price';
import { SuccessResponse } from '../response-helper';
import { getAlternativeDrugPriceByNdcAndNcpdp } from './get-alternative-drug-price-by-ndc-and-ncpdp';

jest.mock('../response-helper');
const SuccessResponseMock = SuccessResponse as jest.Mock;

const responseMock = {} as Response;
const configurationMock = {} as IConfiguration;
const ndcMock = 'ndc-mock';
const ncpdpMock = 'ncpdp-mock';

describe('getAlternativeDrugPriceByNdcAndNcpdp', () => {
  it('returns SuccessResponse with IAlternativeDrugPrice data', async () => {
    await getAlternativeDrugPriceByNdcAndNcpdp(
      responseMock,
      ndcMock,
      ncpdpMock,
      configurationMock
    );

    expect(SuccessResponseMock).toHaveBeenCalledTimes(1);
    expect(SuccessResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      alternativeDrugPriceMock
    );
  });
});
