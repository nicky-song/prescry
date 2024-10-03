// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { Heading } from '../../../../../components/member/heading/heading';
import { SlideUpModal } from '../../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { benefitPlanLearnMoreModalStyles } from './benefit-plan.learn-more-modal.styles';
import { BenefitPlanLearnMoreModal } from './benefit-plan.learn-more-modal';
import { IBenefitPlanLearnMoreModalContent } from './benefit-plan.learn-more-modal.content';
import { getChildren } from '../../../../../testing/test.helper';

jest.mock('../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../../../../components/modal/slide-up/slide-up.modal', () => ({
  SlideUpModal: () => <div />,
}));

jest.mock(
  '../../../context-providers/session/ui-content-hooks/use-content',
  () => ({
    BaseText: () => <div />,
  })
);

jest.mock(
  '../../../context-providers/session/ui-content-hooks/use-content',
  () => ({
    useContent: jest.fn(),
  })
);

const useContentMock = useContent as jest.Mock;

describe('BenefitPlanLearnMoreModal', () => {
  const onClosePressMock = jest.fn();
  const showModalMock = true;
  const isContentLoadingMock = false;

  const benefitPlanLearnMoreModalContentMock: IBenefitPlanLearnMoreModalContent =
    {
      heading: 'heading-mock',
      headingOne: 'heading-one-mock',
      descriptionOne: 'description-one-mock',
    };

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      isContentLoading: isContentLoadingMock,
      content: benefitPlanLearnMoreModalContentMock,
    });
  });

  it('calls useContent with expected props', () => {
    renderer.create(
      <BenefitPlanLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
      />
    );

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.benefitPlanLearnMoreModal,
      2
    );
  });

  it('renders as SlideUpModal with expected props', () => {
    const viewStyleMock = {};

    const testRenderer = renderer.create(
      <BenefitPlanLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
        viewStyle={viewStyleMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    expect(slideUpModal.type).toEqual(SlideUpModal);
    expect(slideUpModal.props.isVisible).toEqual(showModalMock);
    expect(slideUpModal.props.heading).toEqual(
      benefitPlanLearnMoreModalContentMock.heading
    );
    expect(slideUpModal.props.onClosePress).toEqual(onClosePressMock);
    expect(slideUpModal.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(slideUpModal.props.viewStyle).toEqual(viewStyleMock);
    expect(slideUpModal.props.children.type).toEqual(View);
  });

  it('renders body with Heading first', () => {
    const testRenderer = renderer.create(
      <BenefitPlanLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    const body = getChildren(slideUpModal)[0];

    expect(body.type).toEqual(View);
    expect(getChildren(body).length).toEqual(2);

    const heading = getChildren(body)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(heading.props.level).toEqual(3);
    expect(heading.props.children).toEqual(
      benefitPlanLearnMoreModalContentMock.headingOne
    );
  });

  it('renders body with Heading first', () => {
    const testRenderer = renderer.create(
      <BenefitPlanLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    const body = getChildren(slideUpModal)[0];

    expect(body.type).toEqual(View);
    expect(getChildren(body).length).toEqual(2);

    const baseText = getChildren(body)[1];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(baseText.props.style).toEqual(
      benefitPlanLearnMoreModalStyles.descriptionTextStyle
    );
    expect(baseText.props.children).toEqual(
      benefitPlanLearnMoreModalContentMock.descriptionOne
    );
  });
});
