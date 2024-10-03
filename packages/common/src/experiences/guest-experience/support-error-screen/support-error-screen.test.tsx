// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SupportErrorScreenContainer } from '../../../components/member/support-error-container/support-error.container';
import { IBasicPageProps } from '../../../components/pages/basic-page';
import {
  ISupportErrorScreenActionProps,
  ISupportErrorScreenProps,
  SupportErrorScreen,
} from './support-error-screen';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { SupportErrorBackNavigationType } from '../store/support-error/support-error.reducer';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../testing/test.helper';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { assertIsDefined } from '../../../assertions/assert-is-defined';

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

const mockSupportErrorScreenProps: ISupportErrorScreenActionProps &
  ISupportErrorScreenProps = {
  reloadPageAction: jest.fn(),
};

describe('SupportErrorScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigationMock.mockReturnValue({});
  });

  it.each([['LogoutAndStartOverAtLogin'], ['NavigateBackOneAndTryAgain']])(
    'renders in BasicPageConnected (errorBackNavigationType: %p)',
    (errorBackNavigationTypeMock: string) => {
      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      const reloadPageActionMock = jest.fn();
      const testRenderer = renderer.create(
        <SupportErrorScreen
          {...mockSupportErrorScreenProps}
          reloadPageAction={reloadPageActionMock}
          errorBackNavigationType={
            errorBackNavigationTypeMock as SupportErrorBackNavigationType
          }
        />
      );

      const page = testRenderer.root.children[0] as ReactTestInstance;

      expect(page.type).toEqual(BasicPageConnected);

      const pageProps = page.props as IBasicPageProps;
      expect(pageProps.hideNavigationMenuButton).toEqual(true);

      const expectedNavigateBack =
        (errorBackNavigationTypeMock as SupportErrorBackNavigationType) ===
        'LogoutAndStartOverAtLogin'
          ? expect.any(Function)
          : rootStackNavigationMock.goBack;
      expect(pageProps.navigateBack).toEqual(expectedNavigateBack);

      if (errorBackNavigationTypeMock === 'LogoutAndStartOverAtLogin') {
        assertIsDefined(pageProps.navigateBack);
        pageProps.navigateBack();

        expect(reloadPageActionMock).toHaveBeenCalledWith(
          rootStackNavigationMock
        );
      }
    }
  );

  it('renders body in content container', () => {
    const testRenderer = renderer.create(
      <SupportErrorScreen {...mockSupportErrorScreenProps} />
    );

    const page = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = page.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(getChildren(bodyContainer).length).toEqual(1);
  });

  it('renders support error container', () => {
    const reloadPageActionMock = jest.fn();
    const errorMessageMock = 'error-message';
    const testRenderer = renderer.create(
      <SupportErrorScreen
        {...mockSupportErrorScreenProps}
        reloadPageAction={reloadPageActionMock}
        errorMessage={errorMessageMock}
      />
    );

    const page = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = page.props.body;
    const errorContainer = getChildren(bodyContainer)[0];

    expect(errorContainer.type).toEqual(SupportErrorScreenContainer);
    expect(errorContainer.props.errorMessage).toEqual(errorMessageMock);
    expect(errorContainer.props.reloadPageAction).toEqual(reloadPageActionMock);
  });
});
