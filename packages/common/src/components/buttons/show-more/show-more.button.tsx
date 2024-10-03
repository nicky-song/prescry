// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { BaseButton } from '../base/base.button';
import { showMoreButtonStyles as styles } from './show-more.button.styles';

export interface IShowMoreButtonProps {
  onPress: () => void;
  message: string;
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const ShowMoreButton = ({
  onPress,
  message,
  viewStyle,
  textStyle,
  testID,
}: IShowMoreButtonProps): ReactElement => {
  const [isShowing, setIsShowing] = useState<boolean>(false);

  const handlePress = () => {
    onPress();
    setIsShowing(!isShowing);
  };

  return (
    <BaseButton
      style={[styles.viewStyle, viewStyle]}
      onPress={handlePress}
      testID={testID}
    >
      <BaseText style={[styles.textStyle, textStyle]}>{message}</BaseText>
      <FontAwesomeIcon
        name={isShowing ? 'chevron-up' : 'chevron-down'}
        size={IconSize.small}
        color={PrimaryColor.darkBlue}
      />
    </BaseButton>
  );
};
