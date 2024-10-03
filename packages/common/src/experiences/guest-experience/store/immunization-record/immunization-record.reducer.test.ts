// Copyright 2021 Prescryptive Health, Inc.

import { IImmunizationRecord } from '../../../../models/api-response/immunization-record-response';
import { getImmunizationRecordResponseAction } from './actions/get-immunization-record-response.action';
import {
  IImmunizationRecordState,
  immunizationRecordReducer,
} from './immunization-record.reducer';

describe('immunizationRecordReducer', () => {
  it('updates state for get immunization record response', () => {
    const result: IImmunizationRecord[] = [
      {
        orderNumber: '1234',
        manufacturer: 'Moderna',
        lotNumber: '1234',
        doseNumber: 1,
        locationName: 'Lonehollow Pharmacy',
        address1: '1010 Cooley Lane',
        city: 'Vanderpool',
        state: 'TX',
        zip: '78885',
        time: 'appointment-time',
        date: 'appointment-date',
        memberId: 'member_1',
        vaccineCode: 'vaccine-1',
        serviceDescription: 'test',
      },
    ];

    const action = getImmunizationRecordResponseAction(result);
    const expectedState: IImmunizationRecordState = {
      immunizationRecord: result,
    };

    const initialState: IImmunizationRecordState = {};
    const updatedState = immunizationRecordReducer(initialState, action);
    expect(updatedState).toEqual(expectedState);
  });
});
