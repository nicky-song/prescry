// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { TestResultConnected } from '../../../components/member/test-result/test-result.connected';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import {
  TestResultScreen,
  ITestResultScreenDataProps,
  ITestResultScreenDispatchProps,
} from './test-result.screen';
import { PersonalInfoExpanderConnected } from '../../../components/member/personal-info-expander/personal-info-expander.connected';
import { testResultScreenStyles } from './test-result.screen.styles';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../testing/test.helper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useUrl } from '../../../hooks/use-url';
import { navigatePastProceduresListDispatch } from '../store/navigation/dispatch/navigate-past-procedures-list.dispatch';
import { popToTop } from '../navigation/navigation.helper';

jest.mock('../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../components/member/test-result/test-result.connected',
  () => ({
    TestResultConnected: () => <div />,
  })
);

jest.mock(
  '../store/navigation/dispatch/navigate-past-procedures-list.dispatch'
);
const navigatePastProceduresListDispatchMock =
  navigatePastProceduresListDispatch as jest.Mock;

jest.mock(
  '../../../components/member/personal-info-expander/personal-info-expander.connected',
  () => ({ PersonalInfoExpanderConnected: () => <div /> })
);

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../hooks/use-url');
const useUrlMock = useUrl as jest.Mock;

const mockTestResultsScreenProps: ITestResultScreenDispatchProps &
  ITestResultScreenDataProps = {
  getTestResult: jest.fn(),
};

const getTestResultMock = mockTestResultsScreenProps.getTestResult as jest.Mock;
const propsWithTestResultMock = {
  ...mockTestResultsScreenProps,
  getTestResult: getTestResultMock,
};

const orderNumberMock = '1234';

describe('TestResultScreen', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({
      params: {
        backToList: true,
        orderNumber: orderNumberMock,
      },
    });
  });
  it('renders as BasicPageConnected', () => {
    const testRenderer = renderer.create(
      <TestResultScreen {...mockTestResultsScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.showProfileAvatar).toEqual(true);
    expect(pageProps.translateContent).toEqual(true);
  });

  it('renders as BasicPageConnected with navigation.goback if backToList is false', () => {
    useRouteMock.mockReturnValue({ params: { backToList: false } });
    const testRenderer = renderer.create(
      <TestResultScreen {...mockTestResultsScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    pageProps.navigateBack();
    expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
  });

  it('renders as BasicPageConnected with navigatePastProceduresListDispatch if backToList is true', () => {
    useRouteMock.mockReturnValue({ params: { backToList: true } });
    const testRenderer = renderer.create(
      <TestResultScreen {...mockTestResultsScreenProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    pageProps.navigateBack();
    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(navigatePastProceduresListDispatchMock).toHaveBeenCalledTimes(1);
    expect(navigatePastProceduresListDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      true
    );
  });

  it('renders body in content container', () => {
    const serviceDescriptionMock = 'service-description';
    const testRenderer = renderer.create(
      <TestResultScreen
        {...propsWithTestResultMock}
        serviceDescription={serviceDescriptionMock}
      />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const contentContainer = basicPageConnected.props.body;

    expect(contentContainer.type).toEqual(BodyContentContainer);
    expect(contentContainer.props.title).toEqual(serviceDescriptionMock);
    expect(contentContainer.props.translateTitle).toEqual(false);
    expect(getChildren(contentContainer).length).toEqual(2);
  });

  it('renders body with PersonalInfoExpanderConnected', () => {
    const testRenderer = renderer.create(
      <TestResultScreen {...propsWithTestResultMock} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;

    const testResults = body.props.children[0];
    expect(testResults.type).toEqual(PersonalInfoExpanderConnected);
    expect(testResults.props.viewStyle).toEqual(
      testResultScreenStyles.expanderViewStyle
    );
  });

  it('renders body with TestResultsConnected and expected properties', () => {
    const testRenderer = renderer.create(
      <TestResultScreen {...propsWithTestResultMock} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;

    const testResults = body.props.children[1];
    expect(testResults.type).toEqual(TestResultConnected);
    expect(testResults.props.viewStyle).toEqual(
      testResultScreenStyles.bodyViewStyle
    );
  });

  it('update url with vaccine orderNumber if props provides orderNumber', () => {
    renderer.create(<TestResultScreen {...propsWithTestResultMock} />);

    expect(useUrlMock).toHaveBeenCalledWith(`/results/test/${orderNumberMock}`);
  });
});
