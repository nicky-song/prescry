// Copyright 2018 Prescryptive Health, Inc.

import { IMedication } from '../../../models/medication';
import { IRecommendation } from '../../../models/recommendation';
const mockMedications: IMedication[] = [
  {
    form: 'capsules',
    genericName: 'Pregablin',
    genericProductId: '27250050000350',
    medicationId: '00002035302',
    name: 'Lyrica',
    strength: '150',
    units: 'mg',
  },
  {
    form: 'capsules',
    genericName: 'Gabapentin',
    genericProductId: '72600030000140',
    medicationId: '00228266711',
    name: 'Gabapentin',
    strength: '400',
    units: 'mg',
  },
  {
    form: 'tablets',
    genericName: 'Imipramine HCl',
    genericProductId: '58200050100315',
    medicationId: '00440763690',
    name: 'Imipramine HCl',
    strength: '50',
    units: 'mg',
  },
];
export const mockYouSaveAlternativeRecommendations: IRecommendation[] = [
  {
    identifier: 'recommendation1',
    rule: {
      alternativeSubstitution: {
        to: [
          {
            fillOptions: {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
            medication: mockMedications[1],
          },
          {
            fillOptions: {
              authorizedRefills: 5,
              count: 45,
              daysSupply: 45,
              fillNumber: 1,
            },
            medication: mockMedications[2],
          },
        ],
        toMedications: [mockMedications[1], mockMedications[2]],
        savings: '116',
        planSavings: '25',
      },
      description: 'lyrica to pregablin',
      medication: mockMedications[0],
      planGroupNumber: '10006579',
      type: 'alternativeSubstitution',
      minimumPlanSavingsAmount: '20',
      minimumSavingsAmount: '10',
    },
    savings: 116,
    type: 'alternativeSubstitution',
  },
];

export const mockPlanSaveAlternativeRecommendations: IRecommendation[] = [
  {
    identifier: 'recommendation1',
    rule: {
      alternativeSubstitution: {
        to: [
          {
            fillOptions: {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
            medication: mockMedications[1],
          },
          {
            fillOptions: {
              authorizedRefills: 5,
              count: 45,
              daysSupply: 45,
              fillNumber: 1,
            },
            medication: mockMedications[2],
          },
        ],
        toMedications: [mockMedications[1], mockMedications[2]],
        savings: '9',
        planSavings: '25',
      },
      description: 'lyrica to pregablin',
      medication: mockMedications[0],
      planGroupNumber: '10006579',
      type: 'alternativeSubstitution',
      minimumPlanSavingsAmount: '20',
      minimumSavingsAmount: '10',
    },
    savings: 9,
    type: 'alternativeSubstitution',
  },
];

export const mockYouSaveGenericRecommendations: IRecommendation[] = [
  {
    identifier: 'recommendation1',
    rule: {
      description: 'lyrica to pregablin',
      genericSubstitution: {
        to: {
          fillOptions: {
            authorizedRefills: 5,
            count: 90,
            daysSupply: 30,
            fillNumber: 5,
          },
          medication: mockMedications[1],
        },
        toMedication: mockMedications[1],
        savings: '116',
        planSavings: '25',
      },
      medication: mockMedications[0],
      planGroupNumber: '10006579',
      type: 'genericSubstitution',
      minimumPlanSavingsAmount: '20',
      minimumSavingsAmount: '10',
    },
    savings: 116,
    type: 'genericSubstitution',
  },
];

export const mockPlanSaveGenericRecommendations: IRecommendation[] = [
  {
    identifier: 'recommendation1',
    rule: {
      description: 'lyrica to pregablin',
      genericSubstitution: {
        to: {
          fillOptions: {
            authorizedRefills: 5,
            count: 90,
            daysSupply: 30,
            fillNumber: 5,
          },
          medication: mockMedications[1],
        },
        toMedication: mockMedications[1],
        savings: '9',
        planSavings: '25',
      },
      medication: mockMedications[0],
      planGroupNumber: '10006579',
      type: 'genericSubstitution',
      minimumPlanSavingsAmount: '20',
      minimumSavingsAmount: '10',
    },
    savings: 9,
    type: 'genericSubstitution',
  },
];
