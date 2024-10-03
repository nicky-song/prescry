// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IllustratedListItem,
  IIllustratedListItemProps,
} from './illustrated.list-item';
import { List } from '../../../primitives/list';

export default {
  title: 'List Items/IllustratedListItem',
  component: IllustratedListItem,
};

const ArgsWrapper: Story<IIllustratedListItemProps> = (args) => (
  <List>
    <IllustratedListItem {...args} />
  </List>
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  description: 'Sample list item description paragraph.',
  imageName: 'pillCartIcon',
  imageStyle: { width: 64, height: 64, maxWidth: 64 },
};

export const KnowYourExpenses = ArgsWrapper.bind({});
KnowYourExpenses.storyName = 'Know your expenses example';
KnowYourExpenses.args = {
  description:
    'Know your out-of-pocket expenses in real-time, factoring in your deductible.',
  imageName: 'dollarMagnifier',
  imageStyle: { width: 64, height: 64, maxWidth: 64 },
};
