// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { baseTextStyle } from '../../text/base-text/base-text.style';
import { actionCardStyles, IActionCardStyles } from './action.card.styles';

describe('actionCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IActionCardStyles = {
      contentContainerViewStyle: {
        flexDirection: 'column',
      },
      imageStyle: {
        height: 64,
        width: 64,
        marginBottom: Spacing.times2,
      },
      subTitleTextStyle: {
        ...baseTextStyle.commonBaseTextStyle,
        ...baseTextStyle.defaultSizeTextStyle,
        ...baseTextStyle.regularWeightTextStyle,
        marginTop: Spacing.half,
      },
      buttonViewStyle: {
        marginTop: Spacing.times2,
      },
    };

    expect(actionCardStyles).toEqual(expectedStyles);
  });
});
