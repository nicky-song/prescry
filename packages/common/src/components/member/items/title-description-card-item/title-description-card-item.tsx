// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { titleDescriptionCardItemStyle as styles } from './title-description-card-item.style';
import dateFormatter from '../../../../utils/formatters/date.formatter';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';

export interface ITitleDescriptionCardItemProps {
  code?: string;
  title?: string;
  description?: React.ReactNode;
  onPress?: (id?: string, serviceType?: string) => void;
  viewStyle?: StyleProp<ViewStyle>;
  id?: string;
  serviceType?: string;
  quantity?: number;
  eventDate?: Date;
  icon?: string;
  testID?: string;
}

export const TitleDescriptionCardItem = (
  props: ITitleDescriptionCardItemProps
) => {
  const {
    title,
    description,
    onPress,
    viewStyle,
    id,
    serviceType,
    quantity,
    eventDate,
    icon,
    testID,
  } = props;

  const containerViewStyle: ViewStyle = styles.cardViewStyle;
  const captionTextStyle: TextStyle = styles.titleTextStyle;
  const descriptionTextStyle: TextStyle = styles.descriptionTextStyle;

  const formattedQuantity = quantity ? ` (${quantity})` : null;

  const imageIcon = icon ? icon : 'chevron-right';

  const formattedEventDate = eventDate
    ? ` ${dateFormatter.formatToMDY(eventDate)}`
    : null;

  const titleComponent: React.ReactNode = title ? (
    <Text style={captionTextStyle}>
      {title}
      {formattedQuantity}
    </Text>
  ) : null;
  const descriptionComponent: React.ReactNode = description ? (
    <Text style={descriptionTextStyle}>
      {description}
      {formattedEventDate}
    </Text>
  ) : null;

  const onTouchablePress = () => {
    if (onPress) {
      if (id && serviceType) {
        onPress(id, serviceType);
      } else if (id) {
        onPress(id);
      } else if (serviceType) {
        onPress(undefined, serviceType);
      } else {
        onPress();
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={onTouchablePress}
      style={[containerViewStyle, viewStyle]}
      testID={testID}
    >
      <View
        style={styles.textContainerViewStyle}
        testID={`card_${props.code ?? title}`}
      >
        {titleComponent}
        {descriptionComponent}
      </View>
      <View style={styles.iconContainerViewStyle}>
        <View style={styles.iconViewStyle}>
          <FontAwesomeIcon name={imageIcon} style={styles.iconStyle} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
