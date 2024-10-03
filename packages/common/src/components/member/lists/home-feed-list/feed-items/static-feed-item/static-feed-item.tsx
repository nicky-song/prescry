// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { HomeFeedItem } from '../../home-feed-item';
import { stylesheet } from '../../../../../../theming/member/stylesheet';
import { MarkdownText } from '../../../../../text/markdown-text/markdown-text';
import { IFeedContext } from '../../../../../../models/api-response/feed-response';

export interface IStaticFeedItemDataProps {
  viewStyle: StyleProp<ViewStyle>;
  context?: IFeedContext;
  testID?: string;
}

export const StaticFeedItem = (props: IStaticFeedItemDataProps) => {
  const renderDescription = (
    <MarkdownText textStyle={stylesheet.homeFeedStaticItemTextStyle}>
      {props.context?.defaultContext?.markDownText}
    </MarkdownText>
  );
  return (
    <HomeFeedItem
      description={renderDescription}
      viewStyle={props.viewStyle}
      isStatic={true}
      testID={props.testID}
    />
  );
};
