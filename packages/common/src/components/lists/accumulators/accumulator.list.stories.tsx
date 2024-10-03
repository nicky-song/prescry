// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IAccumulatorListProps, AccumulatorList } from './accumulator.list';
import { IAccumulators } from '../../../models/accumulators';

export default {
  title: 'Lists/AccumulatorList',
  component: AccumulatorList,
};

const accumulatorMock: IAccumulators = {
  individualDeductible: {
    maximum: 1500,
    used: 385.55,
  },
  individualOutOfPocket: {
    maximum: 4000,
    used: 355.55,
  },
  familyDeductible: {
    maximum: 2000,
    used: 485.55,
  },
  familyOutOfPocket: {
    maximum: 5000,
    used: 585.55,
  },
};

const ArgsWrapper: Story<IAccumulatorListProps> = (args) => (
  <AccumulatorList {...args} />
);

export const Accumulators = ArgsWrapper.bind({});
Accumulators.args = {
  accumulators: accumulatorMock,
};
