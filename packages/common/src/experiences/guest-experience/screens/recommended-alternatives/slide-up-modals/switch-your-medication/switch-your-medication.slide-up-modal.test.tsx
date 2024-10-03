// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Heading } from '../../../../../../components/member/heading/heading';
import { SlideUpModal } from '../../../../../../components/modal/slide-up/slide-up.modal';
import { getChildren } from '../../../../../../testing/test.helper';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { SwitchYourMedicationSlideUpModal } from './switch-your-medication.slide-up-modal';
import { useSwitchYourMedicationSlideUpModalCobrandingContentHelper } from './switch-your-medication.slide-up-modal.cobranding-content-helper';
import { ISwitchYourMedicationSlideUpModalContent } from './switch-your-medication.slide-up-modal.content';
import { switchYourMedicationSlideUpModalStyles } from './switch-your-medication.slide-up-modal.styles';

jest.mock('../../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../../../../../components/modal/slide-up/slide-up.modal', () => ({
  SlideUpModal: () => <div />,
}));

jest.mock('../../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('./switch-your-medication.slide-up-modal.cobranding-content-helper');
const useSwitchYourMedicationSlideUpModalCobrandingContentHelperMock =
  useSwitchYourMedicationSlideUpModalCobrandingContentHelper as jest.Mock;

const onClosePressMock = jest.fn();
const viewStyleMock = {};

const contentMock: ISwitchYourMedicationSlideUpModalContent = {
  heading: 'heading-mock',
  description: 'description-mock',
  genericsHeading: 'generics-heading-mock',
  genericsDescription: 'generics-description-mock',
  therapeuticAlternativesHeading: 'therapeutic-alternatives-heading-mock',
  therapeuticAlternativesDescription:
    'therapeutic-alternatives-description-mock',
  discretionaryAlternativesHeading: 'discretionary-alternatives-heading-mock',
  discretionaryAlternativesDescription:
    'discretionary-alternatives-description-mock',
};
const isContentLoadingMock = false;

describe('SwitchYourMedicationSlideUpModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useSwitchYourMedicationSlideUpModalCobrandingContentHelperMock.mockReturnValue(
      {
        content: contentMock,
        isContentLoading: isContentLoadingMock,
        isCobranding: false,
      }
    );
  });

  it('renders as SlideUpModal', () => {
    const testRenderer = renderer.create(
      <SwitchYourMedicationSlideUpModal
        onClosePress={onClosePressMock}
        isVisible={true}
        viewStyle={viewStyleMock}
      />
    );

    const switchYourMedicationSlideUpModal = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(switchYourMedicationSlideUpModal.type).toEqual(SlideUpModal);
    expect(switchYourMedicationSlideUpModal.props.isVisible).toEqual(true);
    expect(switchYourMedicationSlideUpModal.props.onClosePress).toEqual(
      onClosePressMock
    );
    expect(switchYourMedicationSlideUpModal.props.children).toBeDefined();
    expect(switchYourMedicationSlideUpModal.props.heading).toEqual(
      contentMock.heading
    );
    expect(switchYourMedicationSlideUpModal.props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(switchYourMedicationSlideUpModal.props.viewStyle).toEqual(
      viewStyleMock
    );
    expect(switchYourMedicationSlideUpModal.props.testID).toEqual(
      'switchYourMedicationSlideUpModal'
    );
  });

  it('renders expected SlideUpModal children (isCobranding: false)', () => {
    useSwitchYourMedicationSlideUpModalCobrandingContentHelperMock.mockReturnValue(
      {
        content: contentMock,
        isContentLoading: isContentLoadingMock,
        isCobranding: false,
      }
    );

    const testRenderer = renderer.create(
      <SwitchYourMedicationSlideUpModal
        onClosePress={onClosePressMock}
        isVisible={true}
        viewStyle={viewStyleMock}
      />
    );

    const switchYourMedicationSlideUpModal = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(switchYourMedicationSlideUpModal.props.children.type).toEqual(View);
    expect(
      getChildren(switchYourMedicationSlideUpModal.props.children).length
    ).toEqual(7);

    const modalBody = switchYourMedicationSlideUpModal.props.children;

    expect(getChildren(modalBody)[0].type).toEqual(BaseText);
    expect(getChildren(modalBody)[0].props.style).toEqual(
      switchYourMedicationSlideUpModalStyles.descriptionTextStyle
    );
    expect(getChildren(modalBody)[0].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(modalBody)[0].props.children).toEqual(
      contentMock.description
    );

    expect(getChildren(modalBody)[1].type).toEqual(Heading);
    expect(getChildren(modalBody)[1].props.textStyle).toEqual(
      switchYourMedicationSlideUpModalStyles.genericsHeadingTextStyle
    );
    expect(getChildren(modalBody)[1].props.children).toEqual(
      contentMock.genericsHeading
    );
    expect(getChildren(modalBody)[1].props.level).toEqual(3);
    expect(getChildren(modalBody)[1].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(modalBody)[1].props.skeletonWidth).toEqual('medium');

    expect(getChildren(modalBody)[2].type).toEqual(BaseText);
    expect(getChildren(modalBody)[2].props.style).toEqual(
      switchYourMedicationSlideUpModalStyles.genericsDescriptionTextStyle
    );
    expect(getChildren(modalBody)[2].props.children).toEqual(
      contentMock.genericsDescription
    );
    expect(getChildren(modalBody)[2].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(modalBody)[2].props.skeletonWidth).toEqual('long');

    expect(getChildren(modalBody)[3].type).toEqual(Heading);
    expect(getChildren(modalBody)[3].props.textStyle).toEqual(
      switchYourMedicationSlideUpModalStyles.therapeuticAlternativesHeadingTextStyle
    );
    expect(getChildren(modalBody)[3].props.children).toEqual(
      contentMock.therapeuticAlternativesHeading
    );
    expect(getChildren(modalBody)[3].props.level).toEqual(3);
    expect(getChildren(modalBody)[3].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(modalBody)[3].props.skeletonWidth).toEqual('medium');

    expect(getChildren(modalBody)[4].props.style).toEqual(
      switchYourMedicationSlideUpModalStyles.therapeuticAlternativesDescriptionTextStyle
    );
    expect(getChildren(modalBody)[4].type).toEqual(BaseText);
    expect(getChildren(modalBody)[4].props.children).toEqual(
      contentMock.therapeuticAlternativesDescription
    );
    expect(getChildren(modalBody)[4].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(modalBody)[4].props.skeletonWidth).toEqual('long');

    expect(getChildren(modalBody)[5].type).toEqual(Heading);
    expect(getChildren(modalBody)[5].props.textStyle).toEqual(
      switchYourMedicationSlideUpModalStyles.discretionaryAlternativesHeadingTextStyle
    );
    expect(getChildren(modalBody)[5].props.children).toEqual(
      contentMock.discretionaryAlternativesHeading
    );
    expect(getChildren(modalBody)[5].props.level).toEqual(3);
    expect(getChildren(modalBody)[5].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(modalBody)[5].props.skeletonWidth).toEqual('medium');

    expect(getChildren(modalBody)[6].type).toEqual(BaseText);
    expect(getChildren(modalBody)[6].props.children).toEqual(
      contentMock.discretionaryAlternativesDescription
    );
    expect(getChildren(modalBody)[6].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(getChildren(modalBody)[6].props.skeletonWidth).toEqual('long');
  });

  it('renders expected SlideUpModal children (isCobranding: true)', () => {
    useSwitchYourMedicationSlideUpModalCobrandingContentHelperMock.mockReturnValue(
      {
        content: contentMock,
        isContentLoading: isContentLoadingMock,
        isCobranding: true,
      }
    );

    const testRenderer = renderer.create(
      <SwitchYourMedicationSlideUpModal
        onClosePress={onClosePressMock}
        isVisible={true}
        viewStyle={viewStyleMock}
      />
    );

    const switchYourMedicationSlideUpModal = testRenderer.root
      .children[0] as ReactTestInstance;

    const children = switchYourMedicationSlideUpModal.props.children;

    expect(children.type).toEqual(BaseText);
    expect(children.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(children.props.style).toEqual(
      switchYourMedicationSlideUpModalStyles.descriptionTextStyle
    );
    expect(children.props.skeletonWidth).toEqual('long');
    expect(children.props.children).toEqual(contentMock.description);
  });
});
