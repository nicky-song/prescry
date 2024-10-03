// Copyright 2020 Prescryptive Health, Inc.

import { SurveyAnswerType } from './survey-questions';

export interface IProviderLocation {
  identifier: string;
  providerInfo: IProvider;
  locationName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  phoneNumber?: string;
  enabled: boolean;
  timezone: string;
  isTest?: boolean;
  latitude: number;
  longitude: number;
  serviceList?: IService[];
  providerTaxId: string;
  cliaNumber: string;
  npiNumber: string;
}

export interface IProvider {
  providerName: string;
}
export interface IService {
  serviceName: string;
  serviceDescription?: string;
  serviceType: string;
  screenTitle: string;
  screenDescription: string;
  confirmationDescription: string;
  confirmationAdditionalInfo?: string;
  questions: IServiceQuestion[];
  duration: number;
  minLeadDays: string;
  maxLeadDays: string;
  payment?: IServicePayment;
  isTestService?: boolean;
  status?: string;
}

export interface IServicePayment {
  productKey: string;
  price?: string;
}

export interface IServiceQuestion {
  id: string;
  label: string;
  markdownLabel: string;
  placeholder?: string;
  description?: string;
  type: SurveyAnswerType;
  selectOptions?: [string, string][];
  isRequired: boolean;
  priority: number;
  validation?: string;
  errorMessage?: string;
}
export interface ICustomServiceTypeQuestion {
  serviceType: ServiceTypes;
  questions: IServiceQuestion[];
}

export enum ServiceTypes {
  covid = 'COVID-19 Antibody Testing',
  antigen = 'COVID-19 Antigen Testing',
  pcr = 'test-covid19-pcr-cquentia',
  medicareAbbottAntigen = 'medicare_abbott_antigen',
  medicaidAbbottAntigen = 'medicaid_abbott_antigen',
  abbottAntigen = 'abbott_antigen',
  c19Vaccine = 'C19Vaccine',
  c19VaccineDose1 = 'c19-vaccine-dose1',
  c19VaccineDose2 = 'c19-vaccine-dose2',
  abbottAntigen30 = 'abbott-antigen-30',
  covidAntigen25 = 'covid-antigen-25',
  covidAntigen30 = 'covid-antigen-30',
  covidAntigen35 = 'covid-antigen-35',
  covidAntigen40 = 'covid-antigen-40',
  covidAntigen45 = 'covid-antigen-45',
  covidAntigen50 = 'covid-antigen-50',
  covidAntigen55 = 'covid-antigen-55',
  covidAntigen60 = 'covid-antigen-60',
  covidAntigen65 = 'covid-antigen-65',
}

export enum EventTypes {
  covid = 'consent/covid',
  antigen = 'consent/antigen',
  pcr = 'consent/pcr',
  employer = 'consent/employer',
  directConsumer = 'consent/informed',
}
