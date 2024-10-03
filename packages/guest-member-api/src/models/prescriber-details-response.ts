// Copyright 2022 Prescryptive Health, Inc.

export interface IBasic {
  namePrefix: string;
  firstName: string;
  lastName: string;
  middleName: string;
  credential: string;
  soleProprietor: string;
  gender: string;
  enumerationDate: Date;
  lastUpdated: Date;
  status: string;
  name: string;
}

export interface IAddress {
  countryCode: string;
  countryName: string;
  addressPurpose: string;
  addressType: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  telephoneNumber: string;
}

export interface IResult {
  number: number;
  basic: IBasic;
  addresses: IAddress[];
}

export interface IPrescriberDetailsResponse {
  result_count: number;
  results: IResult[];
}
