// Copyright 2022 Prescryptive Health, Inc.

import { ClaimNotification } from '@phx/common/src/models/claim-alert/claim-alert';
import { IContactInfo } from '@phx/common/src/models/contact-info';
import { IMedication } from '@phx/common/src/models/medication';
import {
  IPendingPrescription,
  IPendingPrescriptionOrderConfirmation,
} from '@phx/common/src/models/pending-prescription';
import { IPharmacyOffer } from '@phx/common/src/models/pharmacy-offer';
import { IPrescription } from '@phx/common/src/models/prescription';
import { IRecommendation } from '@phx/common/src/models/recommendation';
import { ErrorConstants } from '../../../constants/response-messages';
import { claimAlertMapper, mapPharmacies } from './claim-alert';
import { drugTransformerPrescribedMedication } from './drug';
import { claimAlertMock } from './__mocks__/claim-alert';

const additional = {
  identifier: claimAlertMock.identifier,
  masterId: 'person1234',
};

const offerIdMock = 'offer-id-mock';

const confirmationMock: IPendingPrescriptionOrderConfirmation = {
  offerId: offerIdMock,
  orderNumber: 'order-number-mock',
  orderDate: new Date(),
};

const identifierMock = offerIdMock;

const medicationMock: IMedication = {
  form: 'Capsules',
  genericName: 'Pregablin',
  genericProductId: 'generic-product-id-mock',
  medicationId: 'medication-id-mock',
  name: 'Lyrica',
  strength: '150',
  units: 'mg',
};
const medicationMock2: IMedication = {
  form: 'Capsules',
  genericName: 'Pregablin',
  genericProductId: 'generic-product-id-mock-2',
  medicationId: 'medication-id-mock-2',
  name: 'Pregablin',
  strength: '150',
  units: 'mg',
};

const offersMock: IPharmacyOffer[] = [
  {
    offerId: offerIdMock,
    pharmacyNcpdp: 'pharmacy-ncpdp-mock',
    price: {
      pharmacyCashPrice: 10,
      planCoveragePays: 1,
      memberPaysOffer: 9,
      memberPaysTotal: 9,
    },
    sort: { price: 9 },
    type: 'retail',
  },
  {
    offerId: 'offer-id-mock-2',
    pharmacyNcpdp: 'pharmacy-ncpdp-mock',
    price: {
      pharmacyCashPrice: 10,
      planCoveragePays: 2,
      memberPaysOffer: 8,
      memberPaysTotal: 8,
    },
    sort: { price: 8 },
    type: 'retail',
    recommendation: { identifier: 'identifier-mock', index: 0 },
  },
];

const pharmaciesMock: IContactInfo[] = [
  { name: 'name-mock', phone: 'phone-mock', ncpdp: 'ncpdp-mock', hours: [] },
];

const prescriptionMock: IPrescription = {
  expiresOn: new Date(),
  fillOptions: [{ count: 30, authorizedRefills: 0, fillNumber: 1 }],
  prescribedOn: new Date(),
  prescriber: {
    name: 'name-mock-2',
    phone: 'phone-mock-2',
    ncpdp: 'ncpdp-mock-2',
    hours: [],
  },
  referenceNumber: 'reference-number-mock',
  sig: 'sig-mock',
};

const recommendationsMock: IRecommendation[] = [
  {
    identifier: 'identifier-mock',
    type: 'alternativeSubstitution',
    savings: 2,
    rule: {
      planGroupNumber: 'plan-group-number-mock',
      type: 'alternativeSubstitution',
      description: 'description-mock',
      medication: medicationMock2,
      alternativeSubstitution: {
        toMedications: [medicationMock2],
        to: [
          {
            medication: medicationMock2,
            fillOptions: {
              count: 30,
              authorizedRefills: 0,
              fillNumber: 1,
            },
          },
        ],
        savings: '2',
        planSavings: '0',
      },
    },
  },
];
const pendingPrescriptionMock: IPendingPrescription = {
  bestPrice: 'todo-best-price',
  confirmation: confirmationMock,
  identifier: identifierMock,
  medication: medicationMock,
  medicationId: 'medication-id-mock',
  offers: offersMock,
  pharmacies: pharmaciesMock,
  prescription: prescriptionMock,
  recommendations: recommendationsMock,
};
describe('claimAlertMapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('it maps a substitution', () => {
    const result = claimAlertMapper({
      fromModel: pendingPrescriptionMock,
      additional,
    });

    const price = pendingPrescriptionMock.offers[0].price.memberPaysTotal;
    const planPrice = pendingPrescriptionMock.offers[0].price.planCoveragePays;

    const { count, daysSupply: supply } =
      pendingPrescriptionMock.prescription.fillOptions[0];

    const { strength, units: unit, form: formCode } = medicationMock;

    const prescribedMedication = drugTransformerPrescribedMedication({
      fromModel: medicationMock,
      additional: {
        drugDetails: { quantity: count, unit, formCode, supply, strength },
        price,
        planPrice,
        orderDate: new Date(confirmationMock.orderDate).toDateString(),
      },
    });

    expect(result.alternativeMedicationList.length).toBe(1);
    expect(result.alternativeMedicationList[0].memberSaves).toBe(2);
    expect(result.notificationType).toEqual(
      'alternativesAvailable' as ClaimNotification
    );
    expect(result.pharmacyInfo).toEqual(
      mapPharmacies(pendingPrescriptionMock.pharmacies)
    );
    expect(result.prescriber).toEqual(
      pendingPrescriptionMock.prescription.prescriber
    );
    expect(result.prescribedMedication).toEqual(prescribedMedication);
  });

  test('it maps a reversal', () => {
    const result = claimAlertMapper({
      fromModel: {
        ...pendingPrescriptionMock,
        recommendations: [{ ...recommendationsMock[0], type: 'reversal' }],
      },
      additional,
    });

    const price = pendingPrescriptionMock.offers[0].price.memberPaysTotal;
    const planPrice = pendingPrescriptionMock.offers[0].price.planCoveragePays;

    const { count, daysSupply: supply } =
      pendingPrescriptionMock.prescription.fillOptions[0];

    const { strength, units: unit, form: formCode } = medicationMock;

    const prescribedMedication = drugTransformerPrescribedMedication({
      fromModel: medicationMock,
      additional: {
        drugDetails: { quantity: count, unit, formCode, supply, strength },
        price,
        planPrice,
        orderDate: new Date(confirmationMock.orderDate).toDateString(),
      },
    });

    expect(result.alternativeMedicationList.length).toBe(0);
    expect(result.notificationType).toEqual('reversal' as ClaimNotification);
    expect(result.pharmacyInfo).toEqual(
      mapPharmacies(pendingPrescriptionMock.pharmacies)
    );
    expect(result.prescriber).toEqual(
      pendingPrescriptionMock.prescription.prescriber
    );
    expect(result.prescribedMedication).toEqual(prescribedMedication);
  });

  test('it throws error when missing confirmation', () => {
    const pendingPrescriptionMock2 = { ...pendingPrescriptionMock };

    pendingPrescriptionMock2.confirmation = undefined;

    const runner = () =>
      claimAlertMapper({ fromModel: pendingPrescriptionMock2, additional });

    expect(runner).toThrow(expect.any(Error));

    try {
      runner();
    } catch (error) {
      expect((error as Error).message).toEqual(
        ErrorConstants.NO_CONFIRMATION_FOUND(
          pendingPrescriptionMock2.identifier
        )
      );
    }
  });

  test('it throws error when missing main offer', () => {
    const pendingPrescriptionMock2 = { ...pendingPrescriptionMock };

    pendingPrescriptionMock2.confirmation = {
      offerId: 'not-the-main-offer-id',
      orderNumber: 'order-number-mock',
      orderDate: new Date(),
    };

    const runner = () =>
      claimAlertMapper({ fromModel: pendingPrescriptionMock2, additional });

    expect(runner).toThrow(expect.any(Error));

    try {
      runner();
    } catch (error) {
      expect((error as Error).message).toEqual(
        ErrorConstants.NO_MAIN_OFFER_FOUND(pendingPrescriptionMock2.identifier)
      );
    }
  });

  test('it throws error when missing fill options', () => {
    const pendingPrescriptionMock2 = { ...pendingPrescriptionMock };

    pendingPrescriptionMock2.prescription.fillOptions = [];

    const runner = () =>
      claimAlertMapper({ fromModel: pendingPrescriptionMock2, additional });

    expect(runner).toThrow(expect.any(Error));

    try {
      runner();
    } catch (error) {
      expect((error as Error).message).toEqual(
        ErrorConstants.NO_FILL_OPTIONS_FOUND(
          pendingPrescriptionMock2.identifier,
          pendingPrescriptionMock2.prescription.referenceNumber
        )
      );
    }
  });
});
