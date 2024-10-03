// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { TagList, ITagListProps } from './tag.list';
import { IBaseTagProps } from '../../tags/base/base.tag';

export default {
  title: 'Lists/TagList',
  component: TagList,
};

const ArgsWrapper: Story<ITagListProps> = (args) => <TagList {...args} />;

const solidStar: IBaseTagProps = {
  label: 'Solid star',
  iconName: 'star',
  iconSolid: true,
};

const emptyStar: IBaseTagProps = {
  label: 'Empty star',
  iconName: 'star',
};

const noIcon: IBaseTagProps = {
  label: 'No icon',
};

export const OneTag = ArgsWrapper.bind({});
OneTag.args = {
  tags: [solidStar],
};

export const ThreeTags = ArgsWrapper.bind({});
ThreeTags.args = {
  tags: [solidStar, emptyStar, noIcon],
};

export const WrappingTags = ArgsWrapper.bind({});
WrappingTags.args = {
  tags: [solidStar, emptyStar, noIcon, noIcon, emptyStar, solidStar],
};
