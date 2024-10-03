// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { IImmunizationRecord } from '../../../models/api-response/immunization-record-response';
import { RootState } from '../store/root-reducer';
import { IVaccinationRecordScreenProps } from './vaccination-record-screen';
import { mapStateToProps, VaccinationRecordScreenConnected } from './vaccination-record-screen.connected';
import { connect } from 'react-redux';
import { getImmunizationRecordDataLoadingAsyncAction } from '../store/appointment/async-actions/get-immunization-record-data-loading-async-action';

jest.mock('./vaccination-record-screen', () => ({
  VaccinationRecordScreen: () => <div />,
}));

jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});
const connectMock = connect as unknown as jest.Mock;

const immunizationRecord: IImmunizationRecord[] = [
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
    memberFirstName: 'first-name',
    memberLastName: 'last-name',
    memberDateOfBirth: '01/01/2000',
  },
];

describe('VaccinationRecordScreenConnected', () => {
  it('ConnectedSupportErrorScreen should be defined', () => {
    expect(VaccinationRecordScreenConnected).toBeDefined();
  });

  it('connect should get called once', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('connect method should be called with annonymous function as argument', () => {
    const annonymousFunction = connectMock.mock.calls[0][0];
    expect(annonymousFunction).toBeInstanceOf(Function);
    expect(connectMock.mock.calls[0][1].getImmunizationRecord).toBeDefined();
    expect(connectMock.mock.calls[0][1].getImmunizationRecord).toBeInstanceOf(
      Function
    );
    expect(connectMock.mock.calls[0][1].getImmunizationRecord).toBe(
      getImmunizationRecordDataLoadingAsyncAction
    );
  });

  it('maps state', () => {
    const initialState: RootState = {
      memberListInfo: {
        loggedInMember: {
          dateOfBirth: '2000-01-01',
          firstName: 'fake firstName',

          lastName: 'fake lastName',
        },
      },
      immunizationRecord: { immunizationRecord },
    } as RootState;

    const mappedProps: IVaccinationRecordScreenProps =
      mapStateToProps(initialState);

    const expectedProps: IVaccinationRecordScreenProps = {
      recipientName: 'first-name last-name',

      dateOfBirth: '01/01/2000',
      immunizationRecords: immunizationRecord,
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
