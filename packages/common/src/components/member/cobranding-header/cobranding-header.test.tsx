// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { CobrandingHeader, ICobrandingHeaderProps } from './cobranding-header';
import { cobrandingHeaderStyles } from './cobranding-header.styles';

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../remote-image-asset/remote-image-asset', () => ({
  RemoteImageAsset: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const providedByLabelMock = 'provided-by-mock';
const uiContentMock: Partial<IGlobalContent> = {
  providedBy: providedByLabelMock,
};

const urlMock = 'logo-url-mock';

const cobrandingHeaderPropsMock: ICobrandingHeaderProps = {
  logoUrl: urlMock,
};

describe('CobrandingHeader', () => {
  beforeEach(() => {
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('renders in view container', () => {
    const testRenderer = renderer.create(
      <CobrandingHeader {...cobrandingHeaderPropsMock} />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const childrens = getChildren(container);

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('cobrandingHeader');
    expect(container.props.style).toEqual(
      cobrandingHeaderStyles.containerViewStyle
    );
    expect(childrens.length).toEqual(2);
  });

  it('renders title', () => {
    const testRenderer = renderer.create(
      <CobrandingHeader {...cobrandingHeaderPropsMock} />
    );

    const container = testRenderer.root.findByProps({
      testID: 'cobrandingHeader',
    });

    const baseText = getChildren(container)[0];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(cobrandingHeaderStyles.titleTextStyle);
    expect(baseText.props.children).toEqual(providedByLabelMock);
  });

  it('renders cobranding logo', () => {
    const testRenderer = renderer.create(
      <CobrandingHeader {...cobrandingHeaderPropsMock} />
    );

    const container = testRenderer.root.findByProps({
      testID: 'cobrandingHeader',
    });

    const cobrandingLogo = getChildren(container)[1];

    expect(cobrandingLogo.props.style).toEqual(
      cobrandingHeaderStyles.logoStyle
    );
    expect(cobrandingLogo.props.uri).toEqual(urlMock);
  });
});
