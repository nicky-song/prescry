// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { ITagListStyles, tagListStyles } from './tag.list.styles';

describe('tagListStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ITagListStyles = {
      viewStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.half,
      },
    };

    expect(tagListStyles).toEqual(expectedStyles);
  });
});
