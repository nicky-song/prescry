// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyPriceSearchResponse } from '../../../../models/api-response/pharmacy-price-search.response';
import { ErrorConstants } from '../../../../theming/constants';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../__mocks__/pharmacy-drug-price.mock';
import { ensureGetPrescriptionPharmaciesResponse } from './ensure-get-prescription-pharmacies-response';

describe('ensureGetPrescriptionPharmaciesResponse()', () => {
  it('throws error if response data is invalid', () => {
    const mockResponse = {};
    expect(() =>
      ensureGetPrescriptionPharmaciesResponse(mockResponse)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('returns response data if valid', () => {
    const responseMock: Partial<IPharmacyPriceSearchResponse> = {
      data: {
        pharmacyPrices: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
      },
    };

    const result = ensureGetPrescriptionPharmaciesResponse(responseMock);
    expect(result).toEqual(responseMock);
  });
});
