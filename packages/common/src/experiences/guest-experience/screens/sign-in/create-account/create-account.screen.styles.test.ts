// Copyright 2021 Prescryptive Health, Inc.

import { NotificationColor } from '../../../../../theming/colors';
import { FontSize } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import {
  createAccountScreenStyles,
  ICreateAccountScreenStyles,
} from './create-account.screen.styles';

describe('createAccountScreenStyles', () => {
  it('should have correct styles', () => {
    const expectedStyles: ICreateAccountScreenStyles = {
      headingTextStyle: {
        marginBottom: Spacing.base,
      },
      bodyViewStyle: {
        alignSelf: 'stretch',
      },
      haveAccountTextStyle: {
        fontSize: FontSize.small,
      },
      haveAccountViewStyle: {
        marginTop: Spacing.times2,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'fit-content',
        flexDirection: 'row',
      },
      errorTextStyle: {
        marginTop: Spacing.threeQuarters,
      },
      errorColorTextStyle: {
        color: NotificationColor.red,
      },
      continueButtonViewStyle: {
        marginTop: Spacing.times2
      }
    };

    expect(createAccountScreenStyles).toEqual(expectedStyles);
  });
});
