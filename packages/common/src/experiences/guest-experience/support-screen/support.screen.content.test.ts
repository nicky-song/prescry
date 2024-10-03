// Copyright 2020 Prescryptive Health, Inc.

import {
  ISupportScreenContent,
  supportScreenContent,
} from './support.screen.content';

describe('supportScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: ISupportScreenContent = {
      title: 'Contact us',
    };

    expect(supportScreenContent).toEqual(expectedContent);
  });
});
