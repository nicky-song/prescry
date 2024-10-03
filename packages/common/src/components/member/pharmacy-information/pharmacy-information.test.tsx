// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { PharmacyHoursContainer } from '../pharmacy-hours-container/pharmacy-hours-container';
import { PrescriptionPharmacyInfo } from '../prescription-pharmacy-info/prescription-pharmacy-info';
import { PharmacyInformation } from './pharmacy-information';
import { pharmacyInformationStyle } from './pharmacy-information.style';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../pharmacy-hours-container/pharmacy-hours-container', () => ({
  PharmacyHoursContainer: () => <div />,
}));

jest.mock('../prescription-pharmacy-info/prescription-pharmacy-info', () => ({
  PrescriptionPharmacyInfo: () => <div />,
}));

const setShowFullHours = jest.fn();

const mockDialPhoneNumber = jest.fn();

const pharmacyHours = new Map<string, string>([
  ['Sunday', '12:00 am to 12:00 am'],
  ['Monday', '12:00 am to 12:00 am'],
  ['Tuesday', '12:00 am to 12:00 am'],
  ['Wednesday', '12:00 am to 12:00 am'],
  ['Thursday', '12:00 am to 12:00 am'],
  ['Friday', '12:00 am to 12:00 am'],
  ['Saturday', '12:00 am to 12:00 am'],
]);

const pharmacyDetailsProps = {
  currentDate: new Date(2019, 9, 8),
  dialPhoneNumber: mockDialPhoneNumber,
  distance: '3 miles',
  driveThru: true,
  pharmacyAddress1: '144 128th Ave NE',
  pharmacyAddress2: 'Suite 300',
  pharmacyCity: 'Kirkland',
  pharmacyHours,
  pharmacyName: 'Medico shop',
  pharmacyState: 'WA',
  pharmacyZipCode: '98034',
  phoneNumber: '4258815894',
  pharmacyWebsite: { label: 'label', url: 'www.prescryptive.com' },
};

describe('PharmacyInformation', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValue([false, setShowFullHours]);
  });

  it('should have PharmacyInfoContainer with props', () => {
    const pharmacyInformation = renderer.create(
      <PharmacyInformation {...pharmacyDetailsProps} />
    );

    const pharmacyHoursList = pharmacyInformation.root.findByType(View);
    const pharmacyInfoView = pharmacyHoursList.props.children[0];
    const prescriptionPharmacyInfo = getChildren(pharmacyInfoView)[0];

    expect(pharmacyHoursList.props.style).toBe(
      pharmacyInformationStyle.containerView
    );
    expect(prescriptionPharmacyInfo.type).toBe(PrescriptionPharmacyInfo);
    expect(prescriptionPharmacyInfo.props).toMatchObject({
      title: pharmacyDetailsProps.pharmacyName,
      phoneNumber: pharmacyDetailsProps.phoneNumber,
      pharmacyAddress1: pharmacyDetailsProps.pharmacyAddress1,
      pharmacyCity: pharmacyDetailsProps.pharmacyCity,
      pharmacyState: pharmacyDetailsProps.pharmacyState,
      pharmacyZipCode: pharmacyDetailsProps.pharmacyZipCode,
      pharmacyWebsite: pharmacyDetailsProps.pharmacyWebsite,
    });

    const pharmacyHoursContainer = pharmacyHoursList.props.children[1];
    expect(pharmacyHoursContainer.type).toBe(PharmacyHoursContainer);
    expect(pharmacyHoursContainer.props.pharmacyHours).toBe(
      pharmacyDetailsProps.pharmacyHours
    );
  });
});
