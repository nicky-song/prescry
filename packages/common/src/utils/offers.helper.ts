// Copyright 2018 Prescryptive Health, Inc.

import { ImageSourcePropType } from 'react-native';
import { IPharmacyInformationProps } from '../components/member/pharmacy-information/pharmacy-information';
import { IOfferRowProps } from '../experiences/guest-experience/claim-alert-screen/claim-alert-screen';
import { RootState } from '../experiences/guest-experience/store/root-reducer';
import { IAddress } from '../models/address';
import { IContactInfo } from '../models/contact-info';
import { IPharmacyOffer } from '../models/pharmacy-offer';
import { formatPhoneNumber } from './formatters/phone-number.formatter';
import {
  buildDispenseType,
  convertHoursToMap,
  isOpenNow,
} from './pharmacy-info.helper';

export interface IOfferPriceSummaryProps {
  pharmacyCashPrice: number;
  planPays: number;
  memberPaysTotal: number;
}

export interface IPharmacyDetailsProps
  extends IPharmacyInformationProps,
    IOfferPriceSummaryProps {
  memberPays: number;
  planPays: number;
  pharmacyCashPrice: number;
}

export const createOffersListRowProps = (
  rx: IPharmacyOffer[],
  pharmacies: IContactInfo[],
  currentDate: Date
) => {
  return rx.map((offer) => {
    const pharmacy = pharmacies.find(
      (findPharmacy) => findPharmacy.ncpdp === offer.pharmacyNcpdp
    );
    let dispenseType = 'unknown';
    const isPharmacyOpenNow =
      pharmacy && pharmacy.hours && isOpenNow(pharmacy.hours, currentDate);
    if (isPharmacyOpenNow === undefined) {
      dispenseType = 'Mail order';
    } else if (pharmacy && pharmacy.hours && pharmacy.hours.length) {
      dispenseType = buildDispenseType(
        isPharmacyOpenNow,
        pharmacy.hours,
        currentDate
      );
    }
    const offerRowProps: IOfferRowProps & IOfferPriceSummaryProps = {
      body: 'N/A',
      dispenseType,
      distanceText: offer.sort.distance
        ? `${offer.sort.distance} miles`
        : undefined,
      externalLink: { moreLinkText: 'N/A', link: 'N/A' },
      image: 'downArrow' as ImageSourcePropType,
      isOpen: isPharmacyOpenNow,
      memberPaysTotal: (offer && offer.price.memberPaysTotal) || 0,
      offerId: offer.offerId,
      pharmacyCashPrice: offer.price.pharmacyCashPrice,
      pharmacyId: offer.pharmacyNcpdp,
      pharmacyName: (pharmacy && pharmacy.name) || 'PHARMACY NOT FOUND',
      planPays: offer.price.planCoveragePays,
      price: offer.price.memberPaysTotal,
      shippingPrice: offer.price.memberPaysShipping || 0,
      slug: 'N/A',
    };
    return offerRowProps;
  });
};

export const buildPharmacyDetails = (
  state: RootState
): IPharmacyDetailsProps => {
  const offer = state.prescription.selectedOffer;
  const selectedPrescription = state.prescription.selectedPrescription;
  const rx = selectedPrescription && selectedPrescription.prescription;
  const today = state.config.currentDate;
  if (offer && rx) {
    const pharmacy = rx.pharmacies.find(
      (p: IContactInfo) => p.ncpdp === offer.pharmacyNcpdp
    );
    const distance =
      (offer &&
        offer.sort &&
        offer.sort.distance &&
        `${offer.sort.distance} miles`) ||
      undefined;
    if (pharmacy) {
      const address: Partial<IAddress> = pharmacy.address ?? {};

      const details: IPharmacyDetailsProps = {
        currentDate: today,
        distance,
        driveThru: offer.hasDriveThru || false,
        memberPays: (offer && offer.price.memberPaysOffer) || 0,
        memberPaysTotal: (offer && offer.price.memberPaysTotal) || 0,
        pharmacyAddress1: address.lineOne?.trim() ?? '',
        pharmacyAddress2: address.lineTwo?.trim(),
        pharmacyCashPrice: (offer && offer.price.pharmacyCashPrice) || 0,
        pharmacyCity: address.city?.trim() ?? '',
        pharmacyHours: convertHoursToMap(pharmacy.hours),
        pharmacyName: pharmacy.name.trim(),
        pharmacyState: address.state?.trim() ?? '',
        pharmacyZipCode: address.zip?.trim() ?? '',
        phoneNumber: formatPhoneNumber(pharmacy.phone),
        planPays: (offer && offer.price.planCoveragePays) || 0,
      };
      return details;
    }
  }
  return {
    currentDate: today,
    distance: undefined,
    driveThru: false,
    memberPays: 0,
    memberPaysTotal: 0,
    pharmacyAddress1: 'unknown',
    pharmacyAddress2: 'unknown',
    pharmacyCashPrice: 0,
    pharmacyCity: 'unknown',
    pharmacyHours: new Map<string, string>(),
    pharmacyName: 'unknown',
    pharmacyState: 'unknown',
    pharmacyZipCode: 'unknown',
    phoneNumber: 'unknown',
    planPays: 0,
  };
};
