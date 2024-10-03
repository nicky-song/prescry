// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import { FontSize } from '../../../../../theming/theme';
import {
  IShoppingConfirmationScreenStyle,
  shoppingConfirmationScreenStyle,
} from './shopping-confirmation.screen.style';

describe('shoppingConfirmationScreenStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: IShoppingConfirmationScreenStyle = {
      bodyContentViewStyle: {
        paddingRight: Spacing.times1pt5,
        paddingLeft: Spacing.times1pt5,
      },
      bodyViewStyle: {
        alignContent: 'center',
        alignSelf: 'stretch',
        flexGrow: 1,
      },
      checkImageStyle: {
        height: 16,
        width: 16,
        marginRight: Spacing.base,
      },
      footerViewStyle: {
        paddingTop: Spacing.times2,
        paddingRight: Spacing.times1pt5,
        paddingBottom: Spacing.base,
        paddingLeft: Spacing.times1pt5,
        alignSelf: 'stretch',
      },
      headerViewStyle: {
        paddingBottom: 0,
      },
      heading2TextStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
        fontSize: FontSize.ultra,
      },
      heading3TextStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
        fontSize: FontSize.larger,
      },
      baseButtonTextStyle: {
        textTransform: 'uppercase',
      },
      titleViewStyle: { flexDirection: 'row', alignItems: 'center' },
    };

    expect(shoppingConfirmationScreenStyle).toEqual(expectedStyle);
  });
});
