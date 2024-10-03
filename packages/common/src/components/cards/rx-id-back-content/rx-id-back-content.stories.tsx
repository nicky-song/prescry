// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { RxIdBackContent, IRxIdBackContentProps } from './rx-id-back-content';

export default {
  title: 'Cards/RxIdBackContent',
  component: RxIdBackContent,
};

const ArgsWrapper: Story<IRxIdBackContentProps> = (args) => (
  <RxIdBackContent {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  memberSince: '07/01/2022',
};
