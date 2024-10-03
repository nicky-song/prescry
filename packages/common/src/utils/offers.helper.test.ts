// Copyright 2018 Prescryptive Health, Inc.

import {
  mockPendingPrescriptions,
  mockPharmacies,
  mockPrescriptionOffers,
} from '../experiences/guest-experience/__mocks__/pending-prescriptions.mock';
import {
  defaultPrescriptionsState,
  IPrescriptionsState,
} from '../experiences/guest-experience/store/prescriptions/prescriptions-reducer';
import { IHours } from '../models/date-time/hours';
import { IPharmacyOffer } from '../models/pharmacy-offer';
import { formatPhoneNumber } from './formatters/phone-number.formatter';
import {
  buildPharmacyDetails,
  createOffersListRowProps,
} from './offers.helper';
import { convertHoursToMap } from './pharmacy-info.helper';
import { buildDispenseType, isOpenNow } from './pharmacy-info.helper';
import { RootState } from '../experiences/guest-experience/store/root-reducer';
import { GuestExperienceConfig } from '../experiences/guest-experience/guest-experience-config';
import { IPendingPrescription } from '../models/pending-prescription';

jest.mock('./prescription-info.helper', () => ({
  buildPrescriptionDetails: jest.fn(),
}));

jest.mock('./pharmacy-info.helper', () => ({
  buildDispenseType: jest.fn(),
  convertHoursToMap: jest.fn(),
  isOpenNow: jest.fn(),
}));

const isOpenNowMock = isOpenNow as jest.Mock;
const convertHoursToMapMock = convertHoursToMap as jest.Mock;
const buildDispenseTypeMock = buildDispenseType as jest.Mock;
beforeEach(() => {
  convertHoursToMapMock.mockReset();
  isOpenNowMock.mockReset();
  buildDispenseTypeMock.mockReset();
});

describe('createOffersListRowProps', () => {
  it('should return offer list with zero count if sorted offers=[]', () => {
    const prescription = {
      ...defaultPrescriptionsState,
      selectedPrescription: mockPendingPrescriptions[0],
    };

    const sortedOfferList: IPharmacyOffer[] = [];
    const rx = prescription.selectedPrescription;
    const currentDate: Date = new Date();
    const offerList = createOffersListRowProps(
      sortedOfferList,
      rx.pharmacies,
      currentDate
    );
    expect(offerList.length).toBe(0);
  });

  it('should return offer list along with all props to be defined', () => {
    const sortedOfferList: IPharmacyOffer[] = [
      {
        offerId: 'c12c48a3-1b1c-48d4-bee7-6ed9d182635f',
        pharmacyNcpdp: '4919900',
        price: {
          memberPaysOffer: 450.03,
          memberPaysShipping: 8,
          memberPaysTotal: 450.03,
          pharmacyCashPrice: 658.71,
          planCoveragePays: 208.68,
        },
        sort: { price: 450.03 },
        type: 'mail-order',
      },
    ];

    const pharmacyContactInfo = [mockPharmacies[3]];
    isOpenNowMock.mockReturnValue(false);
    buildDispenseTypeMock.mockReturnValue('Opens at 9 am');

    const hoursMock: IHours[] = [];
    const currentDate: Date = new Date();
    const offerList = createOffersListRowProps(
      sortedOfferList,
      pharmacyContactInfo,
      currentDate
    );
    expect(offerList.length).toBeGreaterThanOrEqual(1);
    expect(isOpenNowMock).not.toBeCalledWith(hoursMock, currentDate);
    expect(buildDispenseTypeMock).not.toBeCalledWith(
      false,
      [{}] as IHours[],
      currentDate
    );
    const expectedPropsLength = 15;
    offerList.forEach((offerListProp) => {
      expect(Object.keys(offerListProp).length).toEqual(expectedPropsLength);
      expect(offerListProp.body).toBe('N/A');
      expect(offerListProp.dispenseType).toBe('Opens at 9 am');
      expect(offerListProp.distanceText).toBe(undefined);
      expect(offerListProp.isOpen).toBeFalsy();
      expect(offerListProp.externalLink).toEqual({
        link: 'N/A',
        moreLinkText: 'N/A',
      });
      expect(offerListProp.image).toBe('downArrow');
      expect(offerListProp.memberPaysTotal).toBe(450.03);
      expect(offerListProp.offerId).toBe(
        'c12c48a3-1b1c-48d4-bee7-6ed9d182635f'
      );
      expect(offerListProp.pharmacyCashPrice).toBe(658.71);
      expect(offerListProp.pharmacyId).toBe('4919900');
      expect(offerListProp.pharmacyName).toBe('MailPharma');
      expect(offerListProp.planPays).toBe(208.68);
      expect(offerListProp.price).toBe(450.03);
      expect(offerListProp.shippingPrice).toBe(8);
      expect(offerListProp.slug).toBe('N/A');
    });
  });
});

describe('buildPharmacyDetails', () => {
  it('should return pharmacyDetails', () => {
    const selectedOffer: IPharmacyOffer = mockPrescriptionOffers[2];

    const prescriptionMock: IPendingPrescription = {
      ...mockPendingPrescriptions[2],
      pharmacies: [...mockPendingPrescriptions[2].pharmacies],
    };
    prescriptionMock.pharmacies[0] = {
      ...prescriptionMock.pharmacies[0],
      name: 'pharmacy-name    ',
      address: {
        city: '  city  ',
        lineOne: '  line-one  ',
        lineTwo: '  line-two   ',
        state: ' state  ',
        zip: ' 12345 ',
      },
    };

    const prescriptionState: IPrescriptionsState = {
      ...defaultPrescriptionsState,
      selectedOffer,
      selectedPrescription: {
        prescription: prescriptionMock,
        recommendationExperience: {},
      },
    };

    const currentDateMock = new Date();
    const initialState: Partial<RootState> = {
      prescription: prescriptionState,
      config: { ...GuestExperienceConfig, currentDate: currentDateMock },
    };

    const expectedPharmacy = prescriptionMock.pharmacies[0];

    const returnAddress1 = expectedPharmacy.address?.lineOne.trim();
    const returnAddress2 = expectedPharmacy.address?.lineTwo?.trim();
    const returnState = expectedPharmacy.address?.state.trim();
    const returnZipCode = expectedPharmacy.address?.zip.trim();
    const returnCity = expectedPharmacy.address?.city.trim();
    const returnConvertedHours = new Map();

    convertHoursToMapMock.mockReturnValue(returnConvertedHours);
    const expectedPharmacyDetailsObjectLength = 15;
    const pharmacyDetails = buildPharmacyDetails(initialState as RootState);

    expect(convertHoursToMapMock).toHaveBeenCalledWith(mockPharmacies[0].hours);
    expect(Object.keys(pharmacyDetails).length).toEqual(
      expectedPharmacyDetailsObjectLength
    );

    expect(pharmacyDetails.currentDate).toBe(currentDateMock);
    expect(pharmacyDetails.distance).toBe('0.5 miles');
    expect(pharmacyDetails.driveThru).toBeFalsy();
    expect(pharmacyDetails.memberPaysTotal).toBe(
      mockPrescriptionOffers[2].price.memberPaysTotal
    );
    expect(pharmacyDetails.pharmacyAddress1).toBe(returnAddress1);
    expect(pharmacyDetails.pharmacyCity).toBe(returnCity);
    expect(pharmacyDetails.pharmacyZipCode).toBe(returnZipCode);
    expect(pharmacyDetails.pharmacyAddress2).toBe(returnAddress2);
    expect(pharmacyDetails.pharmacyState).toBe(returnState);
    expect(pharmacyDetails.pharmacyCashPrice).toBe(
      mockPrescriptionOffers[2].price.pharmacyCashPrice
    );
    expect(pharmacyDetails.pharmacyHours).toEqual(returnConvertedHours);
    expect(pharmacyDetails.pharmacyName).toBe(expectedPharmacy.name.trim());
    expect(pharmacyDetails.phoneNumber).toBe(
      formatPhoneNumber(expectedPharmacy.phone)
    );
    expect(pharmacyDetails.planPays).toBe(
      mockPrescriptionOffers[2].price.planCoveragePays
    );
  });

  it('should returns default value when selectedPrescription is undefined', () => {
    const prescriptionState: IPrescriptionsState = {
      ...defaultPrescriptionsState,
      selectedPrescription: undefined,
    };

    const currentDateMock = new Date();
    const initialState: Partial<RootState> = {
      prescription: prescriptionState,
      config: { ...GuestExperienceConfig, currentDate: currentDateMock },
    };

    const expectedPharmacyDetailsObjectLength = 15;
    const pharmacyDetails = buildPharmacyDetails(initialState as RootState);
    expect(Object.keys(pharmacyDetails).length).toEqual(
      expectedPharmacyDetailsObjectLength
    );
    expect(pharmacyDetails.currentDate).toBe(currentDateMock);
    expect(pharmacyDetails.distance).toBe(undefined);
    expect(pharmacyDetails.driveThru).toBeFalsy();
    expect(pharmacyDetails.memberPaysTotal).toBe(0);
    expect(pharmacyDetails.pharmacyAddress1).toBe('unknown');
    expect(pharmacyDetails.pharmacyCashPrice).toBe(0);
    expect(pharmacyDetails.pharmacyHours).toEqual(new Map<string, string>());
    expect(pharmacyDetails.pharmacyName).toBe('unknown');
    expect(pharmacyDetails.phoneNumber).toBe('unknown');
    expect(pharmacyDetails.planPays).toBe(0);
  });

  it('should returns default value when selectedOffer is undefined', () => {
    const selectedOffer = undefined;
    const prescriptionState = {
      ...defaultPrescriptionsState,
      selectedOffer,
    };

    const currentDateMock = new Date();
    const initialState: Partial<RootState> = {
      prescription: prescriptionState,
      config: { ...GuestExperienceConfig, currentDate: currentDateMock },
    };
    const expectedPharmacyDetailsObjectLength = 15;
    const pharmacyDetails = buildPharmacyDetails(initialState as RootState);

    expect(Object.keys(pharmacyDetails).length).toEqual(
      expectedPharmacyDetailsObjectLength
    );
    expect(pharmacyDetails.currentDate).toBe(currentDateMock);
    expect(pharmacyDetails.distance).toBe(undefined);
    expect(pharmacyDetails.driveThru).toBeFalsy();
    expect(pharmacyDetails.memberPaysTotal).toBe(0);
    expect(pharmacyDetails.pharmacyAddress1).toBe('unknown');
    expect(pharmacyDetails.pharmacyCashPrice).toBe(0);
    expect(pharmacyDetails.pharmacyHours).toEqual(new Map<string, string>());
    expect(pharmacyDetails.pharmacyName).toBe('unknown');
    expect(pharmacyDetails.phoneNumber).toBe('unknown');
    expect(pharmacyDetails.planPays).toBe(0);
  });
});
