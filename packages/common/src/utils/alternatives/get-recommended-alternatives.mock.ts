// Copyright 2022 Prescryptive Health, Inc.

import { IPrescribedMedicationProps } from '../../components/member/prescribed-medication/prescribed-medication';
import { IAlternativeMedicationProps } from '../../components/member/alternative-medication/alternative-medication';
import {
  defaultAlternativeMedicationPropsList,
  defaultPrescribedMedicationProps,
  memberComboBrandRecommendedAlternativesMock,
  memberComboGenericRecommendedAlternativesMock,
  memberSingleBrandRecommendedAlternativesMock,
  memberSingleGenericRecommendedAlternativesMock,
  planComboBrandRecommendedAlternativesMock,
  planComboGenericRecommendedAlternativesMock,
  planSingleBrandRecommendedAlternativesMock,
  planSingleGenericRecommendedAlternativesMock,
} from '../../experiences/guest-experience/__mocks__/recommended-alternatives.mock';
import { IWhoSaves } from '../../models/claim-alert/claim-alert';

export interface IRecommendedAlternativesMock {
  prescribedMedicationProps: IPrescribedMedicationProps;
  alternativeMedicationPropsList: IAlternativeMedicationProps[];
}

export const getRecommendedAlternativesMock = (
  whoSavesMock?: IWhoSaves,
  isCombinationMock?: boolean,
  isBrandMock?: boolean
): IRecommendedAlternativesMock => {
  if (
    whoSavesMock === undefined ||
    isCombinationMock === undefined ||
    isBrandMock === undefined
  ) {
    return {
      prescribedMedicationProps: defaultPrescribedMedicationProps,
      alternativeMedicationPropsList: defaultAlternativeMedicationPropsList,
    };
  }
  if (whoSavesMock === 'plan' && isCombinationMock && isBrandMock) {
    return planComboBrandRecommendedAlternativesMock;
  } else if (whoSavesMock === 'plan' && isCombinationMock && !isBrandMock) {
    return planComboGenericRecommendedAlternativesMock;
  } else if (whoSavesMock === 'plan' && !isCombinationMock && isBrandMock) {
    return planSingleBrandRecommendedAlternativesMock;
  } else if (whoSavesMock === 'plan' && !isCombinationMock && !isBrandMock) {
    return planSingleGenericRecommendedAlternativesMock;
  } else if (whoSavesMock === 'member' && isCombinationMock && isBrandMock) {
    return memberComboBrandRecommendedAlternativesMock;
  } else if (whoSavesMock === 'member' && isCombinationMock && !isBrandMock) {
    return memberComboGenericRecommendedAlternativesMock;
  } else if (whoSavesMock === 'member' && !isCombinationMock && isBrandMock) {
    return memberSingleBrandRecommendedAlternativesMock;
  } else if (whoSavesMock === 'member' && !isCombinationMock && !isBrandMock) {
    return memberSingleGenericRecommendedAlternativesMock;
  } else {
    return {
      prescribedMedicationProps: defaultPrescribedMedicationProps,
      alternativeMedicationPropsList: defaultAlternativeMedicationPropsList,
    };
  }
};
