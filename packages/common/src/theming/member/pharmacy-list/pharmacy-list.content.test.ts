// Copyright 2020 Prescryptive Health, Inc.

import { PharmacyListContent } from './pharmacy-list.content';

describe('PharmacyListContent', () => {
  it('has expected content', () => {
    expect(PharmacyListContent.preamble).toEqual(
      'Tap on an icon to view locations and get directions.'
    );
  });
});
