// Copyright 2021 Prescryptive Health, Inc.

import { recommendationTopContent } from './recommendation-top.content';

describe('swapRecommendationHeaderTopContent', () => {
  it('has expected content', () => {
    expect(recommendationTopContent.moreAboutLabel()).toEqual('More about');
    expect(recommendationTopContent.daysLabel()).toEqual('days');
    expect(recommendationTopContent.refillLabel()).toEqual('refills');
  });
});
