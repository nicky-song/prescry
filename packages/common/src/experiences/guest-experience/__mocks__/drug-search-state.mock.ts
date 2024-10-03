// Copyright 2021 Prescryptive Health, Inc.

import {
  IDrugSearchResult,
  IDrugVariant,
} from '../../../models/drug-search-response';
import { IDrugSearchState } from '../state/drug-search/drug-search.state';

export const selectedDrugMock: IDrugSearchResult = {
  name: 'Lyrica(Pregabalin)',
  forms: ['Capsule', 'Solution'],
  drugVariants: [
    {
      ndc: '00071101568',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '100',
      strengthUnit: 'MG',
      packageQuantity: '1',
      form: 'Solution',
      formCode: 'SOLN',
      displayName: 'Pregabalin',
    },
    {
      ndc: '00071101578',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '500',
      strengthUnit: 'MG',
      packageQuantity: '1',
      form: 'Solution',
      formCode: 'SOLN',
      displayName: 'Pregabalin',
    },
    {
      ndc: '00071101641',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '150',
      strengthUnit: 'MG',
      packageQuantity: '1',
      form: 'Capsule',
      formCode: 'CPEP',
      displayName: 'Pregabalin',
    },
    {
      ndc: '00071101668',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '250',
      strengthUnit: 'MG',
      packageQuantity: '1',
      form: 'Capsule',
      formCode: 'CPEP',
      displayName: 'Pregabalin',
    },
  ],
};

export const defaultVariantMock: IDrugVariant = {
  ndc: '00071101568',
  name: 'Lyrica',
  genericName: 'Pregabalin',
  strength: '100',
  strengthUnit: 'MG',
  packageQuantity: '1',
  form: 'Solution',
  formCode: 'SOLN',
  displayName: 'Pregabalin',
};

export const mockDrugSearchState: IDrugSearchState = {
  drugSearchResults: [selectedDrugMock],
  pharmacies: [],
  selectedDrug: selectedDrugMock,
  selectedConfiguration: {
    ndc: defaultVariantMock.ndc,
    quantity: 1,
    supply: 30,
  },
  sourcePharmacies: [],
  timeStamp: 0,
  isGettingPharmacies: false,
};
