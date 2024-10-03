// Copyright 2018 Prescryptive Health, Inc.

import { IPendingPrescription } from '../../../../models/pending-prescription';
import {
  IClaimAlertExperienceNotification,
  IClaimAlertExperienceReversal,
} from '../../../../models/recommendation-experience/recommendation-experience';
import {
  AlternativesSubstitutionCarouselConstants,
  GenericSubstitutionCarouselConstants,
  NotificationCarouselConstants,
  ReversalCarouselConstants,
} from '../../../../theming/constants';
import {
  mockMedications,
  mockPatient,
  mockPendingPrescriptions as mockGenericPrescription,
  mockPharmacies,
  mockPrescriptionOffers,
  mockPrescriptions,
  mockRecommendations,
} from '../../__mocks__/scenario-one.mock';
import { mockPendingPrescriptions as mockReversalPrescription } from '../../__mocks__/scenario-reversal.mock';
import { mockPendingPrescriptions as mockAlternativePrescription } from '../../__mocks__/scenario-two.mock';
import { mockPendingPrescriptions as mockNotificationPrescription } from '../../__mocks__/scenario-zero.mock';
import {
  reduceNotificationRecommendationExperience,
  reduceRecommendationExperiences,
  reduceReversalRecommendationExperience,
} from './prescriptions-reducer.recommendation-experience';

const mockPrescriptionWithoutRecommendations = {
  confirmation: {
    offerId: mockPrescriptionOffers[0].offerId,
  },
  pharmacies: mockPharmacies,
} as IPendingPrescription;

const mockPrescriptionWithoutConfirmation = {
  pharmacies: mockPharmacies,
  recommendations: mockRecommendations,
} as IPendingPrescription;

const mockPrescriptionWithoutInvalidOfferId = {
  bestPrice: '$430',
  confirmation: {
    offerId: 'invalidId',
    orderDate: new Date(),
    orderNumber: '54321',
  },
  identifier: 'mock-pending-rx-5',
  medication: mockMedications[0],
  medicationId: '00002035302',
  offers: mockPrescriptionOffers,
  patient: mockPatient,
  pharmacies: mockPharmacies,
  prescription: mockPrescriptions[0],
  recommendations: mockRecommendations,
} as IPendingPrescription;

describe('reduceRecommendationExperiences', () => {
  it('return alternativeSubstitution,genericSubstitution, notification and reversal as undefined if recommendations are missing', () => {
    const response = reduceRecommendationExperiences(
      mockPrescriptionWithoutRecommendations
    );
    expect(response.genericSubstitution).toBeUndefined();
    expect(response.alternativeSubstitution).toBeUndefined();
    expect(response.notification).toBeUndefined();
    expect(response.reversal).toBeUndefined();
  });

  it('return alternativeSubstitution,genericSubstitution, notification and reversal as undefined if confirmation is missing', () => {
    const response = reduceRecommendationExperiences(
      mockPrescriptionWithoutConfirmation
    );
    expect(response.genericSubstitution).toBeUndefined();
    expect(response.alternativeSubstitution).toBeUndefined();
    expect(response.notification).toBeUndefined();
    expect(response.reversal).toBeUndefined();
  });

  it('throw exception if originalOffer is undefined ', () => {
    try {
      reduceRecommendationExperiences(mockPrescriptionWithoutInvalidOfferId);
    } catch (e) {
      expect((e as Error).message).toBe(
        'RecommendationGenericSubstitutionRule object is missing'
      );
    }
  });

  it('return alternativeSubstitution carousel constants if rule type is alternativeSubstitution', () => {
    const response = reduceRecommendationExperiences(
      mockAlternativePrescription[0]
    );
    expect(response.genericSubstitution).toBeUndefined();
    expect(response.alternativeSubstitution).toBeDefined();
    expect(response.notification).toBeUndefined();
    expect(response.reversal).toBeUndefined();
    expect(response.alternativeSubstitution?.carousel).toEqual({
      ...AlternativesSubstitutionCarouselConstants,
      priceText: `${AlternativesSubstitutionCarouselConstants.priceText}`,
    });
  });

  it('return alternativeSubstitution carousel constants if rule type is genericSubstitution', () => {
    const response = reduceRecommendationExperiences(
      mockGenericPrescription[0]
    );
    expect(response.alternativeSubstitution).toBeUndefined();
    expect(response.genericSubstitution).toBeDefined();
    expect(response.notification).toBeUndefined();
    expect(response.reversal).toBeUndefined();
    expect(response.genericSubstitution?.carousel).toEqual({
      ...GenericSubstitutionCarouselConstants,
      priceText: `${GenericSubstitutionCarouselConstants.priceText}`,
    });
  });

  it('return notification carousel constants if rule type is notification', () => {
    const response = reduceRecommendationExperiences(
      mockNotificationPrescription[0]
    );
    expect(response.alternativeSubstitution).toBeUndefined();
    expect(response.genericSubstitution).toBeUndefined();
    expect(response.reversal).toBeUndefined();
    expect(response.notification).toBeDefined();
    expect(response.notification?.carousel).toEqual({
      ...NotificationCarouselConstants,
    });
  });

  it('return reversal carousel constants if rule type is reversal', () => {
    const response = reduceRecommendationExperiences(
      mockReversalPrescription[0]
    );
    expect(response.alternativeSubstitution).toBeUndefined();
    expect(response.genericSubstitution).toBeUndefined();
    expect(response.notification).toBeUndefined();
    expect(response.reversal).toBeDefined();
    expect(response.reversal?.carousel).toEqual({
      ...ReversalCarouselConstants,
    });
  });
});

describe('reduceNotificationRecommendationExperience', () => {
  it('should return undefined if confirmation is not defined', () => {
    const response = reduceNotificationRecommendationExperience({
      ...mockNotificationPrescription[0],
      confirmation: undefined,
    });
    expect(response).toBeUndefined();
  });

  it('should throw exception if originalOffer is undefined ', () => {
    try {
      reduceNotificationRecommendationExperience({
        ...mockNotificationPrescription[0],
        offers: [],
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Notification Original Offer is missing'
      );
    }
  });
  it('should return RecommendationExperienceNotification', () => {
    const response = reduceNotificationRecommendationExperience({
      ...mockNotificationPrescription[0],
    }) as IClaimAlertExperienceNotification;
    expect(response.carousel).toEqual(NotificationCarouselConstants);
    expect(response.originalOffer.fillOptions).toEqual(
      mockNotificationPrescription[0].prescription.fillOptions[0]
    );
    expect(response.originalOffer.medication).toEqual(
      mockNotificationPrescription[0].medication
    );
    expect(response.originalOffer.offer).toEqual(
      mockNotificationPrescription[0].offers[0]
    );
    expect(response.originalOffer.pharmacy).toEqual(
      mockNotificationPrescription[0].pharmacies[0]
    );
    expect(response.prescription).toEqual(mockNotificationPrescription[0]);

    const expectedRecommendation = mockNotificationPrescription[0]
      .recommendations
      ? mockNotificationPrescription[0].recommendations[0]
      : undefined;
    expect(response.recommendation).toEqual(expectedRecommendation);
  });
});

describe('reduceReversalRecommendationExperience', () => {
  it('should return undefined if confirmation is not defined', () => {
    const response = reduceReversalRecommendationExperience({
      ...mockReversalPrescription[0],
      confirmation: undefined,
    });
    expect(response).toBeUndefined();
  });

  it('should throw exception if originalOffer is undefined ', () => {
    try {
      reduceReversalRecommendationExperience({
        ...mockReversalPrescription[0],
        offers: [],
      });
    } catch (e) {
      expect((e as Error).message).toBe('Reversal Original Offer is missing');
    }
  });

  it('should return RecommendationExperienceReversal', () => {
    const response = reduceReversalRecommendationExperience({
      ...mockReversalPrescription[0],
    }) as IClaimAlertExperienceReversal;
    expect(response.carousel).toEqual(ReversalCarouselConstants);
    expect(response.originalOffer.fillOptions).toEqual(
      mockReversalPrescription[0].prescription.fillOptions[0]
    );
    expect(response.originalOffer.medication).toEqual(
      mockReversalPrescription[0].medication
    );
    expect(response.originalOffer.offer).toEqual(
      mockReversalPrescription[0].offers[0]
    );
    expect(response.originalOffer.pharmacy).toEqual(
      mockReversalPrescription[0].pharmacies[0]
    );
    expect(response.prescription).toEqual(mockReversalPrescription[0]);

    const expectedRecommendation = mockReversalPrescription[0].recommendations
      ? mockReversalPrescription[0].recommendations[0]
      : undefined;
    expect(response.recommendation).toEqual(expectedRecommendation);
  });
});
