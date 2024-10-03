// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ContactCaregiverScreen } from './contact-caregiver.screen';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../testing/test.helper';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

import { useRoute } from '@react-navigation/native';
jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

describe(' ContactCaregiver', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({
      params: {
        group_number: 'test',
        supportEmail: 'support@prescryptive.com',
      },
    });
  });

  it('renders as BasicPageConnected', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const testRenderer = renderer.create(<ContactCaregiverScreen />);

    const page = testRenderer.root.findByType(BasicPageConnected);

    expect(page.type).toEqual(BasicPageConnected);
    expect(page.props.translateContent).toEqual(true);
  });

  it('renders body in body content container', () => {
    const testRenderer = renderer.create(<ContactCaregiverScreen />);

    const page = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = page.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(getChildren(bodyContainer).length).toEqual(1);
  });
});
