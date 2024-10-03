// Copyright 2021 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  IApplicationHeaderStyles,
  applicationHeaderStyles,
} from './application-header.styles';

describe('applicationHeaderStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: IApplicationHeaderStyles = {
      cardAppearanceBorderViewStyle: {
        borderTopLeftRadius: BorderRadius.times2,
        borderTopRightRadius: BorderRadius.times2,
        backgroundColor: GrayScaleColor.white,
        overflow: 'visible',
        height: Spacing.threeQuarters,
        marginTop: 0,
      },
      cardAppearanceWrapperViewStyle: {
        backgroundColor: PrimaryColor.prescryptivePurple,
        height: 10,
        marginTop: -6,
      },
      hamburgerReseterViewStyle: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        marginLeft: Spacing.threeQuarters,
      },
      headerLogoViewStyle: {
        flex: 1,
        alignItems: 'center',
      },
      headerMyPrescryptineBrandingViewStyle: {
        alignItems: 'center',
        backgroundColor: GrayScaleColor.white,
        flexDirection: 'row',
        flexGrow: 0,
        height: 80,
        paddingTop: Spacing.times1pt5,
        paddingRight: Spacing.times1pt5,
        paddingBottom: Spacing.times1pt5,
        paddingLeft: Spacing.times1pt5,
        marginBottom: Spacing.base,
      },
      iconViewStyle: {
        marginRight: -Spacing.base,
      },
      navigateBackViewStyle: {
        flex: 1,
      },
      titleViewStyle: {
        flexDirection: 'row',
      },
      profileAvatarContainerViewStyle: {
        alignItems: 'center',
        flexDirection: 'row-reverse',
      },
      profileAvatarViewStyle: {
        marginRight: -Spacing.quarter,
      },
    };

    expect(applicationHeaderStyles).toEqual(expectedStyle);
  });
});
