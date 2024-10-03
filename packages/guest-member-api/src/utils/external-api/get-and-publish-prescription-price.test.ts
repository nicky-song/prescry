// Copyright 2021 Prescryptive Health, Inc.

import { IDrugPrice } from '@phx/common/src/models/drug-price';
import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { IConfiguration } from '../../configuration';
import { ApiConstants } from '../../constants/api-constants';
import { publishPrescriptionPriceEvent } from '../../controllers/prescription/helpers/publish-prescription-price-event';
import { IDrugPriceNcpdp } from '../../models/drug-price-ncpdp';
import { IPrescriptionPrice } from '../../models/prescription-price-event';
import { getAndPublishPrescriptionPrice } from './get-and-publish-prescription-price';
import { getPricesForNdcAndPharmacies } from './get-prices-for-pharmacies-and-ndc';
import { couponMock } from '../../mock-data/coupon.mock';
import { mapCouponToCouponDetails } from '../../controllers/prescription/helpers/map-coupon-to-coupon-details';

jest
  .spyOn(Date.prototype, 'toISOString')
  .mockReturnValue('2000-01-01T00:00:00.000Z');

jest.mock('@phx/common/src/utils/date-time-helper');
const UTCDateMock = UTCDate as jest.Mock;

jest.mock('./get-prices-for-pharmacies-and-ndc');
const getPricesForNdcAndPharmaciesMock =
  getPricesForNdcAndPharmacies as jest.Mock;

jest.mock(
  '../../controllers/prescription/helpers/publish-prescription-price-event'
);
const publishPrescriptionPriceEventMock =
  publishPrescriptionPriceEvent as jest.Mock;

const configurationMock = {} as IConfiguration;

const isRTPBMock = true;
const prescriberNpiMock = 'prescriber-npi-mock';
const useTestThirdPartyPricingMock = false;

describe('getAndPublishPrescriptionPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('correctly returns and publishes price event when pharmacy price exists - without coupon', async () => {
    const expectedPrescriptionPrice = {
      prescriptionId: '123',
      daysSupply: 30,
      fillDate: '2000-01-01T00:00:00.000Z',
      ndc: '12345',
      pharmacyId: 'pharmacy-id',
      planPays: 2000,
      memberPays: 1000,
      pharmacyTotalPrice: 3000,
      memberId: 'member-id',
      quantity: 60,
      type: 'prescription',
      coupon: undefined,
    } as IPrescriptionPrice;
    getPricesForNdcAndPharmaciesMock.mockResolvedValueOnce([
      {
        ncpdp: 'pharmacy-id',
        price: {
          memberPays: 1000,
          planPays: 2000,
          pharmacyTotalPrice: 3000,
        } as IDrugPrice,
      } as IDrugPriceNcpdp,
    ]);
    UTCDateMock.mockReturnValue(946684800);

    const prescriptionPriceEvent = await getAndPublishPrescriptionPrice(
      '12345',
      60,
      30,
      'pharmacy-id',
      configurationMock,
      'member-id',
      'HSA01',
      '1',
      '123',
      '456',
      'prescription',
      undefined,
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );

    expect(getPricesForNdcAndPharmaciesMock).toBeCalledWith(
      '12345',
      60,
      30,
      ['pharmacy-id'],
      configurationMock,
      'member-id',
      'HSA01',
      '1',
      '456',
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(publishPrescriptionPriceEventMock).toBeCalledWith(
      'member-id',
      expectedPrescriptionPrice
    );
    expect(prescriptionPriceEvent).toEqual({
      identifiers: [{ type: 'primaryMemberRxId', value: 'member-id' }],
      createdOn: 946684800,
      createdBy: ApiConstants.EVENT_APPLICATION_NAME,
      tags: ['member-id'],
      eventType: ApiConstants.PRESCRIPTION_PRICE_EVENT_TYPE,
      eventData: expectedPrescriptionPrice,
    });
    expect(UTCDateMock).toBeCalledWith(expect.any(Date));
  });

  it('correctly returns and publishes price event when pharmacy price and coupon exist', async () => {
    const expectedPrescriptionPrice = {
      prescriptionId: '123',
      daysSupply: 30,
      fillDate: '2000-01-01T00:00:00.000Z',
      ndc: '12345',
      pharmacyId: 'pharmacy-id',
      planPays: 2000,
      memberPays: 1000,
      pharmacyTotalPrice: 3000,
      memberId: 'member-id',
      quantity: 60,
      type: 'prescription',
      coupon: mapCouponToCouponDetails(couponMock),
    } as IPrescriptionPrice;

    getPricesForNdcAndPharmaciesMock.mockResolvedValueOnce([
      {
        ncpdp: 'pharmacy-id',
        price: {
          memberPays: 1000,
          planPays: 2000,
          pharmacyTotalPrice: 3000,
        } as IDrugPrice,
      } as IDrugPriceNcpdp,
    ]);
    UTCDateMock.mockReturnValue(946684800);

    const prescriptionPriceEvent = await getAndPublishPrescriptionPrice(
      '12345',
      60,
      30,
      'pharmacy-id',
      configurationMock,
      'member-id',
      'HSA01',
      '1',
      '123',
      '456',
      'prescription',
      couponMock,
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );

    expect(getPricesForNdcAndPharmaciesMock).toBeCalledWith(
      '12345',
      60,
      30,
      ['pharmacy-id'],
      configurationMock,
      'member-id',
      'HSA01',
      '1',
      '456',
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(publishPrescriptionPriceEventMock).toBeCalledWith(
      'member-id',
      expectedPrescriptionPrice
    );
    expect(prescriptionPriceEvent).toEqual({
      identifiers: [{ type: 'primaryMemberRxId', value: 'member-id' }],
      createdOn: 946684800,
      createdBy: ApiConstants.EVENT_APPLICATION_NAME,
      tags: ['member-id'],
      eventType: ApiConstants.PRESCRIPTION_PRICE_EVENT_TYPE,
      eventData: expectedPrescriptionPrice,
    });
    expect(UTCDateMock).toBeCalledWith(expect.any(Date));
  });

  it('correctly returns and publishes price event when pharmacy price do not exists - with coupon', async () => {
    const expectedPrescriptionPrice = {
      prescriptionId: '123',
      daysSupply: 30,
      fillDate: '2000-01-01T00:00:00.000Z',
      ndc: '12345',
      pharmacyId: 'pharmacy-id',
      planPays: undefined,
      memberPays: undefined,
      pharmacyTotalPrice: undefined,
      memberId: 'member-id',
      quantity: 60,
      type: 'prescription',
      coupon: mapCouponToCouponDetails(couponMock),
    } as IPrescriptionPrice;
    getPricesForNdcAndPharmaciesMock.mockResolvedValueOnce([]);
    UTCDateMock.mockReturnValue(946684800);

    const prescriptionPriceEvent = await getAndPublishPrescriptionPrice(
      '12345',
      60,
      30,
      'pharmacy-id',
      configurationMock,
      'member-id',
      'HSA01',
      '1',
      '123',
      '456',
      'prescription',
      couponMock,
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );

    expect(publishPrescriptionPriceEventMock).toBeCalledWith(
      'member-id',
      expectedPrescriptionPrice
    );
    expect(prescriptionPriceEvent).toEqual({
      identifiers: [{ type: 'primaryMemberRxId', value: 'member-id' }],
      createdOn: 946684800,
      createdBy: ApiConstants.EVENT_APPLICATION_NAME,
      tags: ['member-id'],
      eventType: ApiConstants.PRESCRIPTION_PRICE_EVENT_TYPE,
      eventData: expectedPrescriptionPrice,
    });
    expect(UTCDateMock).toBeCalledWith(expect.any(Date));
  });

  it('correctly returns undefined when pharmacy price and coupon does not exist', async () => {
    getPricesForNdcAndPharmaciesMock.mockResolvedValueOnce([]);
    const prescriptionPriceEvent = await getAndPublishPrescriptionPrice(
      '12345',
      60,
      30,
      'pharmacy-id',
      configurationMock,
      'member-id',
      'HSA01',
      '1',
      '123',
      '456',
      'prescription',
      undefined,
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );

    expect(getPricesForNdcAndPharmaciesMock).toBeCalledWith(
      '12345',
      60,
      30,
      ['pharmacy-id'],
      configurationMock,
      'member-id',
      'HSA01',
      '1',
      '456',
      isRTPBMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(publishPrescriptionPriceEventMock).not.toBeCalled();
    expect(prescriptionPriceEvent).toEqual(undefined);
    expect(UTCDateMock).not.toBeCalled();
  });
});
