// Copyright 2022 Prescryptive Health, Inc.

import { RecommendationType } from '@phx/common/src/models/recommendation';
import {
  recommendationsMapper,
  buildRecommendationsMap,
} from './recommendations';

import {
  recommendationsMock,
  offersMock,
  recommendationMockPlan,
} from './__mocks__/recommendations';

describe('Recommendations', () => {
  describe('recommendationsMapper', () => {
    test('it maps recommendations', () => {
      const result = recommendationsMapper(recommendationsMock, offersMock);
      expect(result.length).toBe(3);
    });

    test('it uses memberSaves for savingsAmount if primarySaver is member', () => {
      const result = recommendationsMapper(
        [recommendationsMock[1]],
        offersMock
      );
      expect(result[0].memberSaves).toEqual(
        Number(recommendationsMock[1].rule.alternativeSubstitution?.savings)
      );
    });

    test('it uses planSaves for savingsAmount if primarySaver is plan', () => {
      const result = recommendationsMapper(
        [recommendationMockPlan],
        offersMock
      );
      expect(result[0].planSaves).toEqual(
        Number(recommendationMockPlan.rule.alternativeSubstitution?.planSavings)
      );
    });

    test.each([
      ['notification' as RecommendationType],
      ['reversal' as RecommendationType],
    ])(
      'returns empty array for notification or reversal type',
      (recType: RecommendationType) => {
        const result = recommendationsMapper(
          [{ ...recommendationsMock[0], type: recType }],
          offersMock
        );

        expect(result).toEqual([]);
      }
    );
  });

  describe('buildRecommendationsMap', () => {
    test('it loads the map', () => {
      const result = buildRecommendationsMap(recommendationsMock);
      expect(result.size).toBe(recommendationsMock.length);
    });
  });
});
