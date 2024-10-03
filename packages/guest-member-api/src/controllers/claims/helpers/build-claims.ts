// Copyright 2022 Prescryptive Health, Inc.

import { IClaim } from '@phx/common/src/models/claim';
import { IClaimData } from '../../../utils/external-api/claims/get-claims';

export const buildClaims = (
  responseClaims: Partial<IClaimData>[] = []
): IClaim[] =>
  responseClaims.map((responseClaim) => {
    const { billing, claim, pharmacy, practitioner, id } = responseClaim;

    return {
      billing: {
        deductibleApplied: billing?.individualDeductibleAmount ?? 0,
        memberPays: billing?.individualMemberAmount ?? 0,
      },
      drugName: claim?.drugName ?? '',
      formCode: claim?.formCode ?? '',
      ndc: claim?.drugNDC ?? '',
      strength: claim?.strength,
      quantity: claim?.quantity ?? 0,
      refills: claim?.refills ?? 0,
      daysSupply: claim?.daysSupply,
      prescriptionId: id ?? '',
      filledOn: claim?.dateProcessed
        ? new Date(claim.dateProcessed)
        : undefined,
      pharmacy: {
        ncpdp: pharmacy?.ncpdp ?? '',
        name: pharmacy?.name ?? '',
        phoneNumber: pharmacy?.phoneNumber ?? '',
      },
      practitioner: {
        id: practitioner?.id ?? '',
        name: practitioner?.name ?? '',
        phoneNumber: practitioner?.phoneNumber ?? '',
      },
    };
  });
