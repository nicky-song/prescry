// Copyright 2022 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ResponseCode,
  FavoritedPharmaciesValidationCodes,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { FavoritedPharmaciesRequestValidator } from './favorited-pharmacies-validator';

const ResponseMock = {} as Response;

describe('FavoritedPharmaciesRequestValidator: updateFavoritedPharmaciesValidate', () => {
  it('should generate validation errors on empty request', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new FavoritedPharmaciesRequestValidator()
        .updateFavoritedPharmaciesValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
  });
  it('should invalidate request for invalid favoritedPharmacies', async () => {
    const requestMock = {
      body: {
        favoritedPharmacies: ['ncpdp-mock-1', ''],
      },
    } as unknown as Request;
    const validationError: ResponseCode<FavoritedPharmaciesValidationCodes> = {
      code: 'INVALID_FAVORITED_PHARMACIES',
    };
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new FavoritedPharmaciesRequestValidator()
        .updateFavoritedPharmaciesValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('should not return error if request body is valid', async () => {
    const requestMock = {
      body: {
        favoritedPharmacies: ['ncpdp-mock-1', 'ncpdp-mock-2'],
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new FavoritedPharmaciesRequestValidator()
        .updateFavoritedPharmaciesValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(0);
  });
});
