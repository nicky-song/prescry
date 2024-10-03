// Copyright 2022 Prescryptive Health, Inc.

import loadConfig from './load-config';
import { ncpdpClaim } from './claim-ncpdp-template';
import { ClaimNcpdpItem } from './process-template';
import { InsuredIndividualConsumer, DrugPrice } from '../../types';
import writeToFiles from './write-to-files';

type GenerateOptions = { debug: boolean };

export const generateClaimAlerts = async (
  account: InsuredIndividualConsumer,
  drugs: DrugPrice[],
  options: GenerateOptions = { debug: false }
): Promise<ClaimNcpdpItem[]> => {
  const { debug } = options;

  const drugConfig = await loadConfig(drugs);

  const {
    firstName,
    lastName,
    dateOfBirth,
    cardHolderID,
    groupNumber,
    personCode,
    genderCode,
  } = account;

  const itemsToProcess = drugConfig.map((drug) => {
    const {
      ndc,
      patientPayAmount,
      planTotalPaid,
      totalAmountPaid,
      authorizationNumber,
      rxNumber,
    } = drug;

    const dateOfService = '2022-10-10';
    const originalAuthorizationNumber = authorizationNumber;
    const datePrescriptionWritten = '2022-10-10';

    const { Billing } = ncpdpClaim.RealTimeClaimMessage.Transformed;
    const { NcpdpRequest, Additional, NcpdpResponse } = Billing;

    const claimInfo: ClaimNcpdpItem = {
      RequestHeaderSegment: {
        ...NcpdpRequest.RequestHeaderSegment,
        DateofService: dateOfService,
      },
      PatientSegment: {
        ...NcpdpRequest.PatientSegment,
        FirstName: firstName,
        LastName: lastName,
        DateofBirth: dateOfBirth,
        GenderCode: genderCode,
      },
      InsuranceSegment: {
        ...NcpdpRequest.InsuranceSegment,
        GroupNumber: groupNumber,
        CardHolderID: cardHolderID,
        PersonCode: personCode,
      },
      ClaimSegment: {
        ...NcpdpRequest.ClaimSegment,
        RxNumber: rxNumber,
        ProductOrSvcID: ndc,
        DatePrescriptionWritten: datePrescriptionWritten,
      },
      PrescriberSegment: { ...NcpdpRequest.PrescriberSegment },
      PricingSegment: { ...NcpdpRequest.PricingSegment },
      Additional: {
        ...Additional,
        PlanTotalPaid: planTotalPaid,
        OriginalAuthorizationNumber: originalAuthorizationNumber,
      },
      ResponseStatusSegment: {
        ...NcpdpResponse.ResponseStatusSegment,
        AuthorizationNumber: authorizationNumber,
        DateofService: dateOfService,
      },

      ResponsePricing: {
        ...NcpdpResponse.ResponsePricing,
        PatientPayAmount: patientPayAmount,
        TotalAmountPaid: totalAmountPaid,
      },
    };

    if (debug) {
      writeToFiles(ndc, claimInfo);
    }

    return claimInfo;
  });

  return itemsToProcess;
};
