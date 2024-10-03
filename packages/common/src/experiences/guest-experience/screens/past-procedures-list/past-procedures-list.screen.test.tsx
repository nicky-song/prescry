// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import {
  IPastProceduresListScreenRouteProps,
  PastProceduresListScreen,
} from './past-procedures-list.screen';
import { PastProceduresList } from '../../../../components/member/lists/past-procedures-list/past-procedures-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import { pastProceduresStackNavigationMock } from '../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { pastProceduresListScreenContent } from './past-procedures-list.screen.content';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../context-providers/redux/redux.context';
import { useUrl } from '../../../../hooks/use-url';

jest.mock('../../../../hooks/use-url');
const useUrlMock = useUrl as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));
jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock(
  '../../../../components/member/lists/past-procedures-list/past-procedures-list',
  () => ({
    PastProceduresList: () => <div />,
  })
);

jest.mock(
  '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

describe('PastProceduresListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigationMock.mockReturnValue(pastProceduresStackNavigationMock);
    useRouteMock.mockReturnValue({});

    const reduxContextMock: Partial<IReduxContext> = {
      getState: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
  });

  it('renders as BasicPageConnected with expected properties', () => {
    const testRenderer = renderer.create(<PastProceduresListScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(basicPageConnected.type).toEqual(BasicPageConnected);

    const pageProps = basicPageConnected.props;
    expect(pageProps.showProfileAvatar).toEqual(true);
    expect(pageProps.navigateBack).toEqual(expect.any(Function));
    expect(pageProps.translateContent).toEqual(true);
  });

  it.each([[undefined], [false], [true]])(
    'handles navigate back (backToHome: %p)',
    (backToHomeMock: boolean | undefined) => {
      const routeParamsMock: IPastProceduresListScreenRouteProps = {
        backToHome: backToHomeMock,
      };
      useRouteMock.mockReturnValue({ params: routeParamsMock });

      const reduxContextMock: Partial<IReduxContext> = {
        getState: jest.fn(),
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);

      const testRenderer = renderer.create(<PastProceduresListScreen />);

      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);
      basicPageConnected.props.navigateBack();

      if (backToHomeMock) {
        expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledWith(
          reduxContextMock.getState,
          pastProceduresStackNavigationMock
        );
      } else {
        expect(pastProceduresStackNavigationMock.goBack).toHaveBeenCalledWith();
      }
    }
  );

  it('renders body with PastProceduresList', () => {
    const testRenderer = renderer.create(<PastProceduresListScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;

    expect(bodyProp.type).toBe(PastProceduresList);
    expect(bodyProp.props.navigation).toEqual(
      pastProceduresStackNavigationMock
    );
    expect(bodyProp.props.title).toEqual(pastProceduresListScreenContent.title);
  });

  it('update url with /results', () => {
    renderer.create(<PastProceduresListScreen />);

    expect(useUrlMock).toHaveBeenCalledWith('/results');
  });
});
