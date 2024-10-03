// Copyright 2022 Prescryptive Health, Inc.

import {
  ISelectLanguageScreenStyles,
  selectLanguageScreenStyles,
} from './select-language.screen.styles';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

describe('selectLanguageScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISelectLanguageScreenStyles = {
      radioButtonToggleViewStyle: {
        width: '100%',
        marginTop: Spacing.base,
      },
      checkBoxContainerViewStyle: {
        flexDirection: 'column',
      },
      radioButtonViewStyle: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        height: 54,
        marginBottom: Spacing.times2,
      },
      radioButtonTopTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      radioButtonBottomTextStyle: {
        ...getFontFace({ weight: FontWeight.regular }),
      },
    };

    expect(selectLanguageScreenStyles).toEqual(expectedStyles);
  });
});
