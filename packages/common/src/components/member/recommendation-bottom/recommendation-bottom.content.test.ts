// Copyright 2021 Prescryptive Health, Inc.

import { recommendationBottomContent } from './recommendation-bottom.content';

describe('swapRecommendationHeaderTopContent', () => {
  it('has expected content', () => {
    expect(recommendationBottomContent.youPayLabel()).toEqual('You pay');
    expect(recommendationBottomContent.employerPayLabel()).toEqual(
      'Your plan pays'
    );
    expect(recommendationBottomContent.sentToText()).toEqual('Sent to');
  });
});
