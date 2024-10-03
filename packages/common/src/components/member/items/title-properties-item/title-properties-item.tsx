// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../../../text/translated-base-text/translatable-base-text';
import { titlePropertiesItemStyle as styles } from './title-properties-item.styles';

export interface ILabelContentProps {
  label: string;
  content: string;
  translateContent: boolean;
}

export interface ITitlePropertiesItemProps {
  title?: string;
  id?: string;
  properties?: ILabelContentProps[];
  onPress?: (id?: string) => void;
  style?: StyleProp<ViewStyle>;
  icon?: string;
  testID: string;
}

export const TitlePropertiesItem = (props: ITitlePropertiesItemProps) => {
  const { title, properties, style, icon, id, onPress, testID } = props;

  const imageIcon = icon ? icon : 'chevron-right';

  const buttonId = id ? id : title ? title : '';

  const titleComponent: React.ReactNode = title ? (
    <ProtectedBaseText style={styles.titleTextStyle}>{title}</ProtectedBaseText>
  ) : null;

  const propertyPairComponent = (
    property: ILabelContentProps
  ): React.ReactNode => {
    return (
      <View key={property.label} style={styles.labelContentViewStyle}>
        <Text style={styles.labelTextStyle}>{property.label}</Text>
        {property.translateContent ? (
          <TranslatableBaseText style={styles.contentTextStyle}>
            {property.content}
          </TranslatableBaseText>
        ) : (
          <ProtectedBaseText style={styles.contentTextStyle}>
            {property.content}
          </ProtectedBaseText>
        )}
      </View>
    );
  };

  const propertiesComponent: React.ReactNode = properties
    ? properties.map((property) => propertyPairComponent(property))
    : null;

  const onTouchablePress = () => {
    if (onPress) {
      onPress(buttonId);
    }
  };

  return (
    <TouchableOpacity
      onPress={onTouchablePress}
      style={[styles.cardViewStyle, style]}
      testID={testID}
    >
      <View style={styles.textContainerViewStyle}>
        {titleComponent}
        {propertiesComponent}
      </View>
      <View style={styles.iconContainerViewStyle}>
        <View style={styles.iconViewStyle}>
          <FontAwesomeIcon name={imageIcon} style={styles.iconStyle} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
