// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeMedicationProps } from '../../../components/member/alternative-medication/alternative-medication';
import { IPrescribedMedicationProps } from '../../../components/member/prescribed-medication/prescribed-medication';
import { IRecommendedAlternativesMock } from '../../../utils/alternatives/get-recommended-alternatives.mock';

export const defaultPrescribedMedicationProps: IPrescribedMedicationProps = {
  drugName: 'Invokana',
  drugDetails: {
    strength: '100',
    unit: 'mg',
    formCode: 'tablets',
    quantity: 30,
    supply: 30,
  },
  price: 141.58,
  planPrice: 707.9,
  orderDate: new Date().toDateString(),
};

export const defaultAlternativeMedicationPropsList: IAlternativeMedicationProps[] =
  [
    {
      memberSaves: 56,
      planSaves: 0,
      prescriptionDetailsList: [
        {
          productName: 'Farxiga',
          strength: '100',
          unit: 'mg',
          quantity: 30,
          supply: 30,
          formCode: 'tablets',
        },
      ],
      drugPricing: { memberPays: 85 },
    },
    {
      memberSaves: 50,
      planSaves: 0,
      prescriptionDetailsList: [
        {
          productName: 'Steglatro',
          strength: '100',
          unit: 'mg',
          quantity: 30,
          supply: 30,
          formCode: 'tablets',
        },
      ],
      drugPricing: { memberPays: 91 },
    },
    {
      memberSaves: 42,
      planSaves: 0,
      prescriptionDetailsList: [
        {
          productName: 'metFORMIN HCl',
          strength: '100',
          unit: 'mg',
          quantity: 30,
          supply: 30,
          formCode: 'tablets',
        },
      ],
      drugPricing: { memberPays: 99 },
    },
  ];

const lyricaPrescribedMedicationProps = {
  drugName: 'Lyrica',
  drugDetails: {
    strength: '150',
    unit: 'mg',
    formCode: 'capsules',
    quantity: 30,
    supply: 30,
  },
  price: 141.58,
  planPrice: 707.9,
  key: 'lyrica',
};

const janumetPrescribedMedicationProps = {
  drugName: 'Janumet',
  drugDetails: {
    strength: '500',
    unit: 'mg',
    formCode: 'tablets',
    quantity: 60,
    supply: 30,
  },
  price: 141.58,
  planPrice: 707.9,
  key: 'janumet',
};

const januviaPrescriptionDetails = {
  productName: 'Januvia',
  strength: '100',
  unit: 'mg',
  quantity: 60,
  supply: 30,
  formCode: 'tablets',
  key: 'januvia',
};

const metforminPrescriptionDetails = {
  productName: 'metFORMIN HCl ER',
  strength: '500',
  unit: 'mg',
  quantity: 100,
  supply: 60,
  formCode: 'tablets',
  key: 'metformin',
};

const nesinaPrescriptionDetails = {
  productName: 'Nesina',
  strength: '25',
  unit: 'mg',
  quantity: 30,
  supply: 45,
  formCode: 'tablets',
  key: 'nesina',
};

const onglyzaPrescriptionDetails = {
  productName: 'Onglyza',
  strength: '5',
  unit: 'mg',
  quantity: 30,
  supply: 30,
  formCode: 'tablets',
  key: 'onglyza',
};

const pregablinPrescriptionDetails = {
  productName: 'Pregablin',
  strength: '150',
  unit: 'mg',
  quantity: 30,
  formCode: 'capsules',
  key: 'pregablin',
};

const farxigaPrescriptionDetails = {
  productName: 'Farxiga',
  strength: '100',
  unit: 'mg',
  quantity: 30,
  supply: 30,
  formCode: 'tablets',
  key: 'farxiga',
};

const steglatroPrescriptionDetails = {
  productName: 'Steglatro',
  strength: '100',
  unit: 'mg',
  quantity: 30,
  supply: 30,
  formCode: 'tablets',
  key: 'steglatro',
};

export const planComboBrandRecommendedAlternativesMock: IRecommendedAlternativesMock =
  {
    prescribedMedicationProps: janumetPrescribedMedicationProps,
    alternativeMedicationPropsList: [
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [
          januviaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [
          nesinaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [
          onglyzaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
    ],
  };

export const planComboGenericRecommendedAlternativesMock: IRecommendedAlternativesMock =
  {
    prescribedMedicationProps: janumetPrescribedMedicationProps,
    alternativeMedicationPropsList: [
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [
          januviaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [
          nesinaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [metforminPrescriptionDetails],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
    ],
  };

export const planSingleBrandRecommendedAlternativesMock: IRecommendedAlternativesMock =
  {
    prescribedMedicationProps: janumetPrescribedMedicationProps,
    alternativeMedicationPropsList: [
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [farxigaPrescriptionDetails],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [steglatroPrescriptionDetails],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
      {
        memberSaves: 0,
        planSaves: 56,
        prescriptionDetailsList: [metforminPrescriptionDetails],
        drugPricing: { memberPays: 85, planPays: 85 },
      },
    ],
  };

export const planSingleGenericRecommendedAlternativesMock: IRecommendedAlternativesMock =
  {
    prescribedMedicationProps: lyricaPrescribedMedicationProps,
    alternativeMedicationPropsList: [
      {
        memberSaves: 0,
        planSaves: 116,
        prescriptionDetailsList: [pregablinPrescriptionDetails],
        drugPricing: { memberPays: 25, planPays: 25 },
      },
    ],
  };

export const memberComboBrandRecommendedAlternativesMock: IRecommendedAlternativesMock =
  {
    prescribedMedicationProps: janumetPrescribedMedicationProps,
    alternativeMedicationPropsList: [
      {
        memberSaves: 56,
        planSaves: 0,
        prescriptionDetailsList: [
          januviaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85 },
      },
      {
        memberSaves: 56,
        planSaves: 0,
        prescriptionDetailsList: [
          nesinaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85 },
      },
      {
        memberSaves: 56,
        planSaves: 0,
        prescriptionDetailsList: [
          onglyzaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85 },
      },
    ],
  };

export const memberComboGenericRecommendedAlternativesMock: IRecommendedAlternativesMock =
  {
    prescribedMedicationProps: janumetPrescribedMedicationProps,
    alternativeMedicationPropsList: [
      {
        memberSaves: 56,
        planSaves: 0,
        prescriptionDetailsList: [
          januviaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85 },
      },
      {
        memberSaves: 56,
        planSaves: 0,
        prescriptionDetailsList: [
          nesinaPrescriptionDetails,
          metforminPrescriptionDetails,
        ],
        drugPricing: { memberPays: 85 },
      },
      {
        memberSaves: 56,
        planSaves: 0,
        prescriptionDetailsList: [metforminPrescriptionDetails],
        drugPricing: { memberPays: 85 },
      },
    ],
  };

export const memberSingleBrandRecommendedAlternativesMock: IRecommendedAlternativesMock =
  {
    prescribedMedicationProps: defaultPrescribedMedicationProps,
    alternativeMedicationPropsList: defaultAlternativeMedicationPropsList,
  };

export const memberSingleGenericRecommendedAlternativesMock: IRecommendedAlternativesMock =
  {
    prescribedMedicationProps: lyricaPrescribedMedicationProps,
    alternativeMedicationPropsList: [
      {
        memberSaves: 116,
        planSaves: 0,
        prescriptionDetailsList: [pregablinPrescriptionDetails],
        drugPricing: { memberPays: 25 },
      },
    ],
  };
