// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PaperClaimsPanel, IPaperClaimsPanelProps } from './paper-claims.panel';

export default {
  title: 'Panels/PaperClaimsPanel',
  component: PaperClaimsPanel,
};

const ArgsWrapper: Story<IPaperClaimsPanelProps> = (args) => (
  <PaperClaimsPanel {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
