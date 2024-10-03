// Copyright 2022 Prescryptive Health, Inc.

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
import { getRecommendedAlternativesMock } from './get-recommended-alternatives.mock';

describe('getRecommendedAlternativesMock', () => {
  const planSaves: IWhoSaves = 'plan';
  const memberSaves: IWhoSaves = 'member';

  it.each([
    [planSaves, true, true],
    [planSaves, true, false],
    [planSaves, false, true],
    [planSaves, false, false],
    [memberSaves, true, true],
    [memberSaves, true, false],
    [memberSaves, false, true],
    [memberSaves, false, false],
    [undefined, undefined, undefined],
  ])(
    'returned expected IRecommendedAlternativesMock object with whoSaves: %s, isCombination: %s, isBrand: %s',
    (
      whoSavesMock: IWhoSaves | undefined,
      isCombinationMock: boolean | undefined,
      isBrandMock: boolean | undefined
    ) => {
      const recommendedAlternativesMock = getRecommendedAlternativesMock(
        whoSavesMock,
        isCombinationMock,
        isBrandMock
      );

      if (whoSavesMock === 'plan' && isCombinationMock && isBrandMock) {
        expect(recommendedAlternativesMock).toEqual(
          planComboBrandRecommendedAlternativesMock
        );
      } else if (whoSavesMock === 'plan' && isCombinationMock && !isBrandMock) {
        expect(recommendedAlternativesMock).toEqual(
          planComboGenericRecommendedAlternativesMock
        );
      } else if (whoSavesMock === 'plan' && !isCombinationMock && isBrandMock) {
        expect(recommendedAlternativesMock).toEqual(
          planSingleBrandRecommendedAlternativesMock
        );
      } else if (
        whoSavesMock === 'plan' &&
        !isCombinationMock &&
        !isBrandMock
      ) {
        expect(recommendedAlternativesMock).toEqual(
          planSingleGenericRecommendedAlternativesMock
        );
      } else if (
        whoSavesMock === 'member' &&
        isCombinationMock &&
        isBrandMock
      ) {
        expect(recommendedAlternativesMock).toEqual(
          memberComboBrandRecommendedAlternativesMock
        );
      } else if (
        whoSavesMock === 'member' &&
        isCombinationMock &&
        !isBrandMock
      ) {
        expect(recommendedAlternativesMock).toEqual(
          memberComboGenericRecommendedAlternativesMock
        );
      } else if (
        whoSavesMock === 'member' &&
        !isCombinationMock &&
        isBrandMock
      ) {
        expect(recommendedAlternativesMock).toEqual(
          memberSingleBrandRecommendedAlternativesMock
        );
      } else if (
        whoSavesMock === 'member' &&
        !isCombinationMock &&
        !isBrandMock
      ) {
        expect(recommendedAlternativesMock).toEqual(
          memberSingleGenericRecommendedAlternativesMock
        );
      } else {
        expect(recommendedAlternativesMock).toEqual({
          prescribedMedicationProps: defaultPrescribedMedicationProps,
          alternativeMedicationPropsList: defaultAlternativeMedicationPropsList,
        });
      }
    }
  );
});
