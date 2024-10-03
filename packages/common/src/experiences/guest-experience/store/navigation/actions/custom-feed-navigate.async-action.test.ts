// Copyright 2021 Prescryptive Health, Inc.

import { IStaticFeedContextServiceItem } from '../../../../../models/static-feed';
import { customFeedNavigateAsyncAction } from './custom-feed-navigate.async-action';
import { resetServiceTypeAction } from '../../service-type/actions/reset-service-type.action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../service-type/actions/reset-service-type.action');
const resetServiceTypeActionMock = resetServiceTypeAction as jest.Mock;

describe('customFeedNavigateAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('navigates to expected screen for serviceType cards', async () => {
    const dispatchMock = jest.fn();
    const thunk = await customFeedNavigateAsyncAction(
      rootStackNavigationMock,
      'c19Vaccine'
    );
    await thunk(dispatchMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      {
        screen: 'PharmacyLocations',
      }
    );
  });
  it('navigates to expected screen for serviceList feed', async () => {
    const dispatchMock = jest.fn();
    const services = [
      {
        title: 'title',
        description: 'description',
        subText: [
          {
            language: 'English',
            markDownText: 'subtext-english-markdown-text-1-mock',
          },
          {
            language: 'Spanish',
            markDownText: 'subtext-spanish-markdown-text-1-mock',
          },
        ],
        cost: '$155',
        enabled: true,
      } as IStaticFeedContextServiceItem,
      {
        title: 'title2',
        description: 'description2',
        subText: [
          {
            language: 'English',
            markDownText: 'subtext-english-markdown-text-2-mock',
          },
          {
            language: 'Spanish',
            markDownText: 'subtext-spanish-markdown-text-2-mock',
          },
        ],
        cost: '$65',
        enabled: true,
      } as IStaticFeedContextServiceItem,
    ];
    const thunk = await customFeedNavigateAsyncAction(
      rootStackNavigationMock,
      undefined,
      services
    );
    await thunk(dispatchMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      {
        screen: 'ServiceSelection',
        params: { services },
      }
    );
  });
  it('doesnt navigate to any screen when serviceType/Services are not passed passed', async () => {
    const dispatchMock = jest.fn();
    const thunk = await customFeedNavigateAsyncAction(rootStackNavigationMock);
    await thunk(dispatchMock);
    expect(rootStackNavigationMock.navigate).not.toBeCalled();
    expect(resetServiceTypeActionMock).not.toBeCalled();
  });
});
