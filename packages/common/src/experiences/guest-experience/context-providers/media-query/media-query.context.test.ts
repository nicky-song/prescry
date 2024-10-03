// Copyright 2021 Prescryptive Health, Inc.

import {
  defaultMediaQueryContext,
  IMediaQueryContext,
} from './media-query.context';

describe('MediaQueryContext', () => {
  it('has expected default context', () => {
    const expectedContext: IMediaQueryContext = {
      mediaSize: 'small',
      windowHeight: 0,
      windowWidth: 0,
    };

    expect(defaultMediaQueryContext).toEqual(expectedContext);
  });
});
