// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  ButtonRank,
  SquareButton,
} from '../../buttons/square-button/square.button';
import { CardContainer } from '../../containers/card/card.container';
import { NavigationLink } from '../../links/navigation/navigation.link';
import { TagList } from '../../lists/tag/tag.list';
import { Heading } from '../../member/heading/heading';
import { LineSeparator } from '../../member/line-separator/line-separator';
import { IBaseTagProps } from '../../tags/base/base.tag';
import { callToActionCardStyles } from './call-to-action.card.styles';

export type ActionRank = ButtonRank;

export interface ICallToActionCardProps {
  viewStyle?: StyleProp<ViewStyle>;
  title: string;
  headingLevel?: number;
  actionLabel: string;
  actionRank?: ActionRank;
  onActionPress: () => void;
  tags?: IBaseTagProps[];
  children: ReactNode;
  isSingleton?: boolean;
  isSkeleton?: boolean;
  hideLine?: boolean;
  testID?: string;
  translateTitle?: boolean;
}

export const CallToActionCard = ({
  viewStyle,
  title,
  headingLevel = 3,
  actionLabel,
  actionRank = 'primary',
  onActionPress,
  tags,
  children,
  isSingleton,
  isSkeleton,
  testID = 'callToActionCard',
  hideLine,
  translateTitle,
}: ICallToActionCardProps): ReactElement => {
  const styles = callToActionCardStyles;

  const tagList = tags ? (
    <TagList tags={tags} viewStyle={styles.tagListViewStyle} />
  ) : null;

  const lineSeparator = !hideLine ? (
    <LineSeparator viewStyle={styles.separatorViewStyle} />
  ) : null;

  const action =
    actionRank === 'primary' ? (
      <SquareButton
        onPress={onActionPress}
        rank='primary'
        isSkeleton={isSkeleton}
        viewStyle={styles.buttonViewStyle}
      >
        {actionLabel}
      </SquareButton>
    ) : (
      <NavigationLink
        onPress={onActionPress}
        label={actionLabel}
        isSkeleton={isSkeleton}
        linkColor={styles.linkColorTextStyle.color}
        viewStyle={styles.linkViewStyle}
      />
    );

  return (
    <CardContainer isSingleton={isSingleton} style={viewStyle} testID={testID}>
      {tagList}
      <Heading
        level={headingLevel}
        isSkeleton={isSkeleton}
        textStyle={styles.headingTextStyle}
        translateContent={translateTitle}
      >
        {title}
      </Heading>
      {children}
      {action}
      {lineSeparator}
    </CardContainer>
  );
};
