// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactNode, useEffect, useState } from 'react';
import {
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { primaryCheckBoxStyles } from './primary-checkbox.styles';

export interface IPrimaryCheckBoxProps {
  checkBoxChecked?: boolean;
  checkBoxImageStyle?: ImageStyle;
  checkBoxViewStyle?: ViewStyle;
  checkBoxTextStyle?: TextStyle;
  checkBoxLabel: ReactNode;
  checkBoxValue: string;
  onPress: (checkBoxChecked: boolean, checkBoxValue: string) => void;
  isSkeleton?: boolean;
  testID?: string;
}

export const PrimaryCheckBox = (
  props: IPrimaryCheckBoxProps
): React.ReactElement => {
  const [checked, setChecked] = useState<boolean>();

  useEffect(() => {
    setChecked(props.checkBoxChecked);
  }, [props.checkBoxChecked]);

  const toggleChecked = (): void => {
    props.onPress(!checked, props.checkBoxValue);
    setChecked(!checked);
  };

  const iconName = checked ? 'check-square' : 'square';

  return (
    <TouchableOpacity
      testID={props.testID ? `${props.testID}Touchable` : 'checkBox'}
      onPress={toggleChecked}
      style={[
        primaryCheckBoxStyles.checkBoxViewStyles,
        props.checkBoxViewStyle,
      ]}
    >
      <FontAwesomeIcon
        name={iconName}
        color={primaryCheckBoxStyles.iconTextStyle.color as string}
        size={primaryCheckBoxStyles.iconTextStyle.fontSize}
        style={[
          primaryCheckBoxStyles.checkBoxImageStyles,
          props.checkBoxImageStyle,
        ]}
        solid={checked}
        light={!checked}
      />
      <BaseText isSkeleton={props.isSkeleton} testID={`${props.testID}-label`}>
        {props.checkBoxLabel}
      </BaseText>
    </TouchableOpacity>
  );
};
