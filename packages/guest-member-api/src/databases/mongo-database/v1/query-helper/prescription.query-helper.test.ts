// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../../constants/api-constants';
import { IDatabase } from '../setup/setup-database';
import { getPrescriptionPriceById } from './prescription.query-helper';

const sortMock = jest.fn();
const findOneMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});
const databaseMock = {
  Models: {
    PrescriptionPriceEventModel: {
      findOne: findOneMock,
    },
  },
} as unknown as IDatabase;
describe('getPrescriptionPriceById', () => {
  it('should call findOne() with required prescription paramas', () => {
    const prescriptionIdMock = '12345';
    getPrescriptionPriceById(prescriptionIdMock, databaseMock);
    expect(findOneMock).toHaveBeenNthCalledWith(1, {
      $and: [
        { 'eventData.prescriptionId': prescriptionIdMock },
        { eventType: ApiConstants.PRESCRIPTION_PRICE_EVENT_TYPE },
      ],
    });
  });
});
