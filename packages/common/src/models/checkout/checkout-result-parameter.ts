// Copyright 2018 Prescryptive Health, Inc.

export type CheckoutResultParameter = keyof typeof CheckoutResultParameterEnum;
export enum CheckoutResultParameterEnum {
  SessionId = 's',
  ProductType = 'p',
  OrderNumber = 'o',
  Result = 'r',
  OperationId = 'op',
}
