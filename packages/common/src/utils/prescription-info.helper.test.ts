// Copyright 2018 Prescryptive Health, Inc.

import { mockPendingPrescriptions } from '../experiences/guest-experience/__mocks__/pending-prescriptions.mock';
import { IContactInfo } from '../models/contact-info';
import { IPendingPrescription } from '../models/pending-prescription';
import { IPharmacyOffer } from '../models/pharmacy-offer';
import {
  buildRecommendationPrescriptionDetails,
  shouldEnableDaysSupplyToggle,
} from './prescription-info.helper';

describe('shouldEnableDaysSupplyToggle', () => {
  it('returns true if rx has 30 and 90 day fill options', () => {
    const mockRxTwoFillOptions = {
      prescription: {
        fillOptions: [
          {
            daysSupply: 30,
          },
          {
            daysSupply: 90,
          },
        ],
      },
    } as unknown as IPendingPrescription;
    const result = shouldEnableDaysSupplyToggle(mockRxTwoFillOptions);
    expect(result).toBe(true);
  });
  describe('false cases', () => {
    it('returns false if rx has only 1 daysSupply fill option', () => {
      const mockRxOneFillOption = {
        prescription: {
          fillOptions: [
            {
              daysSupply: 30,
            },
          ],
        },
      } as unknown as IPendingPrescription;
      const result = shouldEnableDaysSupplyToggle(mockRxOneFillOption);
      expect(result).toBe(false);
    });
    it('returns false if rx has no daysSupply fill option', () => {
      const mockRxNoFillOptions = {
        prescription: {
          fillOptions: [],
        },
      } as unknown as IPendingPrescription;
      const result = shouldEnableDaysSupplyToggle(mockRxNoFillOptions);
      expect(result).toBe(false);
    });
  });
});

describe('buildRecommendationPrescriptionDetails', () => {
  it('returns recommended prescriptions content', () => {
    const mockPrescription = {
      ...mockPendingPrescriptions[0],
      confirmation: {
        offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
        orderDate: new Date('2019-12-01T10:46:40.884Z'),
        orderNumber: '54321',
      },
    };
    const pharmacy: Partial<IContactInfo> = { name: 'mock-pharmacy' };
    const offer = {
      price: { memberPaysTotal: 120, planCoveragePays: 80 },
    };
    const result = buildRecommendationPrescriptionDetails(
      mockPrescription,
      pharmacy as IContactInfo,
      offer as IPharmacyOffer
    );
    expect(result.count).toBe(
      mockPrescription.prescription.fillOptions[0].count
    );
    expect(result.daysSupply).toBe(
      mockPrescription.prescription.fillOptions[0].daysSupply
    );
    expect(result.pharmacyCashPrice).toBe(offer.price.memberPaysTotal);
    expect(result.planPays).toBe(offer.price.planCoveragePays);
    expect(result.rxId).toBe(mockPrescription.prescription.referenceNumber);
    expect(result.refillCount).toBe(
      mockPrescription.prescription.fillOptions[0].authorizedRefills -
        mockPrescription.prescription.fillOptions[0].fillNumber
    );
    expect(result.pharmacyName).toBe(pharmacy.name);
    expect(result.units).toBe(mockPrescription.medication.units);
    expect(result.form).toBe(mockPrescription.medication.form);
    expect(result.drugName).toBe(mockPrescription.medication.name);
    expect(result.orderDate).toEqual(mockPrescription.confirmation.orderDate);
    expect(result.medicationId).toBe(mockPrescription.medication.medicationId);
  });
});
