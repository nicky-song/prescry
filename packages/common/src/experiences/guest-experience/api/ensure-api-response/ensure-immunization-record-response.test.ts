// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureImmunizationRecordResponse } from './ensure-immunization-record-response';

describe('ensureImmunizationRecordResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponse = {};
    expect(() => ensureImmunizationRecordResponse(mockResponse)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should throw error if response data is valid but empty array', () => {
    const mockResponse = { data: { immunizationResult: [] } };
    expect(() => ensureImmunizationRecordResponse(mockResponse)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid and has results', () => {
    const mockResponse = {
      data: {
        immunizationResult: [
          {
            orderNumber: '345365',
            lotNumber: '11111',
            manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
            doseNumber: 1,
            memberId: 'CA7XKE04',
            vaccineCode: '91300',
            date: 'February 25, 2021',
            time: '9:30 AM',
            serviceDescription: 'COVID-19 Vaccination',
            locationName: 'Rx Pharmacy',
            address1: '7807 219th ST SW',
            city: 'Yakima',
            state: 'WA',
            zip: '98901',
            memberFirstName: 'first-name',
            memberLastName: 'last-name',
            memberDateOfBirth: '01/01/2000',
          },
        ],
      },
    };
    const result = ensureImmunizationRecordResponse(mockResponse);
    expect(result).toEqual(mockResponse);
  });
});
