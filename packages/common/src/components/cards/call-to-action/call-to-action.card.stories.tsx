// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  CallToActionCard,
  ICallToActionCardProps,
} from './call-to-action.card';
import { List } from '../../primitives/list';
import { IBaseTagProps } from '../../tags/base/base.tag';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Cards/CallToActionCard',
  component: CallToActionCard,
  argTypes: { onActionPress: { action: 'pressed' } },
};

const sampleContent = (
  <BaseText>
    Beef chicken pork bacon chuck shortloin sirloin shank qui occaecat tempor
    t-bone, exercitation capicola irure biltong cow drumstick salami minim
    adipisicing. In meatball veniam sint landjaeger ea adipisicing id culpa
    chuck, dolor sausage cupidatat sirloin aliquip occaecat ut voluptate,
    ullamco enim quis pastrami laboris pariatur porkbelly ut.
  </BaseText>
);

const solidStarTag: IBaseTagProps = {
  label: 'Solid star',
  iconName: 'star',
  iconSolid: true,
};

const emptyStarTag: IBaseTagProps = {
  label: 'Empty star',
  iconName: 'star',
};

const noIcon: IBaseTagProps = {
  label: 'No icon',
};

const ArgsWrapper: Story<ICallToActionCardProps> = (args) => {
  return args.isSingleton ? (
    <CallToActionCard {...args}>{sampleContent}</CallToActionCard>
  ) : (
    <List>
      <CallToActionCard {...args}>{sampleContent}</CallToActionCard>
    </List>
  );
};

export const Default = ArgsWrapper.bind({});
Default.args = {
  title: 'Sample title',
  actionLabel: 'Sample',
};

export const WithTags = ArgsWrapper.bind({});
WithTags.args = {
  title: 'Sample title',
  actionLabel: 'Sample',
  tags: [solidStarTag, emptyStarTag, noIcon],
};

export const WithTagsSecondaryButton = ArgsWrapper.bind({});
WithTagsSecondaryButton.args = {
  title: 'Sample title',
  actionLabel: 'Sample',
  actionRank: 'secondary',
  tags: [solidStarTag, emptyStarTag, noIcon],
};
