// Copyright 2021 Prescryptive Health, Inc.

import {
  searchButtonStyles,
  ISearchButtonStyles,
} from './search.button.styles';
import { Spacing } from '../../../theming/spacing';
import { PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('searchButtonStyles', () => {
  it('has expected buttonViewStyle styles', () => {
    const expectedSearchButtonStyles: ISearchButtonStyles = {
      buttonViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
        paddingBottom: Spacing.base,
        paddingTop: Spacing.base,
        borderColor: PrimaryColor.prescryptivePurple,
      },
      buttonContentViewStyle: {
        flexDirection: 'row',
      },
      textStyle: {
        marginLeft: Spacing.times1pt25,
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
    };

    expect(searchButtonStyles).toEqual(expectedSearchButtonStyles);
  });
});
