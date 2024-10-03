// Copyright 2021 Prescryptive Health, Inc.

import { IPendingPrescription } from '../models/pending-prescription';
import { IPharmacyOffer } from '../models/pharmacy-offer';
import {
  IRecommendation,
  IRecommendationAlternativesSubstitutionRule,
  IRecommendationGenericSubstitutionRule,
} from '../models/recommendation';
import {
  getOriginalOfferDetails,
  getPharmacy,
  getRecommendation,
  getRecommendationRule,
  getRecommendedAlternativesSubstitutionOffers,
  getRecommendedGenericSubstitutionOffer,
  getRecommendedOffers,
} from './recommendation-experience.helper';

const mockEmptyPendingPrescription = {
  prescription: {
    fillOptions: [],
  },
  pharmacies: [],
} as unknown as IPendingPrescription;

const mockValidPendingPrescription = {
  confirmation: {
    offerId: '123',
  },
  offers: [
    {
      offerId: '123',
      pharmacyNcpdp: '123',
      recommendation: { identifier: '1' },
    },
  ],
  prescription: {
    fillOptions: [{ id: 'id-1' }],
  },
  medication: 'medication',
  pharmacies: [{ ncpdp: '123' }],
  recommendations: [{ identifier: '1' }],
} as unknown as IPendingPrescription;

const pharmacyOfferMock = {
  pharmacyNcpdp: '123',
} as IPharmacyOffer;

const mockValidPendingPrescriptionRecommendations = {
  prescription: {
    fillOptions: [],
  },
  pharmacies: [{ ncpdp: '123' }],
  recommendations: [
    {
      identifier: '1',
      rule: { type: 'alternativeSubstitution' },
      savings: 114,
    },
    {
      identifier: '2',
      rule: { type: 'alternativeSubstitution' },
      savings: 115,
    },
  ],
} as unknown as IPendingPrescription;

const mockValidPendingPrescriptionWitEmptyRecommendations = {
  prescription: {
    fillOptions: [],
  },
  pharmacies: [{ ncpdp: '123' }],
  recommendations: [],
} as unknown as IPendingPrescription;

const mockValidPendingPrescriptionWithoutRecommendations = {
  prescription: {
    fillOptions: [],
  },
  pharmacies: [{ ncpdp: '123' }],
} as unknown as IPendingPrescription;

describe('getRecommendation', () => {
  it('should throw error if no recommendation exists ', () => {
    try {
      getRecommendation(mockEmptyPendingPrescription, '');
    } catch (err: unknown) {
      expect((err as Error).message).toBe(
        'Invalid prescription for working with recommendations (no recommendations)'
      );
    }
  });
  it('should throw error if no recommendation is found', () => {
    try {
      getRecommendation(mockValidPendingPrescription, '');
    } catch (err: unknown) {
      expect((err as Error).message).toBe(
        'Recommendation identifier not found'
      );
    }
  });
  it('should return recommendation if found', () => {
    const recommendation = getRecommendation(mockValidPendingPrescription, '1');
    const expectedRecommendation = { identifier: '1' };
    expect(recommendation).toEqual(expectedRecommendation);
  });
});

describe('getPharmacy', () => {
  it('should throw error if no pharmacy exists for given offer', () => {
    try {
      getPharmacy(mockEmptyPendingPrescription, pharmacyOfferMock);
    } catch (err: unknown) {
      expect((err as Error).message).toBe('Pharmacy not found: 123');
    }
  });
  it('should return pharmacy if found', () => {
    const pharmacy = getPharmacy(
      mockValidPendingPrescription,
      pharmacyOfferMock
    );

    const expectedPharmacy = { ncpdp: '123' };
    expect(pharmacy).toEqual(expectedPharmacy);
  });
});

describe('getRecommendationRule', () => {
  it('should get recommendation with bigger saving', () => {
    const recommendation = getRecommendationRule(
      mockValidPendingPrescriptionRecommendations,
      'alternativeSubstitution'
    );
    const expectedRecommendation = {
      identifier: '2',
      rule: { type: 'alternativeSubstitution' },
      savings: 115,
    };
    expect(recommendation).toEqual(expectedRecommendation);
  });
  it('should return undefined if there is no alternative', () => {
    const recommendation = getRecommendationRule(
      mockValidPendingPrescriptionWitEmptyRecommendations,
      'alternativeSubstitution'
    );
    expect(recommendation).toBeUndefined();
  });
  it('should return undefined if recommendation is null', () => {
    const recommendation = getRecommendationRule(
      mockValidPendingPrescriptionWithoutRecommendations,
      'alternativeSubstitution'
    );
    expect(recommendation).toBeUndefined();
  });
});

describe('getOriginalOfferDetails', () => {
  it('should return undefined if no prescription selected', () => {
    const originalOffer = getOriginalOfferDetails();
    expect(originalOffer).toEqual(undefined);
  });

  it('should return offer details if valid prescription selected', () => {
    const originalOffer = getOriginalOfferDetails({
      prescription: { ...mockValidPendingPrescription },
    });
    const expectedMock = {
      fillOptions: {
        id: 'id-1',
      },
      medication: 'medication',
      offer: {
        offerId: '123',
        pharmacyNcpdp: '123',
        recommendation: { identifier: '1' },
      },
      pharmacy: {
        ncpdp: '123',
      },
    };
    expect(originalOffer).toEqual(expectedMock);
  });
});

describe('getRecommendedOffers', () => {
  it('should return recommended offers if found', () => {
    const mockOriginalOffer = { offerId: '234' } as IPharmacyOffer;
    const mockRecommendation = { identifier: '1' } as IRecommendation;
    const recommendedOffer = getRecommendedOffers(
      mockValidPendingPrescription,
      mockOriginalOffer,
      mockRecommendation
    );
    const expectedOffer = [
      {
        offerId: '123',
        pharmacyNcpdp: '123',
        recommendation: { identifier: '1' },
      },
    ];
    expect(recommendedOffer).toEqual(expectedOffer);
  });
});

describe('getRecommendedAlternativesSubstitutionOffers', () => {
  it('should return recommended alternative subtitute offers if found', () => {
    const mockPharmacylOffer = [
      { offerId: '123', pharmacyNcpdp: '123', recommendation: { index: 0 } },
    ] as IPharmacyOffer[];
    const alternativeRuleMock = {
      to: [{ fillOptions: { count: 0 } }],
    } as IRecommendationAlternativesSubstitutionRule;
    const recommendedOffer = getRecommendedAlternativesSubstitutionOffers(
      mockValidPendingPrescription,
      alternativeRuleMock,
      mockPharmacylOffer
    );
    const expectedOffer = [
      {
        fillOptions: { count: 0 },
        medication: undefined,
        offer: {
          offerId: '123',
          pharmacyNcpdp: '123',
          recommendation: { index: 0 },
        },
        pharmacy: { ncpdp: '123' },
      },
    ];
    expect(recommendedOffer).toEqual(expectedOffer);
  });
});

describe('getRecommendedGenericSubstitutionOffer', () => {
  it('should return recommended generic subtitute offers if found', () => {
    const mockPharmacylOffer = {
      offerId: '123',
      pharmacyNcpdp: '123',
      recommendation: { index: 0 },
    } as IPharmacyOffer;

    const genericRuleMock = {
      to: { fillOptions: { count: 0 }, medication: {} },
    } as IRecommendationGenericSubstitutionRule;
    const recommendedOffer = getRecommendedGenericSubstitutionOffer(
      mockValidPendingPrescription,
      genericRuleMock,
      mockPharmacylOffer
    );
    const expectedOffer = {
      fillOptions: { count: 0 },
      medication: {},
      offer: {
        offerId: '123',
        pharmacyNcpdp: '123',
        recommendation: { index: 0 },
      },
      pharmacy: { ncpdp: '123' },
    };
    expect(recommendedOffer).toEqual(expectedOffer);
  });
});
