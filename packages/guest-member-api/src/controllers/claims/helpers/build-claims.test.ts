// Copyright 2022 Prescryptive Health, Inc.

import { IClaimData } from '../../../utils/external-api/claims/get-claims';
import { claimsResponseMock } from '../mocks/claims.mock';
import { buildClaims } from './build-claims';

describe('buildClaims', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds claims from backend response', () => {
    const claimDataMock = claimsResponseMock.claimData;

    const claims = buildClaims(claimDataMock);

    expect(claimDataMock.length).toBeGreaterThan(0);
    expect(claims.length).toEqual(claimDataMock.length);

    claims.forEach((claim, index) => {
      const claimResponseData = claimDataMock[index];

      expect(claim.billing.deductibleApplied).toEqual(
        claimResponseData.billing.individualDeductibleAmount
      );
      expect(claim.billing.memberPays).toEqual(
        claimResponseData.billing.individualMemberAmount
      );

      expect(claim.drugName).toEqual(claimResponseData.claim.drugName);
      expect(claim.formCode).toEqual(claimResponseData.claim.formCode);
      expect(claim.ndc).toEqual(claimResponseData.claim.drugNDC);
      expect(claim.orderNumber).toBeUndefined();
      expect(claim.strength).toEqual(claimResponseData.claim.strength);
      expect(claim.quantity).toEqual(claimResponseData.claim.quantity);
      expect(claim.refills).toEqual(claimResponseData.claim.refills);
      expect(claim.daysSupply).toEqual(claimResponseData.claim.daysSupply);
      expect(claim.prescriptionId).toEqual(claimResponseData.id);
      expect(claim.filledOn).toEqual(
        new Date(claimResponseData.claim.dateProcessed)
      );

      expect(claim.pharmacy.ncpdp).toEqual(claimResponseData.pharmacy.ncpdp);
      expect(claim.pharmacy.name).toEqual(claimResponseData.pharmacy.name);

      expect(claim.practitioner.id).toEqual(claimResponseData.practitioner.id);
      expect(claim.practitioner.name).toEqual(
        claimResponseData.practitioner.name
      );
      expect(claim.practitioner.phoneNumber).toEqual(
        claimResponseData.practitioner.phoneNumber
      );
    });
  });

  it('builds claims from backend response when data missing', () => {
    const claimDataMock: Partial<IClaimData>[] = [{}];

    const claims = buildClaims(claimDataMock);

    expect(claims.length).toEqual(claimDataMock.length);

    claims.forEach((claim) => {
      expect(claim.billing.deductibleApplied).toEqual(0);
      expect(claim.billing.memberPays).toEqual(0);

      expect(claim.drugName).toEqual('');
      expect(claim.formCode).toEqual('');
      expect(claim.ndc).toEqual('');
      expect(claim.orderNumber).toBeUndefined();
      expect(claim.strength).toEqual(undefined);
      expect(claim.quantity).toEqual(0);
      expect(claim.refills).toEqual(0);
      expect(claim.daysSupply).toEqual(undefined);
      expect(claim.prescriptionId).toEqual('');
      expect(claim.filledOn).toEqual(undefined);

      expect(claim.pharmacy.ncpdp).toEqual('');
      expect(claim.pharmacy.name).toEqual('');

      expect(claim.practitioner.id).toEqual('');
      expect(claim.practitioner.name).toEqual('');
      expect(claim.practitioner.phoneNumber).toEqual('');
    });
  });
});
