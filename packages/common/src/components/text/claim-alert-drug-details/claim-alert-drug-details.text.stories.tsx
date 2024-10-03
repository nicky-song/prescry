// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ClaimAlertDrugDetailsText } from './claim-alert-drug-details.text';
import { IDrugDetailsTextProps } from '../drug-details/drug-details.text';

export default {
  title: 'Text/ClaimAlertDrugDetailsText',
  component: ClaimAlertDrugDetailsText,
};

const ArgsWrapper: Story<IDrugDetailsTextProps> = (args) => (
  <ClaimAlertDrugDetailsText {...args} />
);

export const AllValues = ArgsWrapper.bind({});
AllValues.args = {
  strength: '324',
  unit: 'MG',
  quantity: 60,
  formCode: 'CAPS',
  refills: 1,
  supply: 30,
  authoredOn: '2022-06-10',
};

export const NoQuantity = ArgsWrapper.bind({});
NoQuantity.args = {
  strength: '324',
  unit: 'MG',
  supply: 30,
  formCode: 'CAPS',
  refills: 1,
  authoredOn: '2022-06-10',
};

export const NoFormCode = ArgsWrapper.bind({});
NoFormCode.args = {
  strength: '324',
  unit: 'MG',
  supply: 2,
  quantity: 30,
  refills: 1,
  authoredOn: '2022-06-10',
};

export const NoSupply = ArgsWrapper.bind({});
NoSupply.args = {
  strength: '324',
  unit: 'MG',
  quantity: 60,
  formCode: 'CAPS',
  refills: 1,
  authoredOn: '2022-06-10',
};

export const NoDate = ArgsWrapper.bind({});
NoDate.args = {
  strength: '324',
  unit: 'MG',
  quantity: 60,
  formCode: 'CAPS',
  refills: 1,
  supply: 30,
};

export const NoStrength = ArgsWrapper.bind({});
NoStrength.args = {
  unit: 'MG',
  quantity: 60,
  formCode: 'CAPS',
  refills: 1,
  supply: 30,
};

export const NoUnit = ArgsWrapper.bind({});
NoUnit.args = {
  strength: '324',
  quantity: 60,
  formCode: 'CAPS',
  refills: 1,
  supply: 30,
};

export const ComplexDetails = ArgsWrapper.bind({});
ComplexDetails.args = {
  strength: '1.5',
  unit: 'MG/0.5ML',
  quantity: 4,
  formCode: 'Soln Pen-inj',
  refills: 1,
  supply: 30,
};
