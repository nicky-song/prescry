// Copyright 2023 Prescryptive Health, Inc.

import { ClaimType } from '../types';

export const bestPriceGenericData = {
  url: 'best-price-generic' as ClaimType,
  prescribedMedication: {
    drugName: 'Pregablin',
    price: '141.58',
  },
  pharmacyInfo: {
    name: 'Bartell Drugs #18',
  },
};

export const greatePriceData = {
  scenario: 'greatPrice' as ClaimType,
  prescribedMedication: {
    drugName: 'Restasis',
    price: '1.00',
  },
  pharmacyInfo: {
    name: 'SAFEWAY PHARMACY #1142',
  },
};
