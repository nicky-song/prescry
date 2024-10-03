// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { NotificationColor } from '../../../theming/colors';
import { getFontFace, FontWeight } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  alternativeSavingsCardStyles,
  IAlternativeSavingsCardStyles,
} from './alternative-savings.card.styles';

describe('alternativeSavingsCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAlternativeSavingsCardStyles = {
      viewStyle: {
        backgroundColor: NotificationColor.lightGreen,
        borderRadius: BorderRadius.normal,
        padding: Spacing.base,
      },
      contentViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
      },
      messageTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        marginLeft: Spacing.base,
        flexWrap: 'wrap',
      },
    };

    expect(alternativeSavingsCardStyles).toEqual(expectedStyles);
  });
});
