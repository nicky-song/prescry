// Copyright 2022 Prescryptive Health, Inc.

import { IClaim } from '@phx/common/src/models/claim';
import {
  claim1Mock,
  claim2Mock,
} from '../../../controllers/claims/mocks/claims.mock';
import {
  calculateDeductiblesTotal,
  calculateMemberPaysTotal,
} from './claim-history-pdf.helper';

describe('claimHistoryPdfHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateDeductiblesTotal', () => {
    it('calculates total of all claim deductibles', () => {
      const deductible1Mock = 12.99;
      const deductible2Mock = 39.99;
      const claimsMock: IClaim[] = [
        {
          ...claim1Mock,
          billing: {
            ...claim1Mock.billing,
            deductibleApplied: deductible1Mock,
          },
        },
        {
          ...claim2Mock,
          billing: {
            ...claim2Mock.billing,
            deductibleApplied: deductible2Mock,
          },
        },
      ];

      expect(calculateDeductiblesTotal(claimsMock)).toEqual(
        deductible1Mock + deductible2Mock
      );
    });
  });

  describe('calculateMemberPaysTotal', () => {
    it('calculates total of all claim member pays amounts', () => {
      const memberPays1Mock = 5.99;
      const memberPays2Mock = 6.99;
      const claimsMock: IClaim[] = [
        {
          ...claim1Mock,
          billing: {
            ...claim1Mock.billing,
            memberPays: memberPays1Mock,
          },
        },
        {
          ...claim2Mock,
          billing: {
            ...claim2Mock.billing,
            memberPays: memberPays2Mock,
          },
        },
      ];

      expect(calculateMemberPaysTotal(claimsMock)).toEqual(
        memberPays1Mock + memberPays2Mock
      );
    });
  });
});
