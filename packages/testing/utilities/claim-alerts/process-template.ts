// Copyright 2022 Prescryptive Health, Inc.

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
export type ClaimNcpdpItem = {
  ClaimSegment: any;
  RequestHeaderSegment: any;
  InsuranceSegment: any;
  PatientSegment: any;
  PricingSegment: any;
  ResponseStatusSegment: any;
  ResponsePricing: any;
  PrescriberSegment: any;
  Additional: any;
};
type Segments = keyof ClaimNcpdpItem;
const dict: Record<Segments, string> = {
  ClaimSegment: 'S_07',
  RequestHeaderSegment: 'S_HD',
  InsuranceSegment: 'S_04',
  PatientSegment: 'S_01',
  PricingSegment: 'S_11',
  ResponseStatusSegment: 'S_21',
  ResponsePricing: 'S_23',
  PrescriberSegment: 'S_03',
  Additional: 'Additional',
};
let templateFile: Buffer | undefined = undefined;
export const processTemplate = (claim: ClaimNcpdpItem) => {
  if (templateFile === undefined) {
    templateFile = fs.readFileSync('./utilities/claim-alerts/template.xml');
  }
  let template = templateFile.toString();
  const {
    ClaimSegment,
    RequestHeaderSegment,
    InsuranceSegment,
    PatientSegment,
    PricingSegment,
    ResponseStatusSegment,
    ResponsePricing,
    PrescriberSegment,
    Additional,
  } = claim;
  if (ClaimSegment) {
    template = processClaimSegment(template, ClaimSegment);
  } else {
    template = setIgnored(template, dict['ClaimSegment']);
  }
  if (RequestHeaderSegment) {
    template = processRequestHeaderSegment(template, RequestHeaderSegment);
  } else {
    template = setIgnored(template, dict['RequestHeaderSegment']);
  }
  if (InsuranceSegment) {
    template = processInsuranceSegment(template, InsuranceSegment);
  } else {
    template = setIgnored(template, dict['InsuranceSegment']);
  }
  if (PatientSegment) {
    template = processPatientSegment(template, PatientSegment);
  } else {
    template = setIgnored(template, dict['PatientSegment']);
  }
  if (PricingSegment) {
    template = processPricingSegment(template, PricingSegment);
  } else {
    template = setIgnored(template, dict['PricingSegment']);
  }
  if (ResponseStatusSegment) {
    template = processResponseStatusSegment(template, ResponseStatusSegment);
  } else {
    template = setIgnored(template, dict['ResponseStatusSegment']);
  }
  if (ResponsePricing) {
    template = processResponsePricing(template, ResponsePricing);
  } else {
    template = setIgnored(template, dict['ResponsePricing']);
  }
  if (PrescriberSegment) {
    template = processPrescriberSegment(template, PrescriberSegment);
  } else {
    template = setIgnored(template, dict['PrescriberSegment']);
  }
  if (Additional) {
    template = processAdditional(template, Additional);
  } else {
    template = setIgnored(template, dict['Additional']);
  }
  return template;
};
const IGNORE = `_IGNORE`;
export const setIgnored = (template: string, item: string) => {
  template = template.replace(`<${item}>`, `<${item}${IGNORE}>`);
  template = template.replace(`</${item}>`, `</${item}${IGNORE}>`);
  return template;
};
export const processClaimSegment = (
  template: string,
  claimSegment: any
): string => {
  const {
    RxNumber,
    ProductOrSvcID,
    Quantity,
    FillNumber,
    DaysSupply,
    NumberofRefillsAuthorized,
  } = claimSegment;
  if (RxNumber) {
    template = template.replace(/\[RxNumber\]/gi, RxNumber);
  } else {
    template = template.replace('<F_402_D2>[RxNumber]</F_402_D2>', '');
  }
  if (ProductOrSvcID) {
    template = template.replace(/\[ProductOrSvcID\]/gi, ProductOrSvcID);
  } else {
    template = template.replace('<F_407_D7>[ProductOrSvcID]</F_407_D7>', '');
  }
  if (Quantity) {
    template = template.replace(/\[Quantity\]/gi, Quantity);
  } else {
    template = template.replace('<F_442_E7>[Quantity]</F_442_E7>', '');
  }
  if (FillNumber) {
    template = template.replace(/\[FillNumber\]/gi, FillNumber);
  } else {
    template = template.replace('<F_403_D3>[FillNumber]</F_403_D3>', '');
  }
  if (DaysSupply) {
    template = template.replace(/\[DaysSupply\]/gi, DaysSupply);
  } else {
    template = template.replace('<F_405_D5>[DaysSupply]</F_405_D5>', '');
  }
  if (NumberofRefillsAuthorized) {
    template = template.replace(
      /\[NumberofRefillsAuthorized\]/gi,
      claimSegment.NumberofRefillsAuthorized
    );
  } else {
    template = template.replace(
      '<F_415_DF>[NumberOfRefillsAuthorized]</F_415_DF>',
      ''
    );
  }
  return template;
};
export const processRequestHeaderSegment = (
  template: string,
  requestHeaderSegment: any
): string => {
  const { TransactionCode, ServiceProviderID, DateofService } =
    requestHeaderSegment;
  if (TransactionCode) {
    template = template.replace(/\[TransactionCode\]/gi, TransactionCode);
  } else {
    template = template.replace('<F_103_A3>[TransactionCode]</F_103_A3>', '');
  }
  if (ServiceProviderID) {
    template = template.replace(/\[ServiceProviderID\]/gi, ServiceProviderID);
  } else {
    template = template.replace('<F_201_B1>[ServiceProviderID]</F_201_B1>', '');
  }
  if (DateofService) {
    template = template.replace(/\[DateofService\]/gi, DateofService);
  } else {
    template = template.replace('<F_401_D1>[DateofService]</F_401_D1>', '');
  }
  return template;
};
export const processInsuranceSegment = (
  template: string,
  insuranceSegment: any
): string => {
  const { CardHolderID, GroupNumber, PersonCode } = insuranceSegment;
  if (CardHolderID) {
    template = template.replace(/\[CardHolderID\]/gi, CardHolderID);
  } else {
    template = template.replace('<F_302_C2>[CardHolderID]</F_302_C2>', '');
  }
  if (GroupNumber) {
    template = template.replace(/\[GroupNumber\]/gi, GroupNumber);
  } else {
    throw new Error('Missing GroupNumber');
  }
  if (PersonCode) {
    template = template.replace(/\[PersonCode\]/gi, PersonCode);
  } else {
    template = template.replace('<F_303_C3>[PersonCode]</F_303_C3>', '');
  }
  return template;
};
export const processPatientSegment = (
  template: string,
  patientSegment: any
): string => {
  const { FirstName, LastName, DateofBirth, GenderCode } = patientSegment;
  if (FirstName) {
    template = template.replace(/\[FirstName\]/gi, FirstName);
  } else {
    template = template.replace('<F_310_CA>[FirstName]</F_310_CA>', '');
  }
  if (LastName) {
    template = template.replace(/\[LastName\]/gi, LastName);
  } else {
    template = template.replace('<F_311_CB>[LastName]</F_311_CB>', '');
  }
  if (DateofBirth) {
    template = template.replace(/\[DateofBirth\]/gi, DateofBirth);
  } else {
    template = template.replace('<F_304_C4>[DateofBirth]</F_304_C4>', '');
  }
  if (GenderCode) {
    template = template.replace(/\[GenderCode\]/gi, GenderCode);
  } else {
    throw new Error('Missing Gender Code');
  }
  return template;
};
export const processPricingSegment = (
  template: string,
  pricingSegment: any
): string => {
  if (pricingSegment.UsualandCustomary) {
    template = template.replace(
      /\[UsualandCustomary\]/gi,
      pricingSegment.UsualandCustomary
    );
  } else {
    template = template.replace('<F_426_DQ>[UsualandCustomary]</F_426_DQ>', '');
  }
  return template;
};
export const processResponseStatusSegment = (
  template: string,
  responseStatusSegment: any
): string => {
  const { TransactionCode, TransactionResponseStatus, AuthorizationNumber } =
    responseStatusSegment;
  if (responseStatusSegment.TransactionCode) {
    template = template.replace(/\[TransactionCode\]/gi, TransactionCode);
  } else {
    template = template.replace('<F_103_A3>[TransactionCode]</F_103_A3>', '');
  }
  if (responseStatusSegment.TransactionResponseStatus) {
    template = template.replace(
      /\[TransactionResponseStatus\]/gi,
      TransactionResponseStatus
    );
  } else {
    template = template.replace(
      '<F_112_AN>[TransactionResponseStatus]</F_112_AN>',
      ''
    );
  }
  if (AuthorizationNumber) {
    template = template.replace(
      /\[AuthorizationNumber\]/gi,
      AuthorizationNumber
    );
  } else {
    template = template.replace(
      '<F_503_F3>[AuthorizationNumber]</F_503_F3>',
      ''
    );
  }
  return template;
};
export const processResponsePricing = (
  template: string,
  responsePricing: any
): string => {
  const { PatientPayAmount, IngredientCostPaid, TotalAmountPaid } =
    responsePricing;
  if (PatientPayAmount) {
    template = template.replace(/\[PatientPayAmount\]/gi, PatientPayAmount);
  } else {
    template = template.replace('<F_505_F5>[PatientPayAmount]</F_505_F5>', '');
  }
  if (IngredientCostPaid) {
    template = template.replace(/\[IngredientCostPaid\]/gi, IngredientCostPaid);
  } else {
    template = template.replace(
      '<F_506_F6>[IngredientCostPaid]</F_506_F6>',
      ''
    );
  }
  if (TotalAmountPaid) {
    template = template.replace(/\[TotalAmountPaid\]/gi, TotalAmountPaid);
  } else {
    template = template.replace('<F_509_F9>[TotalAmountPaid]</F_509_F9>', '');
  }
  return template;
};
export const processPrescriberSegment = (
  template: string,
  prescriberSegment: any
): string => {
  const { PrescriberID } = prescriberSegment;
  if (PrescriberID) {
    template = template.replace(/\[PrescriberID\]/gi, PrescriberID);
  }
  return template;
};
export const processAdditional = (
  template: string,
  additional: any
): string => {
  const {
    OriginalAuthorizationNumber,
    PlanTotalPaid,
    DrugLabelName,
    PharmacyName,
  } = additional;
  if (OriginalAuthorizationNumber) {
    template = template.replace(
      /\[OriginalAuthorizationNumber\]/gi,
      OriginalAuthorizationNumber
    );
  } else {
    template = template.replace(
      '<ORIG_AUTH>[OriginalAuthorizationNumber]</ORIG_AUTH>',
      ''
    );
  }
  if (additional.PlanTotalPaid) {
    template = template.replace(/\[PlanTotalPaid\]/gi, PlanTotalPaid);
  } else {
    template = template.replace(
      '<PLAN_TTL_PAID>[PlanTotalPaid]</PLAN_TTL_PAID>',
      ''
    );
  }
  if (additional.DrugLabelName) {
    template = template.replace(/\[DrugLabelName\]/gi, DrugLabelName);
  } else {
    template = template.replace('<LABEL_NAME>[DrugLabelName]</LABEL_NAME>', '');
  }
  if (additional.PharmacyName) {
    template = template.replace(/\[PharmacyName\]/gi, PharmacyName);
  } else {
    template = template.replace('<PHARM_NAME>[PharmacyName]</PHARM_NAME>', '');
  }
  return template;
};
