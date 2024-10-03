// Copyright 2020 Prescryptive Health, Inc.

import { navigatePastProceduresListDispatch } from './navigate-past-procedures-list.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IPastProceduresListScreenRouteProps } from '../../../screens/past-procedures-list/past-procedures-list.screen';

const navigateMock = jest.fn();
const navigationMock = {
  navigate: navigateMock,
} as unknown as RootStackNavigationProp;

describe('navigatePastProceduresListDispatch', () => {
  it('navigates to PastProceduresList screen', () => {
    const backToHomeMock = true;
    navigatePastProceduresListDispatch(navigationMock, backToHomeMock);

    expect(navigationMock.navigate).toHaveBeenCalledTimes(1);

    const expectedRouteParams: IPastProceduresListScreenRouteProps = {
      backToHome: backToHomeMock,
    };
    expect(navigateMock).toHaveBeenCalledWith('PastProceduresStack', {
      screen: 'PastProceduresList',
      params: expectedRouteParams,
    });
  });
});
