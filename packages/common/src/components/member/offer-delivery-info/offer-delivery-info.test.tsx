// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { View } from 'react-native';
import { offerDeliveryInfoStyles } from './offer-delivery-info.style';
import { OfferDeliveryInfo } from './offer-delivery-info';
import { Heading } from '../heading/heading';
import { BaseText } from '../../text/base-text/base-text';
import { PrescriptionPharmacyInfo } from '../prescription-pharmacy-info/prescription-pharmacy-info';
import { IOrderConfirmationScreenContent } from '../../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';

jest.mock('../prescription-pharmacy-info/prescription-pharmacy-info', () => ({
  PrescriptionPharmacyInfo: () => <div />,
}));

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const ncpdpMock = 'ncpdp-mock';

const offerDeliveryInfoTitleMock = 'offer-delivery-info-title-mock';
const offerDeliveryInfoDescriptionPrefix = 'offer-delivery-info-mock';
const uiContentMock: Partial<IOrderConfirmationScreenContent> = {
  offerDeliveryInfoTitle: offerDeliveryInfoTitleMock,
  offerDeliveryInfoDescription:
    offerDeliveryInfoDescriptionPrefix + '{pharmacyName}',
};

describe('OfferDeliveryInfo', () => {
  beforeEach(() => {
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('renders expected properties when drug information is not defined', () => {
    const viewStyleMock = { flex: 1 };

    const pharmacyNameMock = 'PREMIER PHARMACY';

    const testRenderer = renderer.create(
      <OfferDeliveryInfo
        pharmacyName={pharmacyNameMock}
        pharmacyNcpdp={ncpdpMock}
        phoneNumber='8005404700'
        viewStyle={viewStyleMock}
      />
    );
    const container = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    expect(container.props.style).toEqual(viewStyleMock);

    const heading = container.props.children[0];
    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(
      offerDeliveryInfoStyles.titleTextStyle
    );
    expect(heading.props.level).toEqual(2);
    expect(heading.props.children).toEqual(
      uiContentMock.offerDeliveryInfoTitle
    );

    const description = container.props.children[1];
    expect(description.type).toEqual(BaseText);
    expect(description.props.children).toEqual(
      offerDeliveryInfoDescriptionPrefix + pharmacyNameMock
    );

    const prescriptionPharmacyInfo = container.props.children[2];
    expect(prescriptionPharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);
    expect(prescriptionPharmacyInfo.props.phoneNumber).toEqual('8005404700');
    expect(prescriptionPharmacyInfo.props.title).toEqual('PREMIER PHARMACY');
    expect(prescriptionPharmacyInfo.props.viewStyle).toEqual(
      offerDeliveryInfoStyles.pharmacyInfoViewStyle
    );
  });

  it('not render phone container if no phone preset', () => {
    const viewStyleMock = { flex: 1 };

    const testRenderer = renderer.create(
      <OfferDeliveryInfo
        pharmacyName='PREMIER PHARMACY'
        pharmacyNcpdp={ncpdpMock}
        viewStyle={viewStyleMock}
      />
    );
    const container = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    const prescriptionPharmacyInfo = container.props.children[2];
    expect(prescriptionPharmacyInfo.props.phoneNumber).toBeUndefined();
  });

  it('renders skeletons when isSkeleton is true', () => {
    const viewStyleMock = { flex: 1 };

    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: true,
    });

    const testRenderer = renderer.create(
      <OfferDeliveryInfo
        pharmacyName='PREMIER PHARMACY'
        pharmacyNcpdp={ncpdpMock}
        phoneNumber='8005404700'
        viewStyle={viewStyleMock}
        isSkeleton={true}
      />
    );
    const container = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    const heading = container.props.children[0];
    expect(heading.type).toEqual(Heading);
    expect(heading.props.isSkeleton).toEqual(true);
    expect(heading.props.skeletonWidth).toEqual('long');

    const description = container.props.children[1];
    expect(description.type).toEqual(BaseText);
    expect(description.props.isSkeleton).toEqual(true);
    expect(description.props.skeletonWidth).toEqual('medium');

    const prescriptionPharmacyInfo = container.props.children[2];
    expect(prescriptionPharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);
    expect(prescriptionPharmacyInfo.props.isSkeleton).toEqual(true);
  });
});
