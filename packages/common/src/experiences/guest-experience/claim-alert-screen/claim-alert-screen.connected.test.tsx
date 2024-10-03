// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import { IPendingPrescription } from '../../../models/pending-prescription';
import { IRecommendationInstructionAlternatives } from '../../../models/recommendation-experience/recommendation-instruction';
import {
  GenericSubstitutionCarouselConstants,
  NotificationCarouselConstants,
  RecommendationAlternativesScreenConstants,
  ReversalCarouselConstants,
} from '../../../theming/constants';
import { AlternativesSubstitutionCarouselConstants } from '../../../theming/constants';
import { buildPharmacyDetails } from '../../../utils/offers.helper';
import { buildRecommendationPrescriptionDetails } from '../../../utils/prescription-info.helper';
import {
  mockPharmacies as mockGenericPharmacies,
  mockPrescriptionOffers as mockGenericPrescriptionOffers,
} from '../__mocks__/scenario-one.mock';
import {
  mockPlanSaveAlternativeRecommendations,
  mockPlanSaveGenericRecommendations,
  mockYouSaveAlternativeRecommendations,
  mockYouSaveGenericRecommendations,
} from '../__mocks__/recommendations.mock';
import {
  mockPharmacies as mockReversalPharmacies,
  mockPrescriptionOffers as mockReversalPrescriptionOffers,
  mockRecommendations as mockReversalRecommendations,
} from '../__mocks__/scenario-reversal.mock';
import {
  mockPharmacies as mockAlternativePharmacies,
  mockPrescriptionOffers as mockAlternativePrescriptionOffers,
} from '../__mocks__/scenario-two.mock';
import {
  mockPharmacies as mockNotificationPharmacies,
  mockPrescriptionOffers as mockNotificationPrescriptionOffers,
  mockRecommendations as mockNotificationRecommendations,
} from '../__mocks__/scenario-zero.mock';
import { defaultPrescriptionsState } from '../store/prescriptions/prescriptions-reducer';
import { RootState } from '../store/root-reducer';
import {
  ConnectedClaimAlertScreen,
  mapStatetoProps,
} from './claim-alert-screen.connected';
import { getDrugInformationAsyncAction } from '../store/drug-information/async-actions/get-drug-information.async-action';
import { IClaimAlertScreenActionProps } from './claim-alert-screen';

jest.mock('./claim-alert-screen', () => ({
  ClaimAlertScreen: () => <div />,
}));

jest.mock('../store/prescriptions/prescriptions-reducer.actions', () =>
  jest.fn()
);

jest.mock('../../../utils/offers.helper', () => ({
  buildMailOrderDetails: jest.fn(),
  buildPharmacyDetails: jest.fn(),
  createOffersListRowProps: jest.fn(),
}));

jest.mock('../../../utils/prescription-info.helper', () => ({
  buildRecommendationPrescriptionDetails: jest.fn(),
  buildSelectedPrescriptionDetails: jest.fn(),
}));
jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

const connectMock = connect as unknown as jest.Mock;
const buildPharmacyDetailsMock = buildPharmacyDetails as jest.Mock;
const mockRecommendationPrescriptionDetails =
  buildRecommendationPrescriptionDetails as jest.Mock;

const alternativePrescription = {
  confirmation: {
    offerId: mockAlternativePrescriptionOffers[0].offerId,
  },
  offers: [mockAlternativePrescriptionOffers[0]],
  pharmacies: mockAlternativePharmacies,
} as IPendingPrescription;
const genericPrescription = {
  confirmation: {
    offerId: mockGenericPrescriptionOffers[0].offerId,
  },
  offers: [mockGenericPrescriptionOffers[0]],
  pharmacies: mockGenericPharmacies,
} as IPendingPrescription;
const instruction: IRecommendationInstructionAlternatives = {
  callToActionText: RecommendationAlternativesScreenConstants.callToActionText,
  doctorContactNumber:
    RecommendationAlternativesScreenConstants.doctorContactNumber,
  doctorName: RecommendationAlternativesScreenConstants.doctorName,
  explanationText: RecommendationAlternativesScreenConstants.explanationText,
};
const config = { currentDate: new Date() };
const alternativeInitialState = {
  config,
  prescribedMember: {
    firstName: 'fake firstName',
    identifier: 'fake identifier',
    isPrimary: false,
    lastName: 'fake lastName',
  },
  prescription: {
    advertising: {
      claimAlertCoupon: {
        imageName: 'couponLogo',
        show: false,
      },
    },
    selectedPrescription: {
      prescription: {
        confirmation: {
          offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
          orderDate: new Date(),
          orderNumber: '54321',
        },
        medication: {},
        offers: mockAlternativePrescriptionOffers,
        pharmacies: mockAlternativePharmacies,
        prescription: {
          fillOptions: [
            {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
          ],
        },
        recommendations: mockYouSaveAlternativeRecommendations,
      },
      recommendationExperience: {
        alternativeSubstitution: {
          carousel: AlternativesSubstitutionCarouselConstants,
          instruction,
          originalOffer: {
            fillOptions: {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
            medication: {},
            offer: {},
            pharmacy: {},
          },
          prescription: alternativePrescription,
          recommendation: mockYouSaveAlternativeRecommendations[0],
          recommendedOffers: [
            {
              fillOptions: {},
              medication: {},
              offer: {
                offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
                pharmacyNcpdp: '4914176',
                price: {
                  memberPaysOffer: 141.58,
                  memberPaysTotal: 141.58,
                  pharmacyCashPrice: 566.32,
                  planCoveragePays: 424.74,
                },
              },
              pharmacy: {},
            },
          ],
        },
      },
    },
  },
  drugInformation: {
    drug: {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    },
  },
} as unknown as RootState;

const alternativePlanCouldSaveState = {
  config,
  prescribedMember: {
    firstName: 'fake firstName',
    identifier: 'fake identifier',
    isPrimary: false,
    lastName: 'fake lastName',
  },
  prescription: {
    advertising: {
      claimAlertCoupon: {
        imageName: 'couponLogo',
        show: false,
      },
    },
    selectedPrescription: {
      prescription: {
        confirmation: {
          offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
          orderDate: new Date(),
          orderNumber: '54321',
        },
        medication: {},
        offers: mockAlternativePrescriptionOffers,
        pharmacies: mockAlternativePharmacies,
        prescription: {
          fillOptions: [
            {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
          ],
        },
        recommendations: mockPlanSaveAlternativeRecommendations,
      },
      recommendationExperience: {
        alternativeSubstitution: {
          carousel: AlternativesSubstitutionCarouselConstants,
          instruction,
          originalOffer: {
            fillOptions: {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
            medication: {},
            offer: {},
            pharmacy: {},
          },
          prescription: alternativePrescription,
          recommendation: mockPlanSaveAlternativeRecommendations[0],
          recommendedOffers: [
            {
              fillOptions: {},
              medication: {},
              offer: {
                offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
                pharmacyNcpdp: '4914176',
                price: {
                  memberPaysOffer: 141.58,
                  memberPaysTotal: 141.58,
                  pharmacyCashPrice: 566.32,
                  planCoveragePays: 424.74,
                },
              },
              pharmacy: {},
            },
          ],
        },
      },
    },
  },
  drugInformation: {
    drug: {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    },
  },
} as unknown as RootState;

const genericInitialState = {
  config,
  prescribedMember: {
    firstName: 'fake firstName',
    identifier: 'fake identifier',
    isPrimary: false,
    lastName: 'fake lastName',
  },
  prescription: {
    ...defaultPrescriptionsState,
    selectedPrescription: {
      prescription: {
        confirmation: {
          offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
          orderDate: new Date(),
          orderNumber: '54321',
        },
        medication: {},
        offers: mockGenericPrescriptionOffers,
        pharmacies: mockGenericPharmacies,
        prescription: {
          fillOptions: [
            {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
          ],
        },
        recommendations: mockYouSaveGenericRecommendations,
      },
      recommendationExperience: {
        genericSubstitution: {
          carousel: GenericSubstitutionCarouselConstants,
          instruction: {},
          originalOffer: {
            fillOptions: {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
            medication: {},
            offer: {},
            pharmacy: {},
          },
          prescription: genericPrescription,
          recommendation: mockYouSaveGenericRecommendations[0],
          recommendedOffer: {
            fillOptions: {},
            medication: {},
            offer: {
              offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
              pharmacyNcpdp: '4914176',
              price: {
                memberPaysOffer: 141.58,
                memberPaysTotal: 141.58,
                pharmacyCashPrice: 566.32,
                planCoveragePays: 424.74,
              },
            },
            pharmacy: {},
          },
        },
      },
    },
  },
  drugInformation: {
    drug: {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    },
  },
} as unknown as RootState;

const genericInitialStatePlanCouldSave = {
  config,
  prescribedMember: {
    firstName: 'fake firstName',
    identifier: 'fake identifier',
    isPrimary: false,
    lastName: 'fake lastName',
  },
  prescription: {
    ...defaultPrescriptionsState,
    selectedPrescription: {
      prescription: {
        confirmation: {
          offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
          orderDate: new Date(),
          orderNumber: '54321',
        },
        medication: {},
        offers: mockGenericPrescriptionOffers,
        pharmacies: mockGenericPharmacies,
        prescription: {
          fillOptions: [
            {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
          ],
        },
        recommendations: mockPlanSaveGenericRecommendations,
      },
      recommendationExperience: {
        genericSubstitution: {
          carousel: GenericSubstitutionCarouselConstants,
          instruction: {},
          originalOffer: {
            fillOptions: {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
            medication: {},
            offer: {},
            pharmacy: {},
          },
          prescription: genericPrescription,
          recommendation: mockPlanSaveGenericRecommendations[0],
          recommendedOffer: {
            fillOptions: {},
            medication: {},
            offer: {
              offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
              pharmacyNcpdp: '4914176',
              price: {
                memberPaysOffer: 141.58,
                memberPaysTotal: 141.58,
                pharmacyCashPrice: 566.32,
                planCoveragePays: 424.74,
              },
            },
            pharmacy: {},
          },
        },
      },
    },
  },
  drugInformation: {
    drug: {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    },
  },
} as unknown as RootState;

const notificationInitialState = {
  config,
  prescribedMember: {
    firstName: 'fake firstName',
    identifier: 'fake identifier',
    isPrimary: false,
    lastName: 'fake lastName',
  },
  prescription: {
    advertising: {
      claimAlertCoupon: {
        imageName: 'couponLogo',
        show: false,
      },
    },
    selectedPrescription: {
      prescription: {
        confirmation: {
          offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
          orderDate: new Date(),
          orderNumber: '54321',
        },
        medication: {},
        offers: mockNotificationPrescriptionOffers,
        pharmacies: mockNotificationPharmacies,
        prescription: {
          fillOptions: [
            {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
          ],
        },
        recommendations: mockNotificationRecommendations,
      },
      recommendationExperience: {
        notification: {
          carousel: NotificationCarouselConstants,

          originalOffer: {
            fillOptions: {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
            medication: {},
            offer: {},
            pharmacy: {},
          },
          prescription: alternativePrescription,
          recommendation: mockNotificationRecommendations[0],
        },
      },
    },
  },
  drugInformation: {
    drug: {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    },
  },
} as unknown as RootState;

const reversalInitialState = {
  config,
  prescribedMember: {
    firstName: 'fake firstName',
    identifier: 'fake identifier',
    isPrimary: false,
    lastName: 'fake lastName',
  },
  prescription: {
    advertising: {
      claimAlertCoupon: {
        imageName: 'couponLogo',
        show: false,
      },
    },
    selectedPrescription: {
      prescription: {
        confirmation: {
          offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
          orderDate: new Date(),
          orderNumber: '54321',
        },
        medication: {},
        offers: mockReversalPrescriptionOffers,
        pharmacies: mockReversalPharmacies,
        prescription: {
          fillOptions: [
            {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
          ],
        },
        recommendations: mockReversalRecommendations,
      },
      recommendationExperience: {
        reversal: {
          carousel: ReversalCarouselConstants,

          originalOffer: {
            fillOptions: {
              authorizedRefills: 5,
              count: 30,
              daysSupply: 30,
              fillNumber: 2,
            },
            medication: {},
            offer: {},
            pharmacy: {},
          },
          prescription: alternativePrescription,
          recommendation: mockReversalRecommendations[0],
        },
      },
    },
  },
  drugInformation: {
    drug: {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    },
  },
} as unknown as RootState;

beforeEach(() => {
  buildPharmacyDetailsMock.mockReset();
});

describe('Claim alert screen connected mapStateToProps', () => {
  it('should map prescription for claim alert screen', () => {
    const buildRecommendationPrescriptionDetailsMock = {
      name: 'recommendationMock',
    };
    mockRecommendationPrescriptionDetails.mockReturnValueOnce(
      buildRecommendationPrescriptionDetailsMock
    );
    const mapStatetoPropsResult = mapStatetoProps(alternativeInitialState);
    expect(mapStatetoPropsResult.prescription).toMatchObject(
      buildRecommendationPrescriptionDetailsMock
    );
  });

  it('should map recommendationProps for alternativeSubstitution plan save', () => {
    const alertSavingContentMockResponse = {
      description: 'Ask your doctor about alternative drugs.',
      heading: 'Your plan could save',
      subHeading: 'Saving your plan money helps keep premiums low.',
      imageName: 'alertCircle',
      price: 25,
    };

    const buildRecommendationPrescriptionDetailsMock = {
      name: 'recommendationMock',
    };
    mockRecommendationPrescriptionDetails.mockReturnValueOnce(
      buildRecommendationPrescriptionDetailsMock
    );
    const mapStatetoPropsResult = mapStatetoProps(
      alternativePlanCouldSaveState
    );
    expect(mapStatetoPropsResult.alertProps).toBeDefined();
    expect(mapStatetoPropsResult.alertProps?.alertSavingContent).toEqual(
      alertSavingContentMockResponse
    );
    expect(mapStatetoPropsResult.alertProps?.type).toBe(
      'alternativeSubstitution'
    );
    expect(mapStatetoPropsResult.memberProfileName).toBe(
      'fake firstName fake lastName'
    );
  });

  it('should map recommendationProps for alternativeSubstitution you save', () => {
    const alertSavingContentMockResponse = {
      description:
        'Ask your doctor about alternative drugs below that could treat your condition.',
      heading: 'You could save',
      imageName: 'alertCircle',
      price: 116,
    };

    const buildRecommendationPrescriptionDetailsMock = {
      name: 'recommendationMock',
    };
    mockRecommendationPrescriptionDetails.mockReturnValueOnce(
      buildRecommendationPrescriptionDetailsMock
    );
    const mapStatetoPropsResult = mapStatetoProps(alternativeInitialState);
    expect(mapStatetoPropsResult.alertProps).toBeDefined();
    expect(mapStatetoPropsResult.alertProps?.alertSavingContent).toEqual(
      alertSavingContentMockResponse
    );
    expect(mapStatetoPropsResult.alertProps?.type).toBe(
      'alternativeSubstitution'
    );
    expect(mapStatetoPropsResult.memberProfileName).toBe(
      'fake firstName fake lastName'
    );
  });

  it('should map alertProps for genericSubstitution', () => {
    const alertSavingContentMockResponse = {
      description:
        'Ask your pharmacist about switching to a generic equivalent.',
      heading: 'Save with the generic',
      imageName: 'errorCircle',
      price: 116,
    };
    const buildRecommendationPrescriptionDetailsMock = {
      name: 'recommendationMock',
    };
    mockRecommendationPrescriptionDetails.mockReturnValueOnce(
      buildRecommendationPrescriptionDetailsMock
    );
    const mapStatetoPropsResult = mapStatetoProps(genericInitialState);
    expect(mapStatetoPropsResult.alertProps).toBeDefined();
    expect(mapStatetoPropsResult.alertProps?.alertSavingContent).toEqual(
      alertSavingContentMockResponse
    );
    expect(mapStatetoPropsResult.alertProps?.type).toBe('genericSubstitution');
    expect(mapStatetoPropsResult.memberProfileName).toBe(
      'fake firstName fake lastName'
    );
  });
  it('should map alertProps for genericSubstitution with planCouldSave', () => {
    const alertSavingContentMockResponse = {
      description: 'Ask your pharmacist to make a switch.',
      heading: 'Save with the generic',
      subHeading: 'Saving your plan money helps keep premiums low.',
      imageName: 'errorCircle',
      price: 25,
    };
    const buildRecommendationPrescriptionDetailsMock = {
      name: 'recommendationMock',
    };
    mockRecommendationPrescriptionDetails.mockReturnValueOnce(
      buildRecommendationPrescriptionDetailsMock
    );
    const mapStatetoPropsResult = mapStatetoProps(
      genericInitialStatePlanCouldSave
    );
    expect(mapStatetoPropsResult.alertProps).toBeDefined();
    expect(mapStatetoPropsResult.alertProps?.alertSavingContent).toEqual(
      alertSavingContentMockResponse
    );
    expect(mapStatetoPropsResult.alertProps?.type).toBe('genericSubstitution');
    expect(mapStatetoPropsResult.memberProfileName).toBe(
      'fake firstName fake lastName'
    );
  });
  it('should map alertProps for notification', () => {
    const buildRecommendationPrescriptionDetailsMock = {
      name: 'recommendationMock',
    };
    mockRecommendationPrescriptionDetails.mockReturnValueOnce(
      buildRecommendationPrescriptionDetailsMock
    );
    const mapStatetoPropsResult = mapStatetoProps(notificationInitialState);
    expect(mapStatetoPropsResult.alertProps).toBeDefined();
    expect(mapStatetoPropsResult.alertProps?.type).toBe('notification');
    expect(mapStatetoPropsResult.memberProfileName).toBe(
      'fake firstName fake lastName'
    );
  });

  it('should map alertProps for reversal', () => {
    const buildRecommendationPrescriptionDetailsMock = {
      name: 'recommendationMock',
    };
    mockRecommendationPrescriptionDetails.mockReturnValueOnce(
      buildRecommendationPrescriptionDetailsMock
    );
    const mapStatetoPropsResult = mapStatetoProps(reversalInitialState);
    expect(mapStatetoPropsResult.alertProps).toBeDefined();
    expect(mapStatetoPropsResult.alertProps?.type).toBe('reversal');
    expect(mapStatetoPropsResult.memberProfileName).toBe(
      'fake firstName fake lastName'
    );
  });

  it('throws error if selectedPrescription is not defined', () => {
    const mockState = {
      config,
      prescription: {
        selectedOffer: {
          price: {
            memberPaysTotal: 123.23,
          },
        },
      },
    } as RootState;

    try {
      mapStatetoProps(mockState);
    } catch (e) {
      expect((e as Error).message).toBe(
        'Invalid state for recommended offers list screen (missing selected prescription)'
      );
    }
  });
});

describe('ConnectedClaimAlertScreen actions', () => {
  it('should be defined ConnectedClaimAlertScreen ', () => {
    expect(ConnectedClaimAlertScreen).toBeDefined();
  });

  it('should have been called the connectMock', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('should define the function and assigned with the proper actions', () => {
    const expectedActions: IClaimAlertScreenActionProps = {
      getDrugInformation: getDrugInformationAsyncAction,
    };
    expect(connectMock.mock.calls[0][1]).toEqual(expectedActions);
  });
});
