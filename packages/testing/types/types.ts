// Copyright 2022 Prescryptive Health, Inc.

export type DrugPrice = {
  ndc: string;
  patientPayAmount: number;
  planTotalPaid: number;
  totalAmountPaid: number;
};

export type LoginInfo = {
  phoneNumberDialingCode: string;
  phoneNumber: string;
  pin: string;
};

export type IndividualConsumer = LoginInfo & {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  genderCode: number;
};

export type InsuranceInfo = {
  cardHolderID: string;
  groupNumber: string;
  personCode: string;
};

export type InsuredIndividualConsumer = IndividualConsumer & InsuranceInfo;

export type Persona = InsuredIndividualConsumer | IndividualConsumer;
