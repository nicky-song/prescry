// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { FontAwesomeIcon } from '../../../../../../components/icons/font-awesome/font-awesome.icon';
import { Heading } from '../../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { PrimaryColor } from '../../../../../../theming/colors';
import { IconSize } from '../../../../../../theming/icons';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { pharmaciesSectionStyles } from './pharmacies.section.styles';
import { PharmaciesSection } from './pharmacies.section';
import { getChildren } from '../../../../../../testing/test.helper';

jest.mock(
  '../../../../../../components/icons/font-awesome/font-awesome.icon',
  () => ({
    FontAwesomeIcon: () => <div />,
  })
);

jest.mock('../../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const contentMock = {
  heading: 'heading-mock',
  label: 'label-mock',
  description: 'description-mock',
};

const isContentLoadingMock = false;

describe('PharmaciesSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('gets content as expected', () => {
    renderer.create(<PharmaciesSection />);

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.pharmaciesSection,
      2
    );
  });

  it('renders as View with expected ViewStyle from props', () => {
    const viewStyleMock = {};

    const testRenderer = renderer.create(
      <PharmaciesSection viewStyle={viewStyleMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(viewStyleMock);
    expect(getChildren(view).length).toEqual(2);
  });

  it('renders Heading as first child', () => {
    const viewStyleMock = {};

    const testRenderer = renderer.create(
      <PharmaciesSection viewStyle={viewStyleMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const heading = getChildren(view)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(heading.props.children).toEqual(contentMock.heading);
  });

  it('renders icon, label, and description as second child', () => {
    const viewStyleMock = {};

    const testRenderer = renderer.create(
      <PharmaciesSection viewStyle={viewStyleMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const section = getChildren(view)[1];

    expect(section.type).toEqual(View);
    expect(section.props.style).toEqual(
      pharmaciesSectionStyles.sectionViewStyle
    );
    expect(getChildren(section).length).toEqual(2);

    const iconView = getChildren(section)[0];

    expect(iconView.type).toEqual(View);
    expect(iconView.props.style).toEqual(pharmaciesSectionStyles.iconViewStyle);

    const icon = getChildren(iconView)[0];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('phone-alt');
    expect(icon.props.size).toEqual(IconSize.regular);
    expect(icon.props.color).toEqual(PrimaryColor.darkBlue);

    const textView = getChildren(section)[1];

    expect(textView.type).toEqual(View);
    expect(textView.props.style).toEqual(pharmaciesSectionStyles.textViewStyle);

    const label = getChildren(textView)[0];
    const description = getChildren(textView)[1];

    expect(label.type).toEqual(BaseText);
    expect(label.props.style).toEqual(pharmaciesSectionStyles.labelTextStyle);
    expect(label.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(label.props.children).toEqual(contentMock.label);

    expect(description.type).toEqual(BaseText);
    expect(description.props.style).toEqual(
      pharmaciesSectionStyles.bodyTextStyle
    );
    expect(description.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(description.props.children).toEqual(contentMock.description);
  });
});
