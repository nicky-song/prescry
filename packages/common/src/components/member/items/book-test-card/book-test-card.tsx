// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ProtectedView } from '../../../containers/protected-view/protected-view';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { MarkdownText } from '../../../text/markdown-text/markdown-text';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';
import { bookTestCardStyle as styles } from './book-test-card.style';

export interface IBookTestCardProps {
  id?: string;
  title?: string;
  description?: React.ReactNode;
  price?: string;
  calloutLabel?: string;
  onPress?: (id?: string) => void;
  viewStyle?: StyleProp<ViewStyle>;
  icon?: string;
  testID?: string;
}

export const BookTestCard = (props: IBookTestCardProps) => {
  const {
    title,
    description,
    onPress,
    viewStyle,
    id,
    price,
    calloutLabel,
    icon,
    testID,
  } = props;

  const imageIcon = icon ? icon : 'chevron-right';

  const priceComponent: React.ReactNode = price ? (
    <Text style={styles.priceTextStyle}>{price}</Text>
  ) : null;

  const titleComponent: React.ReactNode = title ? (
    <View style={styles.headerViewStyle}>
      <ProtectedBaseText style={styles.titleTextStyle}>
        {title}
      </ProtectedBaseText>
      {priceComponent}
    </View>
  ) : null;

  const descriptionComponent: React.ReactNode = description ? (
    <ProtectedView>
      <MarkdownText
        textStyle={styles.descriptionTextStyle}
        markdownTextStyle={styles.markdownTextStyle}
      >
        {description}
      </MarkdownText>
    </ProtectedView>
  ) : null;

  const calloutLabelComponent: React.ReactNode = calloutLabel ? (
    <Text style={styles.calloutLabelTextStyle}>{calloutLabel}</Text>
  ) : null;

  const onTouchablePress = () => {
    if (onPress) {
      if (id) {
        onPress(id);
      } else {
        onPress(undefined);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={onTouchablePress}
      style={viewStyle}
      testID={testID}
    >
      <View style={styles.contentContainerViewStyle}>
        <View style={styles.textContainerViewStyle}>
          {titleComponent}
          {descriptionComponent}
          {calloutLabelComponent}
        </View>
        <View style={styles.iconContainerViewStyle}>
          <View style={styles.iconViewStyle}>
            <FontAwesomeIcon name={imageIcon} style={styles.iconStyle} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
