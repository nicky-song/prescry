// Copyright 2021 Prescryptive Health, Inc.

import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { IConfiguration } from '../../configuration';
import { ApiConstants } from '../../constants/api-constants';
import { publishPrescriptionPriceEvent } from '../../controllers/prescription/helpers/publish-prescription-price-event';
import { IDrugPriceNcpdp } from '../../models/drug-price-ncpdp';
import {
  IPrescriptionPrice,
  IPrescriptionPriceEvent,
} from '../../models/prescription-price-event';
import { getPricesForNdcAndPharmacies } from './get-prices-for-pharmacies-and-ndc';
import { mapCouponToCouponDetails } from '../../controllers/prescription/helpers/map-coupon-to-coupon-details';
import { ICoupon } from '../../models/coupon';

export type PrescriptionType = 'prescription' | 'transferRequest';

export const getAndPublishPrescriptionPrice = async (
  ndc: string,
  quantity: number,
  daysSupply: number,
  pharmacyId: string,
  configuration: IConfiguration,
  memberId: string,
  groupPlanCode: string,
  refillNumber: string,
  bundleId: string,
  rxNumber: string,
  type: PrescriptionType,
  coupon: ICoupon | undefined,
  isRTPB?: boolean,
  prescriberNpi?: string,
  isSmartPriceEligible?: boolean,
  useTestThirdPartyPricing?: boolean
): Promise<IPrescriptionPriceEvent | undefined> => {
  const pharmacyPrices = await getPricesForNdcAndPharmacies(
    ndc,
    quantity,
    daysSupply,
    [pharmacyId],
    configuration,
    memberId,
    groupPlanCode,
    refillNumber,
    rxNumber,
    isRTPB,
    prescriberNpi,
    isSmartPriceEligible,
    useTestThirdPartyPricing
  );

  const pharmacyPrice = pharmacyPrices.find(
    (pharmPrice: IDrugPriceNcpdp) => pharmPrice.ncpdp === pharmacyId
  );
  if (pharmacyPrice || coupon) {
    const prescriptionPrice: IPrescriptionPrice = {
      prescriptionId: bundleId,
      daysSupply,
      fillDate: new Date().toISOString(),
      ndc,
      pharmacyId,
      planPays: pharmacyPrice ? pharmacyPrice.price.planPays : undefined,
      memberPays: pharmacyPrice ? pharmacyPrice.price.memberPays : undefined,
      pharmacyTotalPrice: pharmacyPrice
        ? pharmacyPrice.price.pharmacyTotalPrice
        : undefined,
      memberId,
      quantity,
      type,
      coupon: coupon ? mapCouponToCouponDetails(coupon as ICoupon) : undefined,
    };
    await publishPrescriptionPriceEvent(memberId, prescriptionPrice);

    const date = new Date();
    const currentTime = UTCDate(date);
    const prescriptionPriceHealthEventRecord: IPrescriptionPriceEvent = {
      identifiers: [
        {
          type: 'primaryMemberRxId',
          value: memberId,
        },
      ],
      createdOn: currentTime,
      createdBy: ApiConstants.EVENT_APPLICATION_NAME,
      tags: [memberId],
      eventType: ApiConstants.PRESCRIPTION_PRICE_EVENT_TYPE,
      eventData: prescriptionPrice,
    };
    return prescriptionPriceHealthEventRecord;
  }
  return undefined;
};
