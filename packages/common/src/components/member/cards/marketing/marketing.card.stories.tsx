// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IMarketingCardProps, MarketingCard } from './marketing.card';

export default {
  title: 'Cards/MarketingCard',
  component: MarketingCard,
  args: {},
};

const ArgsWrapper: Story<IMarketingCardProps> = (args) => (
  <MarketingCard {...args} />
);

export const Regular = ArgsWrapper.bind({});
Regular.args = {
  imageName: 'pillHandIcon',
  title: 'Own your prescriptions',
  description:
    'Ask your doctor to send your prescription to Prescryptive (MyRx.io) and manage it all on your phone.  ',
  headingLevel: 5,
};
