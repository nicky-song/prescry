// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Heading } from '../../../../../../components/member/heading/heading';
import { InlineLink } from '../../../../../../components/member/links/inline/inline.link';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { getChildren } from '../../../../../../testing/test.helper';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { BenefitPlanSection } from './benefit-plan.section';
import { benefitPlanSectionStyles } from './benefit-plan.section.styles';

jest.mock('../../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock(
  '../../../../../../components/member/links/inline/inline.link',
  () => ({
    InlineLink: () => <div />,
  })
);

jest.mock('../../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

describe('BenefitPlanSection', () => {
  const contentMock = {
    heading: 'heading-mock',
    description: 'description-mock',
    learnMore: 'learn-more-mock',
  };
  const isContentLoadingMock = false;

  beforeEach(() => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('calls useContent as expected', () => {
    renderer.create(<BenefitPlanSection />);

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.benefitPlanSection,
      2
    );
  });

  it('renders a View with expected props', () => {
    const viewStyleMock = {};

    const testRenderer = renderer.create(
      <BenefitPlanSection viewStyle={viewStyleMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(viewStyleMock);
    expect(getChildren(view).length).toEqual(2);
  });

  it('renders Heading with expected props', () => {
    const testRenderer = renderer.create(<BenefitPlanSection />);

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const heading = getChildren(view)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(heading.props.translateContent).toEqual(false);
    expect(heading.props.children).toEqual(contentMock.heading);
  });

  it('renders BaseText with expected children and props', () => {
    const onLearnMorePressMock = jest.fn();
    const testRenderer = renderer.create(
      <BenefitPlanSection onLearnMorePress={onLearnMorePressMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const baseTextParent = getChildren(view)[1];

    expect(baseTextParent.type).toEqual(BaseText);

    expect(baseTextParent.props.style).toEqual(
      benefitPlanSectionStyles.descriptionTextStyle
    );

    const baseText = getChildren(baseTextParent)[0];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(baseText.props.children).toEqual(contentMock.description + ' ');

    const inlineLink = getChildren(baseTextParent)[1];

    expect(inlineLink.type).toEqual(InlineLink);
    expect(inlineLink.props.onPress).toEqual(onLearnMorePressMock);
    expect(inlineLink.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(inlineLink.props.children).toEqual(contentMock.learnMore);
  });
});
