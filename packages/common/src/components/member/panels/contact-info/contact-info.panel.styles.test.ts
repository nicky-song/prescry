// Copyright 2022 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  contactInfoPanelStyles,
  IContactInfoPanelStyles,
} from './contact-info.panel.styles';

describe('contactInfoPanelStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IContactInfoPanelStyles = {
      iconTextStyle: {
        marginRight: Spacing.half,
        flexGrow: 0,
        color: PrimaryColor.darkBlue,
      },
      linkTextStyle: {
        borderBottomWidth: 0,
        color: PrimaryColor.darkBlue,
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      rowViewStyle: {
        flexDirection: 'row',
        marginTop: Spacing.threeQuarters,
        alignItems: 'center',
      },
    };

    expect(contactInfoPanelStyles).toEqual(expectedStyles);
  });
});
