// Copyright 2021 Prescryptive Health, Inc.

import { FontSize } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  ITermsConditionsAndPrivacyLinksStyles,
  termsConditionsAndPrivacyLinksStyles,
} from './terms-conditions-and-privacy.links.styles';

describe('termsConditionsAndPrivacyLinksStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ITermsConditionsAndPrivacyLinksStyles = {
      dividerTextStyle: {
        fontSize: FontSize.small,
        marginLeft: Spacing.half,
        marginRight: Spacing.half,
        flexGrow: 0,
      },
      multiLineTextStyle: {
        marginBottom: Spacing.half,
      },
      textStyle: {
        fontSize: FontSize.small,
      },
      viewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
    };

    expect(termsConditionsAndPrivacyLinksStyles).toEqual(expectedStyles);
  });
});
