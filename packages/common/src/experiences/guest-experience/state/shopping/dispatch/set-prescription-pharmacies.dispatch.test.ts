// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import { setPrescriptionPharmaciesDispatch } from './set-prescription-pharmacies.dispatch';
import { prescriptionPharmaciesSetAction } from '../actions/prescription-pharmacies-set.action';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { IPharmacyDrugPriceResponse } from '../../../../../models/api-response/pharmacy-price-search.response';
import { setHasInsuranceDispatch } from './set-has-insurance.dispatch';

jest.mock('./set-has-insurance.dispatch');
const setHasInsuranceDispatchMock = setHasInsuranceDispatch as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;
const prescriptionIdMock = '123';

describe('setPrescriptionPharmaciesDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const pharmaciesMock: IPharmacyDrugPrice[] = [
    pharmacyDrugPrice1Mock,
    pharmacyDrugPrice2Mock,
  ];
  const pharmaciesResponseMock: IPharmacyDrugPriceResponse = {
    pharmacyPrices: pharmaciesMock,
  };
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setPrescriptionPharmaciesDispatch(
      dispatchMock,
      pharmaciesResponseMock,
      prescriptionIdMock
    );

    const expectedAction = prescriptionPharmaciesSetAction(pharmaciesMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.PRESCRIPTION_USER_GET_PHARMACIES,
      {
        pharmacies: [
          { names: 'name-1', ncpdp: 'ncpdp-1' },
          { names: 'name-2', ncpdp: 'ncpdp-2' },
        ],
        prescriptionId: prescriptionIdMock,
      }
    );
    expect(setHasInsuranceDispatchMock).toHaveBeenCalledTimes(1);
    expect(setHasInsuranceDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      true
    );
  });

  it('dispatches expected action for when error exists', () => {
    const dispatchMock = jest.fn();
    const errorMock = 'error';
    setPrescriptionPharmaciesDispatch(
      dispatchMock,
      pharmaciesResponseMock,
      prescriptionIdMock,
      errorMock
    );

    const expectedAction = prescriptionPharmaciesSetAction(
      pharmaciesMock,
      undefined,
      errorMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.PRESCRIPTION_USER_GET_PHARMACIES_ERROR,
      {
        error: errorMock,
        prescriptionId: prescriptionIdMock,
      }
    );
  });
});
