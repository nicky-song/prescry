// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IOrderSectionProps, OrderSection } from './order.section';
import { IDrugDetails } from '../../../../../../utils/formatters/drug.formatter';

export default {
  title: 'Shopping/Confirmation/Sections/OrderSection',
  component: OrderSection,
};

const drugDetails: IDrugDetails = {
  strength: '15',
  unit: 'ML',
  quantity: 5,
  formCode: 'KIT',
};

const ArgsWrapper: Story<IOrderSectionProps> = (args) => (
  <OrderSection {...args} />
);

export const Default = ArgsWrapper.bind({});

Default.args = {
  drugDetails,
  drugName: 'drug-name',
  showPlanPays: true,
  planPays: 50,
  memberPays: 5,
};
