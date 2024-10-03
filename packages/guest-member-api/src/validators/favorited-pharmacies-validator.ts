// Copyright 2022 Prescryptive Health, Inc.

import { body } from 'express-validator';
import { validate } from '../utils/request-validator';
import { isFavoritedPharmaciesValid } from '@phx/common/src/utils/favorited-pharmacies.helper';

export class FavoritedPharmaciesRequestValidator {
  public updateFavoritedPharmaciesValidate = [
    body('favoritedPharmacies')
      .custom(isFavoritedPharmaciesValid)
      .withMessage({ code: 'INVALID_FAVORITED_PHARMACIES' })
      .bail(),
    validate,
  ];
}
