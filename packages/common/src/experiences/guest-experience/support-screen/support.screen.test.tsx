// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SupportContactContainer } from '../../../components/member/support-container/support-contact-container';
import { SupportScreen } from './support.screen';
import { supportScreenContent } from './support.screen.content';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../testing/test.helper';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock(
  '../../../components/member/support-container/support-contact-container',
  () => ({
    SupportContactContainer: () => <div />,
  })
);

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

describe('SupportScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });

  it('renders as BasicPageConnected', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const testRenderer = renderer.create(<SupportScreen />);

    const page = testRenderer.root.children[0] as ReactTestInstance;

    expect(page.type).toEqual(BasicPageConnected);
    expect(page.props.navigateBack).toEqual(rootStackNavigationMock.goBack);
    expect(page.props.hideNavigationMenuButton).toEqual(true);
    expect(page.props.translateContent).toEqual(true);
  });

  it('renders body in body content container', () => {
    const testRenderer = renderer.create(<SupportScreen />);

    const page = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = page.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(supportScreenContent.title);
    expect(getChildren(bodyContainer).length).toEqual(1);
  });

  it('renders SupportContactContainer', () => {
    const testRenderer = renderer.create(<SupportScreen />);
    const page = testRenderer.root.findByType(BasicPageConnected);

    const body = page.props.body;
    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const contactContainer = getChildren(contentContainer)[0];

    expect(contactContainer.type).toEqual(SupportContactContainer);
  });
});
