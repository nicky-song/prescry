// Copyright 2020 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import { homeFeedListStyle, IHomeFeedListStyle } from './home-feed-list.style';

describe('homeFeedListStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IHomeFeedListStyle = {
      homeFeedViewStyle: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
        marginBottom: Spacing.times1pt25,
      },
      homeFeedListItemViewStyle: {
        marginBottom: Spacing.half,
        marginTop: Spacing.half,
      },
    };
    expect(homeFeedListStyle).toEqual(expectedStyles);
  });
});
