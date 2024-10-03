// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PrescriptionTagList,
  IPrescriptionTagListProps,
} from './prescription-tag-list';

export default {
  title: 'Tags/PrescriptionTagList',
  component: PrescriptionTagList,
};

const ArgsWrapper: Story<IPrescriptionTagListProps> = (args) => (
  <PrescriptionTagList {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  planSaves: 7.77,
};
