// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IRxIdBackContentStyles,
  rxIdBackContentStyles,
} from './rx-id-back-content.styles';

const headerTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  fontSize: 10,
  lineHeight: 15,
};

const descriptionTextStyle: TextStyle = {
  fontSize: 9,
  lineHeight: 12,
};

const descriptionMarginTextStyle: TextStyle = {
  ...descriptionTextStyle,
  marginTop: Spacing.eighth,
};

const titleTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  fontSize: 10,
  lineHeight: 12,
};

describe('rxIdBackContentStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IRxIdBackContentStyles = {
      headerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      memberSinceTextStyle: {
        ...headerTextStyle,
      },
      myrxURLTextStyle: {
        ...headerTextStyle,
      },
      lineSeparatorViewStyle: {
        marginTop: Spacing.threeQuarters,
      },
      membersTitleTextStyle: {
        ...titleTextStyle,
        marginTop: Spacing.threeQuarters,
      },
      membersDescriptionTextStyle: {
        ...descriptionMarginTextStyle,
      },
      claimsTitleTextStyle: {
        ...titleTextStyle,
        marginTop: Spacing.threeQuarters,
      },
      claimsDescriptionTextStyle: {
        ...descriptionMarginTextStyle,
      },
      sendPrescriptionsInstructionTextStyle: {
        ...descriptionTextStyle,
        marginTop: Spacing.half,
      },
      prescryptiveAddressTextStyle: {
        ...descriptionMarginTextStyle,
      },
    };

    expect(rxIdBackContentStyles).toEqual(expectedStyles);
  });
});
