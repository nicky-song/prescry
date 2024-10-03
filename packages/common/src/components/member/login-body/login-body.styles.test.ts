// Copyright 2021 Prescryptive Health, Inc.

import { ILoginBodyStyles, loginBodyStyles } from './login-body.styles';
import { Spacing } from '../../../theming/spacing';
import { getFontDimensions, FontSize } from '../../../theming/fonts';

describe('loginBodyStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ILoginBodyStyles = {
      dateWrapperViewStyle: {
        marginBottom: Spacing.times1pt5,
        marginTop: Spacing.base,
      },
      loginBodyContainerViewStyle: {
        flexDirection: 'column',
      },
      textFieldsViewStyle: {
        marginTop: Spacing.base,
      },
      errorTextStyle: {
        marginTop: Spacing.threeQuarters,
      },
      helpTextStyle: {
        marginTop: Spacing.threeQuarters,
        ...getFontDimensions(FontSize.small),
      },
    };

    expect(loginBodyStyles).toEqual(expectedStyles);
  });
});
