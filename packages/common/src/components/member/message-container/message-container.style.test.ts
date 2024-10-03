// Copyright 2020 Prescryptive Health, Inc.

import {
  IMessageContainerStyles,
  messageContainerStyles,
} from './message-container.style';
import { TextStyle, ViewStyle } from 'react-native';
import { FontSize, GreyScale, YellowScale } from '../../../theming/theme';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('messageContainerStyles', () => {
  it('has expected styles', () => {
    const messageContainerViewStyle: ViewStyle = {
      backgroundColor: YellowScale.lighter,
      padding: 24,
      paddingTop: 20,
      paddingBottom: 20,
    };

    const messageContainerTextStyle: TextStyle = {
      ...getFontFace(),
      fontSize: FontSize.small,
      color: GreyScale.darkest,
      flexDirection: 'column',
    };

    const messageContainerHeaderTextStyle: TextStyle = {
      ...getFontFace({ weight: FontWeight.bold }),
      padding: 0,
    };

    const messageContainerSubTextStyle: TextStyle = {
      padding: 0,
      margin: 0,
    };

    const expectedStyles: IMessageContainerStyles = {
      messageContainerViewStyle,
      messageContainerTextStyle,
      messageContainerHeaderTextStyle,
      messageContainerSubTextStyle,
    };

    expect(messageContainerStyles).toEqual(expectedStyles);
  });
});
