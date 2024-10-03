// Copyright 2022 Prescryptive Health, Inc.

import { FontSize, getFontDimensions } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  cobrandingHeaderStyles,
  ICobrandingHeaderStyles,
} from './cobranding-header.styles';

describe('cobrandingHeaderStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ICobrandingHeaderStyles = {
      containerViewStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
      },
      titleTextStyle: {
        ...getFontDimensions(FontSize.xSmall),
      },
      logoStyle: {
        marginLeft: Spacing.half,
      },
    };

    expect(cobrandingHeaderStyles).toEqual(expectedStyles);
  });
});
