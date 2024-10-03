// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { getFontFace, FontWeight } from '../../../theming/fonts';
import { IconSize } from '../../../theming/icons';
import { Spacing } from '../../../theming/spacing';
import {
  INavigationLinkStyles,
  navigationLinkStyles,
} from './navigation.link.styles';

describe('navigationLinkStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: INavigationLinkStyles = {
      linkItemTextStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: GrayScaleColor.black,
        paddingTop: Spacing.base,
        paddingBottom: Spacing.base,
      },
      linkLabelTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        color: GrayScaleColor.black,
      },
      iconTextStyle: {
        color: PrimaryColor.darkBlue,
        fontSize: IconSize.small,
        marginLeft: Spacing.threeQuarters,
      },
    };

    expect(navigationLinkStyles).toEqual(expectedStyles);
  });
});
