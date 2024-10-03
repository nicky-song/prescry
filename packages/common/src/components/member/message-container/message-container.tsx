// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { messageContainerContent } from './message-container.content';
import { messageContainerStyles } from './message-container.style';

export interface IMessageContainerProps {
  headerText?: string;
  bodyText?: string;
  messageViewStyle?: ViewStyle;
  messageTextStyle?: TextStyle;
}

export const MessageContainer = (props: IMessageContainerProps) => {
  const {
    messageContainerViewStyle,
    messageContainerTextStyle,
    messageContainerHeaderTextStyle,
  } = messageContainerStyles;

  return (
    <View
      style={[messageContainerViewStyle, props.messageViewStyle]}
      testID='messageContainer'
    >
      <Text
        style={[
          messageContainerTextStyle,
          props.messageTextStyle,
          messageContainerHeaderTextStyle,
        ]}
      >
        {props.headerText ?? messageContainerContent.defaultHeaderText}
      </Text>
      <MarkdownText
        textStyle={{ ...messageContainerTextStyle, ...props.messageTextStyle }}
      >
        {props.bodyText ?? messageContainerContent.defaultBodyText}
      </MarkdownText>
    </View>
  );
};
