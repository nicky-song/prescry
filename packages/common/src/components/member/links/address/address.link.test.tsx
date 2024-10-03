// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ViewStyle } from 'react-native';
import { AddressLink } from './address.link';
import { MapUrlHelper } from '../../../../utils/map-url.helper';
import { InlineLink } from '../inline/inline.link';
import { ITestContainer } from '../../../../testing/test.container';
import { getChildren } from '../../../../testing/test.helper';
import { goToUrl } from '../../../../utils/link.helper';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';

jest.mock('../../../../utils/link.helper');

jest.mock('../../../../utils/map-url.helper');
const getUrlMock = MapUrlHelper.getUrl as jest.Mock;

jest.mock('../inline/inline.link', () => ({
  InlineLink: ({ children }: ITestContainer) => <div>{children}</div>,
}));

describe('AddressLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUrlMock.mockReturnValue('');
  });

  it('renders in text container', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <AddressLink
        formattedAddress='formatted-address'
        viewStyle={customViewStyle}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(ProtectedBaseText);
    expect(getChildren(container).length).toEqual(1);
  });

  it('renders as InlineLink in container', () => {
    const formattedAddressMock = 'formatted-address';
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <AddressLink
        formattedAddress={formattedAddressMock}
        viewStyle={customViewStyle}
      />
    );

    const container = testRenderer.root.findByType(ProtectedBaseText);
    const link = getChildren(container)[0];

    expect(link.type).toEqual(InlineLink);
    expect(link.props.children).toEqual(formattedAddressMock);
    expect(link.props.onPress).toEqual(expect.any(Function));
    expect(link.props.textStyle).toEqual(customViewStyle);
  });

  it('opens expected map URL when address clicked', async () => {
    const formattedAddressMock = 'formatted-address';
    const testRenderer = renderer.create(
      <AddressLink formattedAddress={formattedAddressMock} />
    );

    const formattedUrlMock = 'url with spaces';
    getUrlMock.mockReturnValue(formattedUrlMock);

    const container = testRenderer.root.findByType(ProtectedBaseText);
    const linkButton = container.props.children;
    await linkButton.props.onPress();

    expect(linkButton.type).toBe(InlineLink);
    expect(getUrlMock).toHaveBeenCalledWith(formattedAddressMock);

    const expectedUrl = formattedUrlMock.replace(' ', '+');

    expect(goToUrl).toHaveBeenCalledTimes(1);
    expect(goToUrl).toHaveBeenCalledWith(expectedUrl);
  });
});
