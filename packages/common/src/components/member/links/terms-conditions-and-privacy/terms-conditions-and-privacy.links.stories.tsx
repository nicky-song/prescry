// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { TermsConditionsAndPrivacyLinks } from './terms-conditions-and-privacy.links';

export default {
  title: 'Links/TermsConditionsAndPrivacyLinks',
  component: TermsConditionsAndPrivacyLinks,
};

const ArgsWrapper: Story = (args) => (
  <TermsConditionsAndPrivacyLinks {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
