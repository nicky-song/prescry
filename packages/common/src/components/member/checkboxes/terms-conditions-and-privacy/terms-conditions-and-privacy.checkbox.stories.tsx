// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  TermsConditionsAndPrivacyCheckbox,
  ITermsConditionsAndPrivacyCheckboxProps,
} from './terms-conditions-and-privacy.checkbox';

export default {
  title: 'Checkboxes/TermAndConditionAndPrivacy',
  component: TermsConditionsAndPrivacyCheckbox,
  argTypes: {
    onPress: { action: 'onPress' },
    onTermsAndConditionPress: { action: 'onTermsAndConditionPress' },
    onPrivacyPolicyPress: { action: 'onPrivacyPolicyPress' },
  },
};

const ArgsWrapper: Story<ITermsConditionsAndPrivacyCheckboxProps> = (args) => (
  <TermsConditionsAndPrivacyCheckbox {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
