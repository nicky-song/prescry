// Copyright 2018 Prescryptive Health, Inc.

import { IPharmacyOffer } from '@phx/common/src/models/pharmacy-offer';
import { SchemaDefinition } from 'mongoose';
import { PharmacyOfferDefinition } from './pharmacy-offer';

describe('PharmacyOfferDefinition()', () => {
  it('creates instance of SchemaDefinition<IPharmacyOffer>', () => {
    const result = PharmacyOfferDefinition();
    expect(result).toMatchObject({
      daysSupply: { type: Number, required: false },
      hasDriveThru: { type: Boolean, required: false },
      isBrand: { type: Boolean, required: false },
      offerId: { type: String, required: true },
      pharmacyNcpdp: { type: String, required: true },
      price: {
        required: true,
        type: {
          memberPaysOffer: String,
          memberPaysShipping: String,
          memberPaysTotal: String,
          pharmacyCashPrice: String, // does this work?
          planCoveragePays: String,
        },
      },
      recommendation: {
        required: false,
        type: {
          identifier: { required: true, type: String },
          index: { required: false, type: String },
        },
      },
      sort: {
        required: true,
        type: {
          distance: { type: Number, required: false },
          price: { type: Number, required: true },
        },
      },
      type: { type: String, required: true },
    } as SchemaDefinition<IPharmacyOffer>);
  });
});
