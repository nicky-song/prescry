// Copyright 2021 Prescryptive Health, Inc.

import {
  IDrugSearchResult,
  IDrugVariantFormPackage,
  IDrugVariantForms,
  IResponseDrugVariant,
} from '../../../models/drug-search-response';
import { IResponseDrug } from '../api/api-v1.elastic-drug-search';

export const drugSearchResponseDataMock = {
  drugs: [
    {
      drugType: 'Generic',
      formAbbreviation: 'Soln',
      genericName: 'Infant Foods',
      name: 'Pregestimil',
      ndc: '00002120001',
      packageQuantity: '1',
      strength: '500-1900',
      strengthUnit: 'MBQ/ML',
      formCode: 'SOLN',
      modeQuantity: 90,
      modeDaysSupply: 5,
      displayName: 'Pregestimil (Infant Foods)',
    },
    {
      ndc: '00071101568',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '100',
      strengthUnit: 'MG',
      drugType: 'Brand',
      packageQuantity: '1',
      packageType: 'Bottle',
      formAbbreviation: 'Capsule',
      formCode: 'CPEP',
      modeQuantity: 60,
      modeDaysSupply: 60,
      displayName: 'Lyrica (Pregabalin)',
    },
    {
      ndc: '00071101641',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '150',
      strengthUnit: 'MG',
      drugType: 'Brand',
      packageQuantity: '1',
      formAbbreviation: 'Capsule',
      formCode: 'CPEP',
      modeQuantity: 90,
      modeDaysSupply: 90,
      displayName: 'Lyrica (Pregabalin)',
    },
    {
      ndc: '00071101668',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '150',
      strengthUnit: 'MG',
      drugType: 'Brand',
      packageQuantity: '1',
      formCode: 'CPEP',
      formAbbreviation: 'Tablet',
      displayName: 'Lyrica (Pregabalin)',
    },
    {
      ndc: '71741007230',
      name: 'PreGenna',
      genericName: 'Prenatal Vit w/ Fe Bisg-FA',
      strength: '20-1',
      strengthUnit: 'MG',
      drugType: 'Brand',
      packageQuantity: '1',
      formCode: 'TABS',
      formAbbreviation: 'Tablet',
      displayName: 'PreGenna (Prenatal Vit w/ Fe Bisg-FA)',
    },
    {
      ndc: '72919008330',
      name: 'PreGen DHA',
      genericName: 'Prenatal MV-Min-Fe Cbn-FA-DHA',
      strength: '28-1-35',
      strengthUnit: 'MG',
      drugType: 'Brand',
      packageQuantity: '1',
      formCode: 'CPEP',
      formAbbreviation: 'Capsule',
      displayName: 'PreGen DHA (Prenatal MV-Min-Fe Cbn-FA-DHA)',
    },
    {
      ndc: '00052031510',
      name: 'Pregnyl',
      genericName: 'Chorionic Gonadotropin',
      strength: '10000',
      strengthUnit: 'UNIT',
      drugType: 'Brand',
      packageQuantity: '1',
      formAbbreviation: 'For Solution',
      formCode: 'SOLN',
      displayName: 'Pregnyl (Chorionic Gonadotropin)',
    },
    {
      ndc: '00071102701',
      name: 'Lyrica CR',
      genericName: 'Pregabalin ER',
      strength: '165',
      strengthUnit: 'MG',
      drugType: 'Brand',
      packageQuantity: '1',
      formAbbreviation: 'Tablet ER 24HR',
      formCode: 'TABS',
      displayName: 'Lyrica CR (Pregabalin ER)',
    },
  ],
  totalMatches: 8,
};

export const pregestimilSearchResultMock: IDrugSearchResult = {
  name: 'Pregestimil (Infant Foods)',
  forms: ['Soln'],
  drugVariants: [
    {
      form: 'Soln',
      genericName: 'Infant Foods',
      name: 'Pregestimil',
      ndc: '00002120001',
      packageQuantity: '1',
      strength: '500-1900',
      strengthUnit: 'MBQ/ML',
      formCode: 'SOLN',
      modeQuantity: 90,
      modeDaysSupply: 5,
      displayName: 'Pregestimil (Infant Foods)',
    },
  ],
};

export const lyricaSearchResultMock: IDrugSearchResult = {
  name: 'Lyrica (Pregabalin)',
  forms: ['Capsule', 'Tablet'],
  drugVariants: [
    {
      ndc: '00071101568',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '100',
      strengthUnit: 'MG',
      packageQuantity: '1',
      form: 'Capsule',
      formCode: 'CPEP',
      modeQuantity: 60,
      modeDaysSupply: 60,
      displayName: 'Lyrica (Pregabalin)',
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
      modeQuantity: 90,
      modeDaysSupply: 90,
      displayName: 'Lyrica (Pregabalin)',
    },
    {
      ndc: '00071101668',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '150',
      strengthUnit: 'MG',
      packageQuantity: '1',
      form: 'Tablet',
      formCode: 'CPEP',
      displayName: 'Lyrica (Pregabalin)',
      modeQuantity: undefined,
      modeDaysSupply: undefined,
    },
  ],
};

export const preGennaSearchResultMock: IDrugSearchResult = {
  name: 'PreGenna (Prenatal Vit w/ Fe Bisg-FA)',
  forms: ['Tablet'],
  drugVariants: [
    {
      ndc: '71741007230',
      name: 'PreGenna',
      genericName: 'Prenatal Vit w/ Fe Bisg-FA',
      strength: '20-1',
      strengthUnit: 'MG',
      packageQuantity: '1',
      form: 'Tablet',
      formCode: 'TABS',
      modeQuantity: undefined,
      modeDaysSupply: undefined,
      displayName: 'PreGenna (Prenatal Vit w/ Fe Bisg-FA)',
    },
  ],
};

export const preGenDhaSearchResultMock: IDrugSearchResult = {
  name: 'PreGen DHA (Prenatal MV-Min-Fe Cbn-FA-DHA)',
  forms: ['Capsule'],
  drugVariants: [
    {
      ndc: '72919008330',
      name: 'PreGen DHA',
      genericName: 'Prenatal MV-Min-Fe Cbn-FA-DHA',
      strength: '28-1-35',
      strengthUnit: 'MG',
      packageQuantity: '1',
      formCode: 'CPEP',
      form: 'Capsule',
      modeQuantity: undefined,
      modeDaysSupply: undefined,
      displayName: 'PreGen DHA (Prenatal MV-Min-Fe Cbn-FA-DHA)',
    },
  ],
};

export const pregnylSearchResultMock: IDrugSearchResult = {
  name: 'Pregnyl (Chorionic Gonadotropin)',
  forms: ['For Solution'],
  drugVariants: [
    {
      ndc: '00052031510',
      name: 'Pregnyl',
      genericName: 'Chorionic Gonadotropin',
      strength: '10000',
      strengthUnit: 'UNIT',
      packageQuantity: '1',
      formCode: 'SOLN',
      form: 'For Solution',
      modeQuantity: undefined,
      modeDaysSupply: undefined,
      displayName: 'Pregnyl (Chorionic Gonadotropin)',
    },
  ],
};

export const lyricaCrSearchResultMock: IDrugSearchResult = {
  name: 'Lyrica CR (Pregabalin ER)',
  forms: ['Tablet ER 24HR'],
  drugVariants: [
    {
      ndc: '00071102701',
      name: 'Lyrica CR',
      genericName: 'Pregabalin ER',
      strength: '165',
      strengthUnit: 'MG',
      packageQuantity: '1',
      formCode: 'TABS',
      form: 'Tablet ER 24HR',
      modeQuantity: undefined,
      modeDaysSupply: undefined,
      displayName: 'Lyrica CR (Pregabalin ER)',
    },
  ],
};

export const drugSearchResultsMock: IDrugSearchResult[] = [
  pregestimilSearchResultMock,
  lyricaSearchResultMock,
  preGennaSearchResultMock,
  preGenDhaSearchResultMock,
  pregnylSearchResultMock,
  lyricaCrSearchResultMock,
];

export const elasticDrugDataMock: IResponseDrug[] = [
  {
    variants: [
      {
        forms: [
          {
            formValue: 'form-value-mock-1',
            formCode: 'form-code-mock-1',
            representativeNdc: 'representative-ndc-mock-1',
            packages: [
              {
                packageQuantity: 'package-quantity-mock-1',
                representativeNdc: 'representative-ndc-mock-1',
                modeQuantity: 'mode-quantity-mock-1',
                modeDaysSupply: 'mode-days-supply-mock-1',
              },
            ] as IDrugVariantFormPackage[],
            strength: 'strength-mock-1',
            strengthUnit: 'strength-unit-1',
            modeQuantity: 1,
            modeDaysSupply: 1,
          },
        ] as IDrugVariantForms[],
      },
    ] as IResponseDrugVariant[],
    representativeNdc: 'representative-ndc-mock',
    displayName: 'display-name-mock',
    drugForms: ['drug-form-mock-1'] as string[],
  } as IResponseDrug,
  {
    variants: [
      {
        forms: [
          {
            formValue: 'form-value-mock-2',
            formCode: 'form-code-mock-2',
            representativeNdc: 'representative-ndc-mock-2',
            packages: [
              {
                packageQuantity: 'package-quantity-mock-2',
                representativeNdc: 'representative-ndc-mock-2',
                modeQuantity: 'mode-quantity-mock-2',
                modeDaysSupply: 'mode-days-supply-mock-2',
              },
            ] as IDrugVariantFormPackage[],
            strength: 'strength-mock-2',
            strengthUnit: 'strength-unit-2',
            modeQuantity: 2,
            modeDaysSupply: 2,
          },
        ] as IDrugVariantForms[],
      },
    ] as IResponseDrugVariant[],
    representativeNdc: 'representative-ndc-mock',
    displayName: 'display-name-mock',
    drugForms: ['drug-form-mock-2'] as string[],
  } as IResponseDrug,
  {
    variants: [
      {
        forms: [
          {
            formValue: 'form-value-mock-3',
            formCode: 'form-code-mock-3',
            representativeNdc: 'representative-ndc-mock-3',
            packages: [
              {
                packageQuantity: 'package-quantity-mock-3',
                representativeNdc: 'representative-ndc-mock-3',
                modeQuantity: 'mode-quantity-mock-3',
                modeDaysSupply: 'mode-days-supply-mock-3',
              },
            ] as IDrugVariantFormPackage[],
            strength: 'strength-mock-3',
            strengthUnit: 'strength-unit-3',
            modeQuantity: 3,
            modeDaysSupply: 3,
          },
        ] as IDrugVariantForms[],
      },
    ] as IResponseDrugVariant[],
    representativeNdc: 'representative-ndc-mock',
    displayName: 'display-name-mock',
    drugForms: ['drug-form-mock-3'] as string[],
  } as IResponseDrug,
  {
    variants: [
      {
        forms: [
          {
            formValue: 'form-value-mock-4',
            formCode: 'form-code-mock-4',
            representativeNdc: 'representative-ndc-mock-4',
            packages: [
              {
                packageQuantity: 'package-quantity-mock-4',
                representativeNdc: 'representative-ndc-mock-4',
                modeQuantity: 'mode-quantity-mock-4',
                modeDaysSupply: 'mode-days-supply-mock-4',
              },
            ] as IDrugVariantFormPackage[],
            strength: 'strength-mock-4',
            strengthUnit: 'strength-unit-4',
            modeQuantity: 4,
            modeDaysSupply: 4,
          },
        ] as IDrugVariantForms[],
      },
    ] as IResponseDrugVariant[],
    representativeNdc: 'representative-ndc-mock',
    displayName: 'display-name-mock',
    drugForms: ['drug-form-mock-4'] as string[],
  } as IResponseDrug,
];
