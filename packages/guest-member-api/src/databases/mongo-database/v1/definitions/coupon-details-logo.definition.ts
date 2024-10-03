// Copyright 2018 Prescryptive Health, Inc.

import { ICouponLogo } from '../../../../models/coupon';
import { SchemaDefinition } from 'mongoose';

export const CouponDetailsLogoDefinition =
  (): SchemaDefinition<ICouponLogo> => ({
    name: { type: String, required: true },
    alternativeText: { type: String, required: true },
    caption: { type: String, required: true },
    hash: { type: String, required: true },
    ext: { type: String, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    provider: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    id: { type: String, required: true },
  });
