// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { KeepCurrentPrescriptionSection } from './keep-current-prescription.section';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { BaseButton } from '../../buttons/base/base.button';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../heading/heading';
import { PharmacyHoursContainer } from '../pharmacy-hours-container/pharmacy-hours-container';
import { PrescriptionPharmacyInfo } from '../prescription-pharmacy-info/prescription-pharmacy-info';
import { View, ViewStyle } from 'react-native';
import { getChildren } from '../../../testing/test.helper';
import { keepCurrentPrescriptionSectionStyles } from './keep-current-prescription.section.styles';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../pharmacy-hours-container/pharmacy-hours-container', () => ({
  PharmacyHoursContainer: () => <div />,
}));

jest.mock('../prescription-pharmacy-info/prescription-pharmacy-info', () => ({
  PrescriptionPharmacyInfo: () => <div />,
}));

describe('KeepCurrentPrescriptionSection', () => {
  const pharmacyNameMock = 'pharmacy-name-mock';
  const pharmacyNcpdpMock = 'pharmacy-ncpdp-mock';
  const pharmacyAddress1Mock = 'pharmacy-address-1-mock';
  const pharmacyCityMock = 'pharmacy-city-mock';
  const pharmacyZipCodeMock = 'pharmacy-zip-code-mock';
  const pharmacyStateMock = 'pharmacy-state-mock';
  const pharmacyPhoneNumberMock = 'pharmacy-phone-number-mock';
  const pharmacyHoursMock = new Map();
  const onKeepCurrentPrescriptionPressMock = jest.fn();
  const viewStyleMock: ViewStyle = {};

  const contentMock = {
    heading: 'heading-mock',
    description: 'description-mock',
    buttonLabel: 'button-label-mock',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });

  it('renders as View with expected ViewStyle and # of children', () => {
    const testRenderer = renderer.create(
      <KeepCurrentPrescriptionSection
        pharmacyName={pharmacyNameMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
        pharmacyAddress1={pharmacyAddress1Mock}
        pharmacyCity={pharmacyCityMock}
        pharmacyZipCode={pharmacyZipCodeMock}
        pharmacyState={pharmacyStateMock}
        pharmacyPhoneNumber={pharmacyPhoneNumberMock}
        pharmacyHours={pharmacyHoursMock}
        onKeepCurrentPrescriptionPress={onKeepCurrentPrescriptionPressMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(viewStyleMock);
    expect(getChildren(view).length).toEqual(5);
  });

  it('renders Heading as 1st child in View', () => {
    const testRenderer = renderer.create(
      <KeepCurrentPrescriptionSection
        pharmacyName={pharmacyNameMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
        pharmacyAddress1={pharmacyAddress1Mock}
        pharmacyCity={pharmacyCityMock}
        pharmacyZipCode={pharmacyZipCodeMock}
        pharmacyState={pharmacyStateMock}
        pharmacyPhoneNumber={pharmacyPhoneNumberMock}
        pharmacyHours={pharmacyHoursMock}
        onKeepCurrentPrescriptionPress={onKeepCurrentPrescriptionPressMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const heading = getChildren(view)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.textStyle).toEqual(
      keepCurrentPrescriptionSectionStyles.headingTextStyle
    );
    expect(heading.props.isSkeleton).toEqual(false);
    expect(heading.props.children).toEqual(contentMock.heading);
  });

  it('renders BaseText (description) as 2nd child in View', () => {
    const testRenderer = renderer.create(
      <KeepCurrentPrescriptionSection
        pharmacyName={pharmacyNameMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
        pharmacyAddress1={pharmacyAddress1Mock}
        pharmacyCity={pharmacyCityMock}
        pharmacyZipCode={pharmacyZipCodeMock}
        pharmacyState={pharmacyStateMock}
        pharmacyPhoneNumber={pharmacyPhoneNumberMock}
        pharmacyHours={pharmacyHoursMock}
        onKeepCurrentPrescriptionPress={onKeepCurrentPrescriptionPressMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const description = getChildren(view)[1];

    expect(description.type).toEqual(BaseText);
    expect(description.props.style).toEqual(
      keepCurrentPrescriptionSectionStyles.descriptionTextStyle
    );
    expect(description.props.isSkeleton).toEqual(false);
    expect(description.props.skeletonWidth).toEqual('long');
    expect(description.props.children).toEqual(contentMock.description);
  });

  it('renders PrescriptionPharmacyInfo as 3rd child in View', () => {
    const testRenderer = renderer.create(
      <KeepCurrentPrescriptionSection
        pharmacyName={pharmacyNameMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
        pharmacyAddress1={pharmacyAddress1Mock}
        pharmacyCity={pharmacyCityMock}
        pharmacyZipCode={pharmacyZipCodeMock}
        pharmacyState={pharmacyStateMock}
        pharmacyPhoneNumber={pharmacyPhoneNumberMock}
        pharmacyHours={pharmacyHoursMock}
        onKeepCurrentPrescriptionPress={onKeepCurrentPrescriptionPressMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const prescriptionPharmacyInfo = getChildren(view)[2];

    expect(prescriptionPharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);

    expect(prescriptionPharmacyInfo.props.phoneNumber).toEqual(
      pharmacyPhoneNumberMock
    );
    expect(prescriptionPharmacyInfo.props.pharmacyAddress1).toEqual(
      pharmacyAddress1Mock
    );
    expect(prescriptionPharmacyInfo.props.pharmacyCity).toEqual(
      pharmacyCityMock
    );
    expect(prescriptionPharmacyInfo.props.pharmacyZipCode).toEqual(
      pharmacyZipCodeMock
    );
    expect(prescriptionPharmacyInfo.props.pharmacyState).toEqual(
      pharmacyStateMock
    );
    expect(prescriptionPharmacyInfo.props.title).toEqual(pharmacyNameMock);
    expect(prescriptionPharmacyInfo.props.ncpdp).toEqual(pharmacyNcpdpMock);
  });

  it('renders PharmacyHoursContainer as 4th child in View', () => {
    const testRenderer = renderer.create(
      <KeepCurrentPrescriptionSection
        pharmacyName={pharmacyNameMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
        pharmacyAddress1={pharmacyAddress1Mock}
        pharmacyCity={pharmacyCityMock}
        pharmacyZipCode={pharmacyZipCodeMock}
        pharmacyState={pharmacyStateMock}
        pharmacyPhoneNumber={pharmacyPhoneNumberMock}
        pharmacyHours={pharmacyHoursMock}
        onKeepCurrentPrescriptionPress={onKeepCurrentPrescriptionPressMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const pharmacyHoursContainer = getChildren(view)[3];

    expect(pharmacyHoursContainer.type).toEqual(PharmacyHoursContainer);
    expect(pharmacyHoursContainer.props.pharmacyHours).toEqual(
      pharmacyHoursMock
    );
    expect(pharmacyHoursContainer.props.viewStyle).toEqual(
      keepCurrentPrescriptionSectionStyles.pharmacyHoursContainerViewStyle
    );
  });

  it('renders BaseButton as 5th child in View', () => {
    const testRenderer = renderer.create(
      <KeepCurrentPrescriptionSection
        pharmacyName={pharmacyNameMock}
        pharmacyNcpdp={pharmacyNcpdpMock}
        pharmacyAddress1={pharmacyAddress1Mock}
        pharmacyCity={pharmacyCityMock}
        pharmacyZipCode={pharmacyZipCodeMock}
        pharmacyState={pharmacyStateMock}
        pharmacyPhoneNumber={pharmacyPhoneNumberMock}
        pharmacyHours={pharmacyHoursMock}
        onKeepCurrentPrescriptionPress={onKeepCurrentPrescriptionPressMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const baseButton = getChildren(view)[4];

    expect(baseButton.type).toEqual(BaseButton);
    expect(baseButton.props.onPress).toEqual(
      onKeepCurrentPrescriptionPressMock
    );
    expect(baseButton.props.viewStyle).toEqual(
      keepCurrentPrescriptionSectionStyles.keepCurrentPrescriptionButtonViewStyle
    );
    expect(baseButton.props.textStyle).toEqual(
      keepCurrentPrescriptionSectionStyles.keepCurrentPrescriptionButtonTextStyle
    );
    expect(baseButton.props.children).toEqual(contentMock.buttonLabel);
    expect(baseButton.props.testID).toBe('keepCurrentPrescriptionButton');
  });
});
