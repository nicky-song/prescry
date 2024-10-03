// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { AccumulatorsCard, IAccumulatorsCardProps } from './accumulators.card';
import { List } from '../../../primitives/list';

export default {
  title: 'Cards/AccumulatorsCard',
  component: AccumulatorsCard,
};

const ArgsWrapper: Story<IAccumulatorsCardProps> = (args) => (
  <List>
    <AccumulatorsCard {...args} />
  </List>
);

export const Individual = ArgsWrapper.bind({});
Individual.args = {
  category: 'individual',
  deductible: {
    maximum: 1500,
    used: 385.55,
  },
  outOfPocket: {
    maximum: 4000,
    used: 385.55,
  },
};

export const Family = ArgsWrapper.bind({});
Family.args = {
  category: 'family',
  deductible: {
    maximum: 3000,
    used: 1247.8,
  },
  outOfPocket: {
    maximum: 8000,
    used: 1247.8,
  },
};
