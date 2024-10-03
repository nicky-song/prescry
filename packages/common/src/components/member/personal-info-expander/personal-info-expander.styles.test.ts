// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { IconSize } from '../../../theming/icons';
import {
  IPersonalInfoExpanderStyles,
  personalInfoExpanderStyles,
} from './personal-info-expander.styles';

describe('personalInfoExpanderStyles', () => {
  it('has expected styles', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: GrayScaleColor.lightGray,
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
    };

    const expectedStyles: IPersonalInfoExpanderStyles = {
      itemRowViewStyle: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 20,
      },
      rowNameTextStyle: {
        flexBasis: 100,
        flexGrow: 0,
        flexShrink: 0,
        ...getFontFace({ weight: FontWeight.bold }),
        marginTop: 20,
      },
      rowValueTextStyle: {
        flexGrow: 1,
        ...getFontDimensions(FontSize.small),
        ...getFontFace({ weight: FontWeight.bold }),
        marginTop: 20,
      },
      contentViewStyle: {
        flexDirection: 'column',
        flexGrow: 1,
        marginBottom: 20,
      },
      headerTextStyle: {
        ...getFontFace({ weight: FontWeight.bold }),
        margin: 20,
      },
      headerViewStyle: viewStyle,
      iconTextStyle: {
        fontSize: IconSize.regular,
      },
      iconContainerTextStyle: {
        margin: 20,
        textAlign: 'right',
      },
      viewStyle,
    };

    expect(personalInfoExpanderStyles).toEqual(expectedStyles);
  });
});
