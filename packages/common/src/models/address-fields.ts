// Copyright 2020 Prescryptive Health, Inc.

export type addressFieldType = 'single-select' | 'text';
export enum AddressFieldName {
  STREET_NAME = 'address1',
  CITY = 'city',
  COUNTY = 'county',
  ZIP = 'zip',
  STATE = 'state',
}

export interface IAddressField {
  id: number;
  label: string;
  name: AddressFieldName;
  placeholder: string;
  type: addressFieldType;
  isRequired: boolean;
  options: [string, string][];
  errorMessage: string[];
  defaultValue?: string;
}

export const addressFields: IAddressField[] = [
  {
    id: 1,
    label: 'Home address',
    name: AddressFieldName.STREET_NAME,
    placeholder: 'Enter address',
    type: 'text',
    isRequired: true,
    options: [],
    errorMessage: [
      'Invalid address entry',
      `You have exceeded 200 character limit for this field`,
    ],
  },
  {
    id: 2,
    label: 'City',
    name: AddressFieldName.CITY,
    placeholder: 'Enter city',
    type: 'text',
    isRequired: true,
    options: [],
    errorMessage: [
      'Invalid city entry',
      `You have exceeded 40 character limit for this field`,
    ],
  },
  {
    id: 3,
    label: 'Zip code',
    name: AddressFieldName.ZIP,
    placeholder: 'Enter zip code',
    type: 'text',
    isRequired: true,
    options: [],
    errorMessage: ['Invalid zip code'],
  },
  {
    id: 4,
    label: 'County',
    name: AddressFieldName.COUNTY,
    placeholder: 'Enter county',
    type: 'text',
    isRequired: true,
    options: [],
    errorMessage: ['Invalid county entry'],
  },
  {
    id: 5,
    label: 'State',
    name: AddressFieldName.STATE,
    placeholder: 'Select state ',
    type: 'single-select',
    isRequired: true,
    options: [
      ['', 'Select state'],
      ['AL', ' Alabama'],
      ['AK', ' Alaska'],
      ['AZ', ' Arizona'],
      ['AR', ' Arkansas'],
      ['CA', ' California'],
      ['CO', ' Colorado'],
      ['CT', ' Connecticut'],
      ['DC', ' District of Columbia'],
      ['DE', ' Delaware'],
      ['FL', ' Florida'],
      ['GA', ' Georgia'],
      ['HI', ' Hawaii'],
      ['ID', ' Idaho'],
      ['IL', ' Illinois'],
      ['IN', ' Indiana'],
      ['IA', ' Iowa'],
      ['KS', ' Kansas'],
      ['KY', ' Kentucky'],
      ['LA', ' Louisiana'],
      ['ME', ' Maine'],
      ['MD', ' Maryland'],
      ['MA', ' Massachusetts'],
      ['MI', ' Michigan'],
      ['MN', ' Minnesota'],
      ['MS', ' Mississippi'],
      ['MO', ' Missouri'],
      ['MT', ' Montana'],
      ['NE', ' Nebraska'],
      ['NV', ' Nevada'],
      ['NH', ' New Hampshire'],
      ['NJ', ' New Jersey'],
      ['NM', ' New Mexico'],
      ['NY', ' New York'],
      ['NC', ' North Carolina'],
      ['ND', ' North Dakota'],
      ['OH', ' Ohio'],
      ['OK', ' Oklahoma'],
      ['OR', ' Oregon'],
      ['PA', ' Pennsylvania'],
      ['RI', ' Rhode Island'],
      ['SC', ' South Carolina'],
      ['SD', ' South Dakota'],
      ['TN', ' Tennessee'],
      ['TX', ' Texas'],
      ['UT', ' Utah'],
      ['VT', ' Vermont'],
      ['VA', ' Virginia'],
      ['WA', ' Washington'],
      ['WV', ' West Virginia'],
      ['WI', ' Wisconsin'],
      ['WY', ' Wyoming'],
    ],
    errorMessage: ['Invalid state selection'],
  },
];

export interface AddressFieldValidation {
  isValid: boolean;
  errorMessage?: string;
}

export enum AddressValidationErrors {}
