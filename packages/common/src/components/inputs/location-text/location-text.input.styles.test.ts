// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import {
  GrayScaleColor,
  NotificationColor,
  PrimaryColor,
} from '../../../theming/colors';
import { FontSize, FontWeight } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { IconSize } from '../../../theming/icons';
import {
  ILocationTextInputStyles,
  locationTextInputStyles,
} from './location-text.input.styles';

describe('locationTextInputStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ILocationTextInputStyles = {
      inputTextStyle: {
        fontSize: FontSize.body,
        fontWeight: FontWeight.regular,
        color: GrayScaleColor.black,
        width: '100%',
        paddingTop: Spacing.threeQuarters,
        paddingBottom: Spacing.threeQuarters,
        paddingLeft: Spacing.base,
        flex: 1,
        ...{ outlineStyle: 'none' },
        borderColor: GrayScaleColor.white,
        borderWidth: 0,
      },
      closeIconStyle: {
        color: GrayScaleColor.borderLines,
        fontSize: IconSize.small,
      },
      crossBorderStyle: {
        height: `calc(100% - ${Spacing.half}px)`,
        marginVertical: Spacing.quarter,
        borderLeftColor: GrayScaleColor.borderLines,
        borderLeftWidth: 1,
      },
      locationIconStyle: {
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
      },
      locationIconTextStyle: {
        color: PrimaryColor.darkBlue,
        fontSize: IconSize.small,
      },
      errorTextStyle: {
        color: NotificationColor.red,
        marginBottom: Spacing.times1pt5,
        lineHeight: 16,
      },
      outerViewStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: GrayScaleColor.borderLines,
        borderRadius: BorderRadius.half,
        width: '100%',
      },
    };

    expect(locationTextInputStyles).toEqual(expectedStyles);
  });
});
