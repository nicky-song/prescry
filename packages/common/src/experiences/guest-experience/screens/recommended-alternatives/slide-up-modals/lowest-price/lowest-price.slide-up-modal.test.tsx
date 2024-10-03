// Copyright 2022 Prescryptive Health, Inc.

import React, { Fragment } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ClaimPharmacyInfo } from '../../../../../../components/member/claim-pharmacy-info/claim-pharmacy-info';
import { SlideUpModal } from '../../../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { getChildren } from '../../../../../../testing/test.helper';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { LowestPriceSlideUpModal } from './lowest-price.slide-up-modal';
import { ILowestPriceSlideUpModalContent } from './lowest-price.slide-up-modal.content';
import { lowestPriceSlideUpModalStyles } from './lowest-price.slide-up-modal.styles';

jest.mock(
  '../../../../../../components/member/claim-pharmacy-info/claim-pharmacy-info',
  () => ({
    ClaimPharmacyInfo: () => <div />,
  })
);

jest.mock('../../../../../../components/modal/slide-up/slide-up.modal', () => ({
  SlideUpModal: () => <div />,
}));

jest.mock('../../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const onClosePressMock = jest.fn();
const isVisibleMock = true;
const viewStyleMock = {};

const contentMock: ILowestPriceSlideUpModalContent = {
  heading: 'heading-mock',
  description: 'description-mock',
};
const isContentLoadingMock = false;

const titleMock = 'title-mock';
const phoneNumberMock = 'phone-number-mock';
const pharmacyAddress1Mock = 'pharmacy-address-1-mock';
const pharmacyCityMock = 'pharmacy-city-mock';
const pharmacyStateMock = 'pharmacy-state-mock';
const pharmacyZipCodeMock = 'pharmacy-zip-code-mock';

describe('LowestPriceSlideUpModal', () => {
  beforeEach(() => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('calls useContent with expected args', () => {
    renderer.create(
      <LowestPriceSlideUpModal
        onClosePress={onClosePressMock}
        isVisible={isVisibleMock}
      />
    );

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.lowestPriceSlideUpModal,
      2
    );
  });

  it('renders as SlideUpModal with expected props', () => {
    const testRenderer = renderer.create(
      <LowestPriceSlideUpModal
        onClosePress={onClosePressMock}
        isVisible={isVisibleMock}
        viewStyle={viewStyleMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    expect(slideUpModal.type).toEqual(SlideUpModal);
    expect(slideUpModal.props.isVisible).toEqual(isVisibleMock);
    expect(slideUpModal.props.onClosePress).toEqual(onClosePressMock);
    expect(slideUpModal.props.children).toBeDefined();
    expect(slideUpModal.props.heading).toEqual(contentMock.heading);
    expect(slideUpModal.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(slideUpModal.props.viewStyle).toEqual(viewStyleMock);
    expect(slideUpModal.props.testID).toEqual('lowestPriceSlideUpModal');
  });

  it('renders children in SlideUpModal as expected', () => {
    const testRenderer = renderer.create(
      <LowestPriceSlideUpModal
        onClosePress={onClosePressMock}
        isVisible={isVisibleMock}
        viewStyle={viewStyleMock}
        title={titleMock}
        phoneNumber={phoneNumberMock}
        pharmacyAddress1={pharmacyAddress1Mock}
        pharmacyCity={pharmacyCityMock}
        pharmacyState={pharmacyStateMock}
        pharmacyZipCode={pharmacyZipCodeMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    const slideUpModalChildren = slideUpModal.props.children;

    expect(slideUpModalChildren.type).toEqual(Fragment);
    expect(getChildren(slideUpModalChildren).length).toEqual(2);

    const descriptionText = getChildren(slideUpModalChildren)[0];

    expect(descriptionText.type).toEqual(BaseText);
    expect(descriptionText.props.style).toEqual(
      lowestPriceSlideUpModalStyles.descriptionTextStyle
    );
    expect(descriptionText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(descriptionText.props.skeletonWidth).toEqual('long');
    expect(descriptionText.props.children).toEqual(contentMock.description);

    const prescriptionPharmacyInfo = getChildren(slideUpModalChildren)[1];

    expect(prescriptionPharmacyInfo.type).toEqual(ClaimPharmacyInfo);
    expect(prescriptionPharmacyInfo.props.title).toEqual(titleMock);
    expect(prescriptionPharmacyInfo.props.phoneNumber).toEqual(phoneNumberMock);
    expect(prescriptionPharmacyInfo.props.pharmacyAddress1).toEqual(
      pharmacyAddress1Mock
    );
    expect(prescriptionPharmacyInfo.props.pharmacyCity).toEqual(
      pharmacyCityMock
    );
    expect(prescriptionPharmacyInfo.props.pharmacyState).toEqual(
      pharmacyStateMock
    );
    expect(prescriptionPharmacyInfo.props.pharmacyZipCode).toEqual(
      pharmacyZipCodeMock
    );
  });
});
