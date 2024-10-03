// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { Story } from '@storybook/react';
import { ExpandableCard, IExpandableCardProps } from './expandable.card';
import { View } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { List } from '../../primitives/list';

export default {
  title: 'Cards/ExpandableCard',
  component: ExpandableCard,
};

const testContent = [
  ['Expanded Content 1'],
  ['Expanded Content 2'],
  ['Expanded Content 3'],
  ['Expanded Content 4'],
];

const expandedContentMock = testContent.map((content, key) => {
  return (
    <View key={key}>
      <BaseText>{content}</BaseText>
    </View>
  );
});

const collapsedContentMock = (): ReactNode => (
  <View>
    <BaseText>Collapsed content</BaseText>
  </View>
);

const ArgsWrapper: Story<IExpandableCardProps> = (args) => {
  return args.isSingleton ? (
    <ExpandableCard {...args} />
  ) : (
    <List>
      <ExpandableCard {...args} />
    </List>
  );
};

export const AsListItem = ArgsWrapper.bind({});
AsListItem.args = {
  isSingleton: false,
  collapsedContent: collapsedContentMock,
  collapsedTitle: 'Collapsed title',
  expandedContent: expandedContentMock,
  expandedTitle: 'Expanded title',
};

export const AsSingleton = ArgsWrapper.bind({});
AsSingleton.args = {
  isSingleton: true,
  collapsedContent: collapsedContentMock,
  collapsedTitle: 'Collapsed title',
  expandedContent: expandedContentMock,
  expandedTitle: 'Expanded title',
};
