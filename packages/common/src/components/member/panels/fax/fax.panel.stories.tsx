// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { FaxPanel, IFaxPanelProps } from './fax.panel';

export default {
  title: 'Panels/FaxPanel',
  component: FaxPanel,
  // argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IFaxPanelProps> = (args) => <FaxPanel {...args} />;

export const Default = ArgsWrapper.bind({});
// Default.storyName = 'Default';
Default.args = {};
