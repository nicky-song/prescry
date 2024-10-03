// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Heading } from '../../../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../../../components/member/line-separator/line-separator';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { IOrderConfirmationScreenContent } from '../../order-confirmation.screen.content';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { WhatIsNextSection } from './what-is-next.section';
import { whatIsNextSectionStyle } from './what-is-next.section.styles';

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');

const useContentMock = useContent as jest.Mock;

jest.mock('../../../../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const contentMock: Partial<IOrderConfirmationScreenContent> = {
  whatIsNextHeader: 'what-is-next-header-mock',
  whatIsNextInstructions: 'what-is-next-instructions-mock',
};

describe('WhatIsNextSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });

  it('renders in section', () => {
    const testRenderer = renderer.create(<WhatIsNextSection />);

    const section = testRenderer.root.children[0] as ReactTestInstance;

    expect(section.type).toEqual(SectionView);
    expect(section.props.testID).toEqual('whatIsNextSection');
    expect(section.props.children.length).toEqual(3);
  });

  it('renders section separator', () => {
    const testRenderer = renderer.create(<WhatIsNextSection />);

    const section = testRenderer.root.findByType(SectionView);
    const separator = section.props.children[2];

    expect(separator.type).toEqual(LineSeparator);
    expect(separator.props.viewStyle).toEqual(
      whatIsNextSectionStyle.separatorViewStyle
    );
  });

  it('renders heading', () => {
    const testRenderer = renderer.create(<WhatIsNextSection />);

    const section = testRenderer.root.findByType(SectionView);
    const heading = section.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.textStyle).toEqual(
      whatIsNextSectionStyle.heading2TextStyle
    );
    expect(heading.props.children).toEqual(contentMock.whatIsNextHeader);
  });

  it('renders instructions', () => {
    const testRenderer = renderer.create(<WhatIsNextSection />);

    const section = testRenderer.root.findByType(SectionView);
    const instructions = section.props.children[1];

    expect(instructions.type).toEqual(BaseText);
    expect(instructions.props.children).toEqual(
      contentMock.whatIsNextInstructions
    );
  });

  it('renders custom content if passed in the props', () => {
    const customContent = 'test content';
    const testRenderer = renderer.create(
      <WhatIsNextSection customContent={customContent} />
    );

    const section = testRenderer.root.findByType(SectionView);
    const instructions = section.props.children[1];

    expect(instructions.type).toEqual(BaseText);
    expect(instructions.props.children).toEqual(customContent);
  });

  it('renders section with viewStyle if passed in the props', () => {
    const viewStyle: ViewStyle = {
      marginTop: 0,
    };

    const testRenderer = renderer.create(
      <WhatIsNextSection viewStyle={viewStyle} />
    );

    const section = testRenderer.root.findByType(SectionView);
    expect(section.props.style).toEqual(viewStyle);
  });

  it('renders skeletons when isSkeleton is true', () => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: true,
    });
    const testRenderer = renderer.create(<WhatIsNextSection />);

    const section = testRenderer.root.findByType(SectionView);
    const heading = section.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.isSkeleton).toEqual(true);

    const instructions = section.props.children[1];

    expect(instructions.type).toEqual(BaseText);
    expect(instructions.props.isSkeleton).toEqual(true);
  });
});
