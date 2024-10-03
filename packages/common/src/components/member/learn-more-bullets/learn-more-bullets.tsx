// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { learnMoreBulletStyle as styles } from './learn-more-bullets.style';

export interface ILearnMoreProps {
  title?: string;
  bulletPoints?: string[];
  testID?: string;
}

export const LearnMoreBullets = ({
  title,
  bulletPoints,
  testID,
}: ILearnMoreProps): ReactElement => {
  const linkTo = (url: string) => {
    if (url) {
      return false;
    }
    return true;
  };

  const renderBullet = (text: string) => {
    const hasLinks = text.indexOf('(http');
    if (hasLinks !== -1) {
      return (
        <MarkdownText
          onLinkPress={linkTo}
          markdownTextStyle={styles.markDownLinkTextStyle}
        >
          {text}
        </MarkdownText>
      );
    } else {
      return text;
    }
  };
  const renderBullets = bulletPoints
    ? bulletPoints.map((bulletPoint, i) => {
        const bullet = renderBullet(bulletPoint);
        const elementStyle =
          i < bulletPoints.length - 1
            ? styles.pointViewStyle
            : styles.lastPointViewStyle;
        return (
          <View key={`bullet-${bulletPoint}`} style={elementStyle}>
            <View style={styles.bulletViewStyle} />
            <Text style={styles.bulletTextStyle}>{bullet}</Text>
          </View>
        );
      })
    : undefined;

  const renderComponentStyle: ViewStyle = title
    ? styles.renderContainer
    : styles.noRenderViewStyle;

  return (
    <View testID={testID} style={renderComponentStyle}>
      <Text style={styles.titleTextStyle}>{title}</Text>
      {renderBullets}
    </View>
  );
};
